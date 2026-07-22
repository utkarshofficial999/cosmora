"""Cosmos Platform — Authentication Service.

Implements core business logic for user registration, authentication, token refreshing,
and password modification.
"""

from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    validate_password_strength,
    verify_password,
)
from app.exceptions.auth import (
    AuthenticationError,
    RoleNotFoundError,
    UserAlreadyExistsError,
)
from app.models.user import User
from app.repositories.role import RoleRepository
from app.repositories.user import UserRepository
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserResponse


class AuthService:
    """Service layer for authentication and user management."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.user_repo = UserRepository(session)
        self.role_repo = RoleRepository(session)

    async def register_user(self, user_in: UserCreate) -> UserResponse:
        """Register a new user account."""
        # 1. Check unique email
        existing_email = await self.user_repo.get_by_email(user_in.email, load_role=False)
        if existing_email:
            raise UserAlreadyExistsError("A user with this email address already exists.")

        # 2. Check unique username
        existing_username = await self.user_repo.get_by_username(user_in.username, load_role=False)
        if existing_username:
            raise UserAlreadyExistsError("A user with this username already exists.")

        # 3. Validate password complexity
        validate_password_strength(user_in.password)

        # 4. Fetch assigned role
        role = await self.role_repo.get_by_name(user_in.role_name)
        if not role:
            raise RoleNotFoundError(f"Role '{user_in.role_name}' does not exist.")

        # 5. Hash password and persist user
        hashed_password = get_password_hash(user_in.password)
        user_dict = {
            "email": user_in.email,
            "username": user_in.username,
            "hashed_password": hashed_password,
            "first_name": user_in.first_name,
            "last_name": user_in.last_name,
            "role_id": role.id,
            "is_active": True,
            "is_superuser": False,
        }
        user = await self.user_repo.create(user_dict)

        # Re-fetch user with loaded role for accurate Pydantic serialization
        created_user = await self.user_repo.get_by_id(user.id, load_role=True)
        assert created_user is not None
        return UserResponse.model_validate(created_user)

    async def authenticate_user(self, identifier: str, password: str) -> Token:
        """Authenticate user credentials and issue access and refresh tokens."""
        user = await self.user_repo.get_by_email_or_username(identifier, load_role=True)
        if not user or not verify_password(password, user.hashed_password):
            raise AuthenticationError("Invalid username/email or password.")

        if not user.is_active:
            raise AuthenticationError("User account is inactive.")

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "username": user.username,
            "role": user.role.name,
        }
        access_token = create_access_token(data=token_data)
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    async def refresh_tokens(self, refresh_token_str: str) -> Token:
        """Generate a new access & refresh token pair using a valid refresh token."""
        payload = decode_token(refresh_token_str, expected_type="refresh")
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise AuthenticationError("Invalid refresh token payload.")

        try:
            user_id = UUID(user_id_str)
        except ValueError as err:
            raise AuthenticationError("Invalid user ID in refresh token.") from err

        user = await self.user_repo.get_by_id(user_id, load_role=True)
        if not user or not user.is_active:
            raise AuthenticationError("User associated with token no longer exists or is inactive.")

        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "username": user.username,
            "role": user.role.name,
        }
        new_access_token = create_access_token(data=token_data)
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
        )

    async def change_password(
        self, user: User, current_password: str, new_password: str
    ) -> None:
        """Verify current password and update to new password."""
        if not verify_password(current_password, user.hashed_password):
            raise AuthenticationError("Incorrect current password.")

        validate_password_strength(new_password)
        new_hashed_password = get_password_hash(new_password)
        await self.user_repo.update(user, {"hashed_password": new_hashed_password})
