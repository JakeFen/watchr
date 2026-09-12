-- +goose Up
CREATE TABLE
    media_entry_likes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        media_entry_id UUID NOT NULL REFERENCES media_entries (id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (user_id, media_entry_id)
    );

-- +goose Down
DROP TABLE media_entry_likes;
