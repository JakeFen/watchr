-- +goose Up
CREATE TABLE
    movie_entry_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        movie_entry_id UUID NOT NULL REFERENCES movie_entries (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (user_id, movie_entry_id)
    );

-- +goose Down
DROP TABLE movie_entry_likes;