# Cosmora Security & Compliance Policy

Cosmora enforces enterprise security practices:
- **Authentication**: JWT Bearer tokens with short-lived access tokens and refresh token rotation.
- **RBAC**: Strict role-based permissions (`Admin`, `Seller`, `Customer`).
- **Audit Logging**: Immutable records of every admin mutation in `AdminAuditLog`.
- **Security Headers**: Enforces HSTS, CSP, X-Frame-Options DENY, X-Content-Type-Options nosniff.
- **Rate Limiting**: IP and token bucket rate limits per endpoint.
