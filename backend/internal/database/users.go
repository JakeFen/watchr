package database

import (
	"context"

	"github.com/jackc/pgx/v5"
)

// GetOrCreateUser looks up a user by their Clerk id, creating a row on
// first sight, and returns the local users.id.
func GetOrCreateUser(ctx context.Context, db DB, clerkUserID string) (string, error) {
	var userID string

	queryErr := db.QueryRow(ctx,
		`SELECT id FROM users WHERE clerk_user_id = $1`, clerkUserID).Scan(&userID)

	if queryErr == nil {
		return userID, nil
	}

	if queryErr != pgx.ErrNoRows {
		return "", queryErr
	}

	insertErr := db.QueryRow(ctx,
		`INSERT INTO users (clerk_user_id) VALUES ($1) RETURNING id`,
		clerkUserID,
	).Scan(&userID)

	if insertErr != nil {
		return "", insertErr
	}

	return userID, nil
}
