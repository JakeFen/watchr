package database

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// DB is satisfied by both *pgx.Conn and *pgxpool.Pool, so callers can
// pass either a single connection (e.g. in tests) or a pool (in the
// running server), which is what actually needs to be safe for
// concurrent use across in-flight requests.
type DB interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	Exec(ctx context.Context, sql string, args ...any) (pgconn.CommandTag, error)
}
