package api

import (
	"net/http"

	"github.com/JakeFen/watchr/backend/internal/database"
)

// ListUserFriends handles GET /users/{userID}/friends. No auth
// required -- like media entries, a friends list isn't private.
func (h *Handler) ListUserFriends(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("userID")

	friends, err := database.ListFriendsByUserID(r.Context(), h.DB, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list friends")
		return
	}

	writeJSON(w, http.StatusOK, friends)
}
