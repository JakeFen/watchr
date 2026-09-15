package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/JakeFen/watchr/backend/internal/auth"
	"github.com/JakeFen/watchr/backend/internal/database"
)

type createCommentRequest struct {
	Body string `json:"body"`
}

// CreateComment handles POST /media-entries/{id}/comments. The caller
// must be authenticated. body is required and may not be blank.
func (h *Handler) CreateComment(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	var req createCommentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	body := strings.TrimSpace(req.Body)
	if body == "" {
		writeError(w, http.StatusBadRequest, "body is required")
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	mediaEntryID := r.PathValue("id")
	comment, err := database.CreateComment(r.Context(), h.DB, userID, mediaEntryID, body)
	if errors.Is(err, database.ErrMediaEntryNotFound) {
		writeError(w, http.StatusNotFound, "media entry not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create comment")
		return
	}

	writeJSON(w, http.StatusCreated, comment)
}

// ListMediaEntryComments handles GET /media-entries/{id}/comments. No
// auth required -- comments aren't private, same as the entries
// they're attached to.
func (h *Handler) ListMediaEntryComments(w http.ResponseWriter, r *http.Request) {
	mediaEntryID := r.PathValue("id")

	comments, err := database.ListCommentsByMediaEntryID(r.Context(), h.DB, mediaEntryID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list comments")
		return
	}

	writeJSON(w, http.StatusOK, comments)
}

// DeleteComment handles DELETE /comments/{id}. Only the comment's
// author may delete it; a mismatched owner and a missing id both
// respond 404, so callers can't use this to probe which ids exist.
func (h *Handler) DeleteComment(w http.ResponseWriter, r *http.Request) {
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

	id := r.PathValue("id")
	deleted, err := database.DeleteComment(r.Context(), h.DB, id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete comment")
		return
	}
	if !deleted {
		writeError(w, http.StatusNotFound, "comment not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
