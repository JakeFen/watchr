package database

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

// ErrLikeExists is returned by LikeMediaEntry when userID has already
// liked mediaEntryID.
var ErrLikeExists = errors.New("media entry already liked")

// ErrMediaEntryNotFound is returned by LikeMediaEntry when
// mediaEntryID doesn't reference an existing media entry.
var ErrMediaEntryNotFound = errors.New("media entry not found")

// LikeMediaEntry records userID liking mediaEntryID. The (user_id,
// media_entry_id) UNIQUE constraint guarantees at most one like per
// user per entry -- ErrLikeExists is returned if one's already there,
// and ErrMediaEntryNotFound if mediaEntryID doesn't exist.
func LikeMediaEntry(ctx context.Context, db DB, userID string, mediaEntryID string) error {
	tag, err := db.Exec(ctx, `
		INSERT INTO media_entry_likes (user_id, media_entry_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, media_entry_id) DO NOTHING`,
		userID, mediaEntryID,
	)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return ErrMediaEntryNotFound
		}
		return err
	}
	if tag.RowsAffected() == 0 {
		return ErrLikeExists
	}
	return nil
}

// UnlikeMediaEntry removes userID's like from mediaEntryID, if one
// exists. Returns false if it didn't (either they'd never liked it,
// or the entry doesn't exist), so callers can't use this to probe
// which ids exist.
func UnlikeMediaEntry(ctx context.Context, db DB, userID string, mediaEntryID string) (bool, error) {
	tag, err := db.Exec(ctx,
		`DELETE FROM media_entry_likes WHERE user_id = $1 AND media_entry_id = $2`,
		userID, mediaEntryID,
	)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}
