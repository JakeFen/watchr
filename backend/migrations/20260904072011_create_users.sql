-- +goose Up
CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        clerk_user_id TEXT NOT NULL UNIQUE,
        username TEXT UNIQUE,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- +goose Down
DROP TABLE users;