import { Show, UserButton } from "@clerk/nextjs";
import { SessionTokenCard } from "../components/SessionTokenCard";

export default function ClerkPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 p-8 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Watchr
      </h1>

      <Show when="signed-in">
        <div className="flex flex-col items-center gap-6">
          <UserButton />
          <SessionTokenCard />
        </div>
      </Show>
    </div>
  );
}
