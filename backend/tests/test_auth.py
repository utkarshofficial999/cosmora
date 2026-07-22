"""Cosmos Platform — Authentication Tests.

Tests for user registration, login, JWT access & refresh tokens, password changes,
profile inspection (/me), and logout.
"""

from datetime import timedelta

import pytest
from httpx import AsyncClient

from app.core.security import create_access_token


@pytest.mark.anyio
async def test_register_user_success(client: AsyncClient) -> None:
    """Test successful user registration."""
    payload = {
        "email": "testuser@cosmos.org",
        "username": "testuser",
        "password": "ValidP@ssword123",
        "first_name": "Test",
        "last_name": "User",
        "role_name": "Customer",
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@cosmos.org"
    assert data["username"] == "testuser"
    assert data["role"]["name"] == "Customer"
    assert "hashed_password" not in data


@pytest.mark.anyio
async def test_register_duplicate_email(client: AsyncClient) -> None:
    """Test registration failure when email already exists."""
    payload = {
        "email": "dup@cosmos.org",
        "username": "user1",
        "password": "ValidP@ssword123",
    }
    resp1 = await client.post("/api/v1/auth/register", json=payload)
    assert resp1.status_code == 201

    payload["username"] = "user2"
    resp2 = await client.post("/api/v1/auth/register", json=payload)
    assert resp2.status_code == 409
    assert "email" in resp2.json()["detail"].lower()


@pytest.mark.anyio
async def test_register_duplicate_username(client: AsyncClient) -> None:
    """Test registration failure when username already exists."""
    payload1 = {
        "email": "user1@cosmos.org",
        "username": "sameuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=payload1)

    payload2 = {
        "email": "user2@cosmos.org",
        "username": "sameuser",
        "password": "ValidP@ssword123",
    }
    resp = await client.post("/api/v1/auth/register", json=payload2)
    assert resp.status_code == 409
    assert "username" in resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_register_weak_password(client: AsyncClient) -> None:
    """Test registration failure when password does not meet strength rules."""
    payload = {
        "email": "weak@cosmos.org",
        "username": "weakuser",
        "password": "simplepassword",
    }
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 422


@pytest.mark.anyio
async def test_login_success_json(client: AsyncClient) -> None:
    """Test login via JSON payload returning JWT tokens."""
    # Register user
    reg_payload = {
        "email": "loginuser@cosmos.org",
        "username": "loginuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    # Login
    login_payload = {
        "username": "loginuser",
        "password": "ValidP@ssword123",
    }
    resp = await client.post("/api/v1/auth/login", json=login_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.anyio
async def test_login_success_form_data(client: AsyncClient) -> None:
    """Test login via OAuth2 Form Data (Swagger UI format)."""
    reg_payload = {
        "email": "formuser@cosmos.org",
        "username": "formuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    resp = await client.post(
        "/api/v1/auth/login",
        data={"username": "formuser", "password": "ValidP@ssword123"},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


@pytest.mark.anyio
async def test_login_invalid_password(client: AsyncClient) -> None:
    """Test login failure with incorrect password."""
    reg_payload = {
        "email": "badpass@cosmos.org",
        "username": "badpassuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "badpassuser", "password": "WrongPassword123!"},
    )
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_get_me_success(client: AsyncClient) -> None:
    """Test fetching profile for authenticated user."""
    reg_payload = {
        "email": "meuser@cosmos.org",
        "username": "meuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "meuser", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    me_resp = await client.get("/api/v1/auth/me", headers=headers)
    assert me_resp.status_code == 200
    data = me_resp.json()
    assert data["email"] == "meuser@cosmos.org"


@pytest.mark.anyio
async def test_get_me_unauthorized_no_token(client: AsyncClient) -> None:
    """Test 401 response when accessing /me without token."""
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401


@pytest.mark.anyio
async def test_get_me_expired_token(client: AsyncClient) -> None:
    """Test 401 response when using an expired JWT token."""
    expired_token = create_access_token(
        data={"sub": "00000000-0000-0000-0000-000000000000"},
        expires_delta=timedelta(seconds=-10),
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    resp = await client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 401
    assert "expired" in resp.json()["detail"].lower()


@pytest.mark.anyio
async def test_refresh_token_success(client: AsyncClient) -> None:
    """Test issuing a new access token using a valid refresh token."""
    reg_payload = {
        "email": "refuser@cosmos.org",
        "username": "refuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "refuser", "password": "ValidP@ssword123"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    ref_resp = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert ref_resp.status_code == 200
    data = ref_resp.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.anyio
async def test_change_password_success(client: AsyncClient) -> None:
    """Test changing user password successfully."""
    reg_payload = {
        "email": "chgpass@cosmos.org",
        "username": "chgpassuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "chgpassuser", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chg_payload = {
        "current_password": "ValidP@ssword123",
        "new_password": "NewSecureP@ssword456",
    }
    chg_resp = await client.post(
        "/api/v1/auth/change-password",
        json=chg_payload,
        headers=headers,
    )
    assert chg_resp.status_code == 200

    # Verify login with new password works
    new_login = await client.post(
        "/api/v1/auth/login",
        json={"username": "chgpassuser", "password": "NewSecureP@ssword456"},
    )
    assert new_login.status_code == 200


@pytest.mark.anyio
async def test_logout_success(client: AsyncClient) -> None:
    """Test logging out authenticated user."""
    reg_payload = {
        "email": "logoutuser@cosmos.org",
        "username": "logoutuser",
        "password": "ValidP@ssword123",
    }
    await client.post("/api/v1/auth/register", json=reg_payload)

    login_resp = await client.post(
        "/api/v1/auth/login",
        json={"username": "logoutuser", "password": "ValidP@ssword123"},
    )
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    logout_resp = await client.post("/api/v1/auth/logout", headers=headers)
    assert logout_resp.status_code == 200
    assert "logged out" in logout_resp.json()["message"].lower()
