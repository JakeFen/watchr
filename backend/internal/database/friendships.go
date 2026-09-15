package database

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type Friend struct {
	ID       string  `json:"id"`
	Username *string `json:"username"`
}

// ErrFriendshipExists is returned by CreateFriendRequest when a
// friendship row -- in either direction, any status -- already exists
// between the two users.
var ErrFriendshipExists = errors.New("friendship already exists")

// ListFriendsByUserID fetches userID's accepted friends -- the other
// user in each friendship row where userID is either side, since a
// friendship becomes mutual once accepted regardless of who sent the
// original request.
func ListFriendsByUserID(ctx context.Context, db DB, userID string) ([]Friend, error) {
	rows, err := db.Query(ctx, `
		SELECT u.id, u.username
		FROM friendships f
		JOIN users u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
		WHERE f.status = 'accepted' AND (f.requester_id = $1 OR f.addressee_id = $1)
		ORDER BY u.username`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	friends := []Friend{}
	for rows.Next() {
		var f Friend
		if err := rows.Scan(&f.ID, &f.Username); err != nil {
			return nil, err
		}
		friends = append(friends, f)
	}
	return friends, rows.Err()
}

// GetFriendshipStatus returns the status ("pending" or "accepted") of
// any friendship row between the two users, in either direction, or
// "" if none exists.
func GetFriendshipStatus(ctx context.Context, db DB, userID string, otherUserID string) (string, error) {
	var status string
	err := db.QueryRow(ctx, `
		SELECT status FROM friendships
		WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
		userID, otherUserID,
	).Scan(&status)
	if errors.Is(err, pgx.ErrNoRows) {
		return "", nil
	}
	return status, err
}

// CreateFriendRequest creates a pending friendship from requesterID to
// addresseeID. Returns ErrFriendshipExists if a friendship already
// exists between the two in either direction -- the table's UNIQUE
// (requester_id, addressee_id) constraint only catches the exact same
// direction, so this checks both explicitly first.
func CreateFriendRequest(ctx context.Context, db DB, requesterID string, addresseeID string) error {
	status, err := GetFriendshipStatus(ctx, db, requesterID, addresseeID)
	if err != nil {
		return err
	}
	if status != "" {
		return ErrFriendshipExists
	}

	_, err = db.Exec(ctx,
		`INSERT INTO friendships (requester_id, addressee_id, status) VALUES ($1, $2, 'pending')`,
		requesterID, addresseeID,
	)
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) && pgErr.Code == "23505" {
		return ErrFriendshipExists
	}
	return err
}

// DeleteFriendship removes any friendship row between the two users,
// regardless of status or direction -- unfriending an accepted
// friendship, canceling a request you sent, and declining one you
// received are all the same operation: remove the relationship.
// Returns false if no such row existed.
func DeleteFriendship(ctx context.Context, db DB, userID string, otherUserID string) (bool, error) {
	tag, err := db.Exec(ctx, `
		DELETE FROM friendships
		WHERE (requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)`,
		userID, otherUserID,
	)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
}
