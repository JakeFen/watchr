-- +goose Up
CREATE TABLE
    users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- +goose Down
DROP TABLE users;
