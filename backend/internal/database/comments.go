package database

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
)

type Comment struct {
	ID           string    `json:"id"`
	UserID       string    `json:"user_id"`
	MediaEntryID string    `json:"media_entry_id"`
	Body         string    `json:"body"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

const commentColumns = `id, user_id, media_entry_id, body, created_at, updated_at`

func scanComment(row interface {
	Scan(dest ...any) error
}) (Comment, error) {
	var c Comment
	err := row.Scan(&c.ID, &c.UserID, &c.MediaEntryID, &c.Body, &c.CreatedAt, &c.UpdatedAt)
	return c, err
}

// CreateComment adds a comment to mediaEntryID as userID. Returns
// ErrMediaEntryNotFound if mediaEntryID doesn't exist.
func CreateComment(ctx context.Context, db DB, userID string, mediaEntryID string, body string) (Comment, error) {
	row := db.QueryRow(ctx, `
		INSERT INTO comments (user_id, media_entry_id, body)
		VALUES ($1, $2, $3)
		RETURNING `+commentColumns,
		userID, mediaEntryID, body,
	)
	comment, err := scanComment(row)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23503" {
			return Comment{}, ErrMediaEntryNotFound
		}
		return Comment{}, err
	}
	return comment, nil
}

// ListCommentsByMediaEntryID fetches mediaEntryID's comments, oldest
// first like a conversation thread. Deleted comments (deleted_at set)
// are excluded.
func ListCommentsByMediaEntryID(ctx context.Context, db DB, mediaEntryID string) ([]Comment, error) {
	rows, err := db.Query(ctx, `
		SELECT `+commentColumns+`
		FROM comments
		WHERE media_entry_id = $1 AND deleted_at IS NULL
		ORDER BY created_at ASC`,
		mediaEntryID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	comments := []Comment{}
	for rows.Next() {
		comment, err := scanComment(rows)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, rows.Err()
}

// DeleteComment soft-deletes a comment (the comments table keeps a
// deleted_at column rather than a hard delete), scoped to its author.
// Returns false if no matching, not-already-deleted comment was found
// -- it doesn't exist, belongs to someone else, or was already
// deleted -- so callers can't use this to probe which ids exist.
func DeleteComment(ctx context.Context, db DB, id string, userID string) (bool, error) {
	tag, err := db.Exec(ctx,
		`UPDATE comments SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
		id, userID,
	)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}
