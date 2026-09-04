# Database Schema

Movie data itself is not stored locally — it's fetched from an external movie API (e.g. TMDB) on demand, so `tmdb_movie_id` below refers to that external id rather than a foreign key.

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

Tracks a user's relationship to a movie: want to watch, watching, watched. One row per user per movie (no rewatch history for now). `title`/`poster_path` are a denormalized snapshot from TMDB at the time the entry is created, so lists can render without an extra API call per movie.

Once a user marks an entry `watched`, they add a `rating` (required) and optionally a `review` — together these make the entry into "the post" that others can like and comment on. Enforced via a CHECK constraint: watched entries must have a rating; non-watched entries must have neither a rating nor a review.

| column        | type        | notes                                   |
|---------------|-------------|-------------------------------------------|
| id            | uuid/pk     |                                            |
| user_id       | uuid/fk     | → users.id, on delete cascade             |
| tmdb_movie_id | integer     | external movie API id                     |
| title         | text        | snapshot from TMDB                        |
| poster_path   | text        | snapshot from TMDB, nullable               |
| status        | text/enum   | want_to_watch / watching / watched        |
| rating        | smallint    | nullable — required once watched, 1-5     |
| review        | text        | nullable, optional even once watched      |
| created_at    | timestamptz |                                            |
| updated_at    | timestamptz |                                            |

unique on `(user_id, tmdb_movie_id)`

## comments

A flat list of comments on a watched entry's post — no threading, no replies-to-replies. Just `movie_entry_id` (a real foreign key now, instead of the old loose `tmdb_movie_id` correlation) and a `body`.

| column         | type        | notes                                |
|----------------|-------------|----------------------------------------|
| id             | uuid/pk     |                                        |
| user_id        | uuid/fk     | → users.id                            |
| movie_entry_id | uuid/fk     | → movie_entries.id, on delete cascade |
| body           | text        |                                        |
| created_at     | timestamptz |                                        |
| updated_at     | timestamptz |                                        |
| deleted_at     | timestamptz | nullable                              |

Liking individual comments (a `comment_likes` table) is deferred post-MVP — only the post itself is likeable for now.

## movie_entry_likes

Likes on the post itself (the watched entry + its rating/review).

| column         | type        | notes                                  |
|----------------|-------------|-------------------------------------------|
| id             | uuid/pk     |                                            |
| user_id        | uuid/fk     | → users.id                                |
| movie_entry_id | uuid/fk     | → movie_entries.id, on delete cascade     |
| created_at     | timestamptz |                                            |

unique on `(user_id, movie_entry_id)`
