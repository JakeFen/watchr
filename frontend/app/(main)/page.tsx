import { NavBar } from "../components/NavBar";
import { LandingContent } from "../features/landing/LandingContent";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <LandingContent />
      </main>
    </div>
  );
}
