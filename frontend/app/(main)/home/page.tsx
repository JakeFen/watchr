// /home is the logged-in landing route — serves as the user's feed.
export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 p-8 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Home page
      </h1>
    </div>
  );
}
