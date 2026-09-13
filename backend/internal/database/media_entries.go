package database

import (
	"context"
	"time"
)

type MediaEntry struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	MediaType  string    `json:"media_type"`
	TMDBID     int       `json:"tmdb_id"`
	Title      string    `json:"title"`
	PosterPath *string   `json:"poster_path"`
	Status     string    `json:"status"`
	Rating     *int16    `json:"rating"`
	Review     *string   `json:"review"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

const (
	StatusWantToWatch = "want_to_watch"
	StatusWatching    = "watching"
	StatusWatched     = "watched"
)

const (
	MediaTypeMovie = "movie"
	MediaTypeTv    = "tv"
)

const mediaEntryColumns = `id, user_id, media_type, tmdb_id, title, poster_path, status, rating, review, created_at, updated_at`

func scanMediaEntry(row interface {
	Scan(dest ...any) error
}) (MediaEntry, error) {
	var e MediaEntry
	err := row.Scan(
		&e.ID, &e.UserID, &e.MediaType, &e.TMDBID, &e.Title, &e.PosterPath,
		&e.Status, &e.Rating, &e.Review, &e.CreatedAt, &e.UpdatedAt,
	)
	return e, err
}

// CreateMediaEntry adds a movie or TV show to a user's list. status is
// required; rating/review are only meaningful (and only accepted by
// the database) once status is watched -- see the handler for the
// matching validation.
func CreateMediaEntry(ctx context.Context, db DB, userID string, mediaType string, tmdbID int, title string, posterPath *string, status string, rating *int16, review *string) (MediaEntry, error) {
	row := db.QueryRow(ctx, `
		INSERT INTO media_entries (user_id, media_type, tmdb_id, title, poster_path, status, rating, review)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING `+mediaEntryColumns,
		userID, mediaType, tmdbID, title, posterPath, status, rating, review,
	)
	return scanMediaEntry(row)
}

// GetMediaEntryByID fetches a single media entry by its own id.
// Entries aren't private, so this is open to anyone regardless of
// ownership or status. Returns pgx.ErrNoRows if it doesn't exist.
func GetMediaEntryByID(ctx context.Context, db DB, id string) (MediaEntry, error) {
	row := db.QueryRow(ctx, `
		SELECT `+mediaEntryColumns+`
		FROM media_entries
		WHERE id = $1`,
		id,
	)
	return scanMediaEntry(row)
}

// GetMediaEntryByUserAndTMDBID fetches userID's own entry for a given
// TMDB movie or TV show, if one exists. Returns pgx.ErrNoRows if they
// haven't added it to a list yet -- the (user_id, media_type, tmdb_id)
// UNIQUE constraint guarantees there's at most one.
func GetMediaEntryByUserAndTMDBID(ctx context.Context, db DB, userID string, mediaType string, tmdbID int) (MediaEntry, error) {
	row := db.QueryRow(ctx, `
		SELECT `+mediaEntryColumns+`
		FROM media_entries
		WHERE user_id = $1 AND media_type = $2 AND tmdb_id = $3`,
		userID, mediaType, tmdbID,
	)
	return scanMediaEntry(row)
}

// ListMediaEntriesByUserID fetches all of userID's own entries, most
// recently created first.
func ListMediaEntriesByUserID(ctx context.Context, db DB, userID string) ([]MediaEntry, error) {
	rows, err := db.Query(ctx, `
		SELECT `+mediaEntryColumns+`
		FROM media_entries
		WHERE user_id = $1
		ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	entries := []MediaEntry{}
	for rows.Next() {
		entry, err := scanMediaEntry(rows)
		if err != nil {
			return nil, err
		}
		entries = append(entries, entry)
	}
	return entries, rows.Err()
}

// UpdateMediaEntry updates an existing media entry's status, rating,
// and review, scoped to its owner. Returns pgx.ErrNoRows if no
// matching entry was found (either it doesn't exist or it belongs to
// a different user).
func UpdateMediaEntry(ctx context.Context, db DB, id string, userID string, status string, rating *int16, review *string) (MediaEntry, error) {
	row := db.QueryRow(ctx, `
		UPDATE media_entries
		SET status = $3, rating = $4, review = $5, updated_at = NOW()
		WHERE id = $1 AND user_id = $2
		RETURNING `+mediaEntryColumns,
		id, userID, status, rating, review,
	)
	return scanMediaEntry(row)
}

// DeleteMediaEntry removes a media entry, scoped to its owner. Returns
// false if no matching entry was found (either it doesn't exist or it
// belongs to a different user), so callers can't distinguish the two
// and accidentally leak which ids exist.
func DeleteMediaEntry(ctx context.Context, db DB, id string, userID string) (bool, error) {
	tag, err := db.Exec(ctx, `DELETE FROM media_entries WHERE id = $1 AND user_id = $2`, id, userID)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}
