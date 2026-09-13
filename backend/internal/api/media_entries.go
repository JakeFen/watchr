package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/jackc/pgx/v5"

	"github.com/JakeFen/watchr/backend/internal/auth"
	"github.com/JakeFen/watchr/backend/internal/database"
)

type createMediaEntryRequest struct {
	MediaType  string  `json:"media_type"`
	TMDBID     int     `json:"tmdb_id"`
	Title      string  `json:"title"`
	PosterPath *string `json:"poster_path"`
	Status     string  `json:"status"`
	Rating     *int16  `json:"rating"`
	Review     *string `json:"review"`
}

type updateMediaEntryRequest struct {
	Status string  `json:"status"`
	Rating *int16  `json:"rating"`
	Review *string `json:"review"`
}

// validateMediaType returns an error message if mediaType isn't a
// recognized TMDB media type, or "" if it's valid.
func validateMediaType(mediaType string) string {
	switch mediaType {
	case database.MediaTypeMovie, database.MediaTypeTv:
		return ""
	default:
		return "media_type must be one of movie, tv"
	}
}

// validateStatusAndRating enforces the same rule as the database's own
// CHECK constraint -- rating and review may only be set once status is
// watched -- plus the 1-5 rating range, so a bad request gets a clean
// 400 instead of a raw constraint-violation error. Returns an error
// message, or "" if the combination is valid.
func validateStatusAndRating(status string, rating *int16, review *string) string {
	switch status {
	case database.StatusWantToWatch, database.StatusWatching, database.StatusWatched:
	default:
		return "status must be one of want_to_watch, watching, watched"
	}

	if status == database.StatusWatched {
		if rating != nil && (*rating < 1 || *rating > 5) {
			return "rating must be between 1 and 5"
		}
	} else if rating != nil || review != nil {
		return "rating and review are only allowed once status is watched"
	}

	return ""
}

// CreateMediaEntry handles POST /media-entries. The caller must be
// authenticated. media_type, tmdb_id, title, and status are required;
// rating and review are both optional but may only be set when status
// is watched -- this mirrors the database's own CHECK constraint, so a
// bad request gets a clean 400 here instead of a raw
// constraint-violation error.
func (h *Handler) CreateMediaEntry(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	var req createMediaEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.TMDBID == 0 || req.Title == "" || req.Status == "" {
		writeError(w, http.StatusBadRequest, "media_type, tmdb_id, title, and status are required")
		return
	}
	if message := validateMediaType(req.MediaType); message != "" {
		writeError(w, http.StatusBadRequest, message)
		return
	}

	status := req.Status
	if message := validateStatusAndRating(status, req.Rating, req.Review); message != "" {
		writeError(w, http.StatusBadRequest, message)
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	entry, err := database.CreateMediaEntry(r.Context(), h.DB, userID, req.MediaType, req.TMDBID, req.Title, req.PosterPath, status, req.Rating, req.Review)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create media entry")
		return
	}

	writeJSON(w, http.StatusCreated, entry)
}

// ListUserMediaEntries handles GET /users/{userID}/media-entries. No
// auth required -- entries aren't private, so it returns all of
// userID's entries regardless of status, for viewing another user's
// profile. This is a separate endpoint from ListMyMediaEntries rather
// than that one taking an optional user id, since they're identified
// differently (an explicit path id here vs. the caller's auth token
// there), not because the data returned differs.
func (h *Handler) ListUserMediaEntries(w http.ResponseWriter, r *http.Request) {
	userID := r.PathValue("userID")

	entries, err := database.ListMediaEntriesByUserID(r.Context(), h.DB, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to list media entries")
		return
	}

	writeJSON(w, http.StatusOK, entries)
}

// GetMyMediaEntryByTMDBID handles GET /media-entries/tmdb/{mediaType}/{tmdbID}.
// It's the same single-entry lookup as GetMediaEntry, just keyed by the
// TMDB media type and id (scoped to the caller) instead of the entry's
// own id -- for when the frontend knows which movie or show it's
// showing but doesn't yet know whether the caller has an entry for it,
// let alone that entry's id.
func (h *Handler) GetMyMediaEntryByTMDBID(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	mediaType := r.PathValue("mediaType")
	if message := validateMediaType(mediaType); message != "" {
		writeError(w, http.StatusBadRequest, message)
		return
	}

	tmdbID, err := strconv.Atoi(r.PathValue("tmdbID"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "tmdbID must be a number")
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	entry, err := database.GetMediaEntryByUserAndTMDBID(r.Context(), h.DB, userID, mediaType, tmdbID)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusNotFound, "media entry not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch media entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

// GetMediaEntry handles GET /media-entries/{id}. No auth required --
// entries are posts other users will eventually like and comment on,
// not private to their owner.
func (h *Handler) GetMediaEntry(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	entry, err := database.GetMediaEntryByID(r.Context(), h.DB, id)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusNotFound, "media entry not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch media entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

// UpdateMediaEntry handles PATCH /media-entries/{id}, changing an
// existing entry's status (and rating/review, subject to the same
// rules as creation). Only the entry's owner may update it; a
// mismatched owner and a missing id both respond 404.
func (h *Handler) UpdateMediaEntry(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	var req updateMediaEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.Status == "" {
		writeError(w, http.StatusBadRequest, "status is required")
		return
	}
	if message := validateStatusAndRating(req.Status, req.Rating, req.Review); message != "" {
		writeError(w, http.StatusBadRequest, message)
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	id := r.PathValue("id")
	entry, err := database.UpdateMediaEntry(r.Context(), h.DB, id, userID, req.Status, req.Rating, req.Review)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusNotFound, "media entry not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to update media entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

// DeleteMediaEntry handles DELETE /media-entries/{id}. Only the
// entry's owner may delete it; a mismatched owner and a missing id
// both respond 404, so callers can't use this to probe which ids
// exist.
func (h *Handler) DeleteMediaEntry(w http.ResponseWriter, r *http.Request) {
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
	deleted, err := database.DeleteMediaEntry(r.Context(), h.DB, id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete media entry")
		return
	}
	if !deleted {
		writeError(w, http.StatusNotFound, "media entry not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
