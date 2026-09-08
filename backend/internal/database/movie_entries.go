package database

import (
	"context"
	"time"
)

type MovieEntry struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	TMDBMovieID int       `json:"tmdb_movie_id"`
	Title       string    `json:"title"`
	PosterPath  *string   `json:"poster_path"`
	Status      string    `json:"status"`
	Rating      *int16    `json:"rating"`
	Review      *string   `json:"review"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

const (
	StatusWantToWatch = "want_to_watch"
	StatusWatching    = "watching"
	StatusWatched     = "watched"
)

const movieEntryColumns = `id, user_id, tmdb_movie_id, title, poster_path, status, rating, review, created_at, updated_at`

func scanMovieEntry(row interface {
	Scan(dest ...any) error
}) (MovieEntry, error) {
	var e MovieEntry
	err := row.Scan(
		&e.ID, &e.UserID, &e.TMDBMovieID, &e.Title, &e.PosterPath,
		&e.Status, &e.Rating, &e.Review, &e.CreatedAt, &e.UpdatedAt,
	)
	return e, err
}

// CreateMovieEntry adds a movie to a user's list. status is required;
// rating/review are only meaningful (and only accepted by the
// database) once status is watched -- see the handler for the
// matching validation.
func CreateMovieEntry(ctx context.Context, db DB, userID string, tmdbMovieID int, title string, posterPath *string, status string, rating *int16, review *string) (MovieEntry, error) {
	row := db.QueryRow(ctx, `
		INSERT INTO movie_entries (user_id, tmdb_movie_id, title, poster_path, status, rating, review)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING `+movieEntryColumns,
		userID, tmdbMovieID, title, posterPath, status, rating, review,
	)
	return scanMovieEntry(row)
}

// GetMovieEntryByID fetches a single movie entry, visible to userID
// if either it's their own entry or it's been marked watched (i.e.
// it's a published post, not just a personal list item). Returns
// pgx.ErrNoRows if it doesn't exist or isn't visible to userID.
func GetMovieEntryByID(ctx context.Context, db DB, id string) (MovieEntry, error) {
	row := db.QueryRow(ctx, `
		SELECT `+movieEntryColumns+`
		FROM movie_entries
		WHERE id = $1`,
		id,
	)
	return scanMovieEntry(row)
}

// DeleteMovieEntry removes a movie entry, scoped to its owner. Returns
// false if no matching entry was found (either it doesn't exist or it
// belongs to a different user), so callers can't distinguish the two
// and accidentally leak which ids exist.
func DeleteMovieEntry(ctx context.Context, db DB, id string, userID string) (bool, error) {
	tag, err := db.Exec(ctx, `DELETE FROM movie_entries WHERE id = $1 AND user_id = $2`, id, userID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}
