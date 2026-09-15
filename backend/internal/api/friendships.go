package api

import (
	"errors"
	"net/http"

	"github.com/JakeFen/watchr/backend/internal/auth"
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

// GetFriendshipStatus handles GET /users/{userID}/friendship-status.
// The caller must be authenticated. Returns the status of any
// friendship between the caller and userID -- "pending", "accepted",
// or "" if none exists.
func (h *Handler) GetFriendshipStatus(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	otherUserID := r.PathValue("userID")

	status, err := database.GetFriendshipStatus(r.Context(), h.DB, clerkUserID, otherUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to check friendship status")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": status})
}

// CreateFriendRequest handles POST /users/{userID}/friends. The
// caller must be authenticated; userID is who they're requesting to
// friend. Requesting yourself, or a pair that already has a
// friendship in either direction (pending, accepted, or declined), is
// rejected.
func (h *Handler) CreateFriendRequest(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	addresseeID := r.PathValue("userID")
	if addresseeID == clerkUserID {
		writeError(w, http.StatusBadRequest, "cannot friend yourself")
		return
	}

	requesterID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	// addresseeID might not have a users row yet -- visiting a profile
	// or showing up in search doesn't create one, only an
	// authenticated action does, and the friendships table's foreign
	// keys require both sides to already exist.
	addresseeUserID, err := database.GetOrCreateUser(r.Context(), h.DB, addresseeID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	err = database.CreateFriendRequest(r.Context(), h.DB, requesterID, addresseeUserID)
	if errors.Is(err, database.ErrFriendshipExists) {
		writeError(w, http.StatusConflict, "a friendship already exists between these users")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create friend request")
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// DeleteFriendship handles DELETE /users/{userID}/friends. The caller
// must be authenticated. This removes any friendship row -- accepted
// or still pending, sent or received -- between the caller and
// userID: unfriending, canceling a request you sent, and declining
// one you received are all the same "remove this relationship"
// operation.
func (h *Handler) DeleteFriendship(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	otherUserID := r.PathValue("userID")

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	deleted, err := database.DeleteFriendship(r.Context(), h.DB, userID, otherUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to remove friendship")
		return
	}
	if !deleted {
		writeError(w, http.StatusNotFound, "no friendship found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
