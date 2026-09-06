package auth

import (
	"context"
	"net/http"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
)

// RequireAuth verifies the Clerk session token from the Authorization
// header, responding 403 Forbidden if it's missing or invalid. On
// success, the verified Clerk user id is readable via ClerkUserID.
func RequireAuth(next http.Handler) http.Handler {
	return clerkhttp.RequireHeaderAuthorization()(next)
}

// ClerkUserID returns the authenticated Clerk user id (the token's
// "sub" claim) from the request context. Only set inside a handler
// wrapped by RequireAuth.
func ClerkUserID(ctx context.Context) (string, bool) {
	claims, ok := clerk.SessionClaimsFromContext(ctx)
	if !ok {
		return "", false
	}
	return claims.Subject, true
}
