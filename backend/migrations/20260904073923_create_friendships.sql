-- +goose Up
CREATE TYPE friendships_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE
    friendships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        requester_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        addressee_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        status friendships_status NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (requester_id, addressee_id)
    );

-- +goose Down
DROP TABLE friendships;

DROP TYPE friendships_status;