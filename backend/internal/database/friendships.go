package database

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// ErrFriendshipExists is returned by CreateFriendRequest when a
// friendship row -- in either direction, any status -- already exists
// between the two users.
var ErrFriendshipExists = errors.New("friendship already exists")

// ListFriendsByUserID fetches the ids of userID's accepted friends --
// the other user in each friendship row where userID is either side,
// since a friendship becomes mutual once accepted regardless of who
// sent the original request. Display info (username, etc.) isn't
// stored here -- callers resolve that from Clerk themselves.
func ListFriendsByUserID(ctx context.Context, db DB, userID string) ([]string, error) {
	rows, err := db.Query(ctx, `
		SELECT CASE WHEN requester_id = $1 THEN addressee_id ELSE requester_id END
		FROM friendships
		WHERE status = 'accepted' AND (requester_id = $1 OR addressee_id = $1)`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	ids := []string{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

// ListPendingRequestsByUserID fetches the ids of requesters who've
// sent userID a pending friend request, most recent first.
func ListPendingRequestsByUserID(ctx context.Context, db DB, userID string) ([]string, error) {
	rows, err := db.Query(ctx, `
		SELECT requester_id FROM friendships
		WHERE status = 'pending' AND addressee_id = $1
		ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	ids := []string{}
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, rows.Err()
}

// AcceptFriendRequest marks the pending friendship requesterID sent
// to addresseeID as accepted. Returns false if no such pending
// request existed.
func AcceptFriendRequest(ctx context.Context, db DB, requesterID string, addresseeID string) (bool, error) {
	tag, err := db.Exec(ctx, `
		UPDATE friendships SET status = 'accepted', updated_at = NOW()
		WHERE requester_id = $1 AND addressee_id = $2 AND status = 'pending'`,
		requesterID, addresseeID,
	)
	if err != nil {
		return false, err
	}
	return tag.RowsAffected() > 0, nil
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
