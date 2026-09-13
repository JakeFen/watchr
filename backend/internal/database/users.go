package database

import "context"

// GetOrCreateUser ensures a users row exists for this Clerk user id,
// creating one on first sight, and returns it unchanged. users.id IS
// the Clerk id now, so there's nothing to look up -- this just
// guarantees a row exists before anything else (like media_entries)
// references it by foreign key.
func GetOrCreateUser(ctx context.Context, db DB, clerkUserID string) (string, error) {
	_, err := db.Exec(ctx,
		`INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`,
		clerkUserID,
	)
	if err != nil {
		return "", err
	}
	return clerkUserID, nil
}
