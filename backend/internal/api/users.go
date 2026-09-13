package api

import (
	"net/http"

	"github.com/JakeFen/watchr/backend/internal/auth"
	"github.com/JakeFen/watchr/backend/internal/database"
)

type myUserResponse struct {
	ID string `json:"id"`
}

// GetMyUser handles GET /users/self. "self" identifies the caller by
// their auth token rather than a users.id path segment -- it resolves
// the caller's Clerk session to their local users.id, the id
// everything else (like GET /users/{userID}/media-entries) is keyed
// by. Once the frontend has resolved and cached this, nothing about
// listing or viewing media entries needs the Clerk token at all, since
// that data isn't private.
func (h *Handler) GetMyUser(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	writeJSON(w, http.StatusOK, myUserResponse{ID: userID})
}
