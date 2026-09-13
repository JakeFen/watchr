-- +goose Up
CREATE TYPE media_entries_status AS ENUM ('want_to_watch', 'watching', 'watched');

CREATE TYPE media_entries_media_type AS ENUM ('movie', 'tv');

CREATE TABLE
    media_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        media_type media_entries_media_type NOT NULL,
        tmdb_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        status media_entries_status NOT NULL,
        rating SMALLINT,
        review TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (user_id, media_type, tmdb_id),
        CHECK (
            status = 'watched'
            OR (
                rating IS NULL
                AND review IS NULL
            )
        ),
        CHECK (
            rating IS NULL
            OR rating BETWEEN 1 AND 5
        )
    );

-- +goose Down
DROP TABLE media_entries;

DROP TYPE media_entries_status;

DROP TYPE media_entries_media_type;
