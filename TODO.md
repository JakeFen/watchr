# TODO

## Loading states

- `UserMenu` (nav dropdown): currently renders nothing while Clerk's
  user data loads (`!isLoaded`). Replace with a proper loading
  skeleton instead of a blank gap.
- `MediaRow` / the discover page rows: no loading state yet. Currently
  fine since row data is always ready server-side before render, but
  will need one whenever a row's items can come from a client-side or
  async source.
- Likely other elements as they come up -- these are just the ones
  noticed so far.
- Loading between screens/navigations in general, specifically the
  `/users/[userId]` profile route: clicking "Profile" gives no visual
  feedback until the whole page (including a Clerk `currentUser()`
  network call and a backend call for stats) has fully resolved. A
  `loading.tsx` for that route would fix the perceived "did my click
  even register" delay. Not needed for MVP.

## Profile

- The "Watched" tab (`WatchedTab` / `StatusMediaGrid`) doesn't show a
  user's rating on each poster. `mediaEntryToMediaItem` doesn't carry
  `entry.rating` through to the `MediaItem` it builds, so `MediaCard`'s
  rating badge never renders there even though the data already
  exists.

## Friends

- The "Friends" box and `/users/[userId]/friends` only ever show
  accepted friendships. There's no way yet to see or act on pending
  requests -- accept/decline an incoming one, or see that an outgoing
  one is still pending -- even though `friendships.status` already
  supports it, and no way to send a request in the first place.
