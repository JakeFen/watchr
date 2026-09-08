package api

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"

	"github.com/JakeFen/watchr/backend/internal/auth"
	"github.com/JakeFen/watchr/backend/internal/database"
)

type createMovieEntryRequest struct {
	TMDBMovieID int     `json:"tmdb_movie_id"`
	Title       string  `json:"title"`
	PosterPath  *string `json:"poster_path"`
	Status      string  `json:"status"`
	Rating      *int16  `json:"rating"`
	Review      *string `json:"review"`
}

// CreateMovieEntry handles POST /movie-entries. The caller must be
// authenticated. status is required; rating (required) and review
// (optional) may only be set when status is watched --
// this mirrors the database's own CHECK constraint, so a bad request
// gets a clean 400 here instead of a raw constraint-violation error.
func (h *Handler) CreateMovieEntry(w http.ResponseWriter, r *http.Request) {
	clerkUserID, ok := auth.ClerkUserID(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	var req createMovieEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.TMDBMovieID == 0 || req.Title == "" || req.Status == "" {
		writeError(w, http.StatusBadRequest, "tmdb_movie_id, title, and status are required")
		return
	}

	status := req.Status
	switch status {
	case database.StatusWantToWatch, database.StatusWatching, database.StatusWatched:
	default:
		writeError(w, http.StatusBadRequest, "status must be one of want_to_watch, watching, watched")
		return
	}

	if status == database.StatusWatched {
		if req.Rating == nil {
			writeError(w, http.StatusBadRequest, "rating is required once status is watched")
			return
		}
		if *req.Rating < 1 || *req.Rating > 5 {
			writeError(w, http.StatusBadRequest, "rating must be between 1 and 5")
			return
		}
	} else if req.Rating != nil || req.Review != nil {
		writeError(w, http.StatusBadRequest, "rating and review are only allowed once status is watched")
		return
	}

	userID, err := database.GetOrCreateUser(r.Context(), h.DB, clerkUserID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to resolve user")
		return
	}

	entry, err := database.CreateMovieEntry(r.Context(), h.DB, userID, req.TMDBMovieID, req.Title, req.PosterPath, status, req.Rating, req.Review)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create movie entry")
		return
	}

	writeJSON(w, http.StatusCreated, entry)
}

// GetMovieEntry handles GET /movie-entries/{id}. Any authenticated
// user can look up any entry by id -- entries are posts other users
// will eventually like and comment on, not private to their owner.
func (h *Handler) GetMovieEntry(w http.ResponseWriter, r *http.Request) {
	if _, ok := auth.ClerkUserID(r.Context()); !ok {
		writeError(w, http.StatusUnauthorized, "missing or invalid session")
		return
	}

	id := r.PathValue("id")
	entry, err := database.GetMovieEntryByID(r.Context(), h.DB, id)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusNotFound, "movie entry not found")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to fetch movie entry")
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

// DeleteMovieEntry handles DELETE /movie-entries/{id}. Only the
// entry's owner may delete it; a mismatched owner and a missing id
// both respond 404, so callers can't use this to probe which ids
// exist.
func (h *Handler) DeleteMovieEntry(w http.ResponseWriter, r *http.Request) {
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
	deleted, err := database.DeleteMovieEntry(r.Context(), h.DB, id, userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to delete movie entry")
		return
	}
	if !deleted {
		writeError(w, http.StatusNotFound, "movie entry not found")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
