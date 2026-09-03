# Database Schema

Movie data itself is not stored locally — it's fetched from an external movie API (e.g. TMDB) on demand, so `movie_id` below refers to that external id rather than a foreign key.

## users

Auth is handled by Clerk, so no `email`/`password_hash` here — just a reference to the Clerk user plus our own profile fields.

| column        | type      | notes                          |
|---------------|-----------|--------------------------------|
| id            | uuid/pk   |                                 |
| clerk_user_id | text      | unique, from Clerk              |
| username      | text      | unique                          |
| avatar_url    | text      | nullable                        |
| bio           | text      | nullable                        |
| created_at    | timestamp |                                 |

## friendships

One row per requested pair.

| column         | type      | notes                                   |
|----------------|-----------|------------------------------------------|
| id             | uuid/pk   |                                           |
| requester_id   | uuid/fk   | → users.id                               |
| addressee_id   | uuid/fk   | → users.id                               |
| status         | enum      | pending / accepted / blocked             |
| created_at     | timestamp |                                           |
| responded_at   | timestamp | nullable                                 |

unique on `(requester_id, addressee_id)`

## movie_entries

Tracks a user's relationship to a movie: want to watch, watching, watched — and their rating once watched. One row per user per movie (no rewatch history for now). `title`/`poster_path` are a denormalized snapshot from TMDB at the time the entry is created, so lists can render without an extra API call per movie.

| column        | type        | notes                                  |
|---------------|-------------|-----------------------------------------|
| id            | uuid/pk     |                                          |
| user_id       | uuid/fk     | → users.id, on delete cascade           |
| tmdb_movie_id | integer     | external movie API id                   |
| title         | text        | snapshot from TMDB                      |
| poster_path   | text        | snapshot from TMDB, nullable            |
| status        | text/enum   | want_to_watch / watching / watched      |
| rating        | smallint    | nullable                                |
| watched_at    | timestamptz | nullable                                |
| created_at    | timestamptz |                                          |
| updated_at    | timestamptz |                                          |

unique on `(user_id, tmdb_movie_id)`

## comments

Comments on a movie. `parent_comment_id` allows replies (comments on comments). A top-level comment (`parent_comment_id` null) from a user on a movie is their review; replies are ordinary child comments. For the MVP, a user can only leave one review per movie — enforced with a partial unique index on `(user_id, tmdb_movie_id) WHERE parent_comment_id IS NULL`.

| column            | type        | notes                              |
|-------------------|-------------|-------------------------------------|
| id                | uuid/pk     |                                      |
| user_id           | uuid/fk     | → users.id                          |
| tmdb_movie_id     | integer     | external movie API id               |
| parent_comment_id | uuid/fk     | → comments.id, nullable             |
| body              | text        |                                      |
| created_at        | timestamptz |                                      |
| updated_at        | timestamptz |                                      |
| deleted_at        | timestamptz | nullable                            |

## comment_likes

| column     | type      | notes           |
|------------|-----------|-----------------|
| id         | uuid/pk   |                 |
| user_id    | uuid/fk   | → users.id      |
| comment_id | uuid/fk   | → comments.id   |
| created_at | timestamp |                 |

unique on `(user_id, comment_id)`
