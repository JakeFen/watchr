-- +goose Up
CREATE TYPE movie_entries_status AS ENUM ('want_to_watch', 'watching', 'watched');

CREATE TABLE
    movie_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        tmdb_movie_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        poster_path TEXT,
        status movie_entries_status NOT NULL,
        rating SMALLINT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (user_id, tmdb_movie_id)
    );

-- +goose Down
DROP TABLE movie_entries;

DROP TYPE movie_entries_status;