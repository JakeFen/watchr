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
