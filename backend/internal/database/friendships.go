package database

import "context"

type Friend struct {
	ID       string  `json:"id"`
	Username *string `json:"username"`
}

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
