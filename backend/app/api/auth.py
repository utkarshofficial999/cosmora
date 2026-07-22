"""Cosmos Platform — Authentication Router.

Provides API endpoints for user registration, authentication login/logout,
token refresh, current profile retrieval, and password modification.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Form, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    Token,
)
from app.schemas.user import ChangePasswordRequest, UserCreate, UserResponse
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User",
    description="Create a new user account with validated credentials and assigned role.",
)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Register a new user account."""
    auth_service = AuthService(db)
    return await auth_service.register_user(user_in)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    description="Authenticate credentials and issue JWT Access & Refresh tokens. Supports JSON payload or Form Data (Swagger UI OAuth2 format).",
)
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> Token:
    """Authenticate user and return JWT bearer token pair."""
    auth_service = AuthService(db)
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body_data = await request.json()
        login_req = LoginRequest(**body_data)
        username_or_email = login_req.username
        password = login_req.password
    elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        form_data = await request.form()
        username_or_email = str(form_data.get("username", ""))
        password = str(form_data.get("password", ""))
    else:
        username_or_email = ""
        password = ""

    return await auth_service.authenticate_user(username_or_email, password)


@router.post(
    "/refresh",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Refresh Access Token",
    description="Generate a fresh JWT Access & Refresh token pair using a valid refresh token.",
)
async def refresh_token(
    body: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
) -> Token:
    """Issue new token pair using refresh token."""
    auth_service = AuthService(db)
    return await auth_service.refresh_tokens(body.refresh_token)


@router.post(
    "/logout",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="User Logout",
    description="Log out current user session. Client should clear local token storage.",
)
async def logout(
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    """Log out the current user session."""
    return MessageResponse(message=f"User '{current_user.username}' successfully logged out.")


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current User Profile",
    description="Retrieve account details and role permissions for the currently authenticated user.",
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Return profile details for the authenticated user."""
    return UserResponse.model_validate(current_user)


@router.post(
    "/change-password",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Change Password",
    description="Update password for currently authenticated user.",
)
async def change_password(
    body: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MessageResponse:
    """Change user password after verifying current password."""
    auth_service = AuthService(db)
    await auth_service.change_password(
        user=current_user,
        current_password=body.current_password,
        new_password=body.new_password,
    )
    return MessageResponse(message="Password successfully updated.")
