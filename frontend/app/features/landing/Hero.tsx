import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "../../components/Button";

export function Hero() {
  return (
    <section className="relative -mx-4 h-[75vh] min-h-[420px] sm:-mx-6 lg:-mx-8">
      <Image
        src="/hero-placeholder.svg"
        alt=""
        fill
        preload
        className="object-cover"
      />
      {/* Fades the top of the image to transparent and the bottom into the page background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-zinc-900" />
      {/* Fades the left and right edges of the image into the page background */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-zinc-900" />

      {/* Centered heading, subcopy, and CTA anchored to the bottom of the hero */}
      <div className="relative flex h-full flex-col items-center justify-end px-4 pb-32 text-center sm:px-6 lg:px-8">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          Track what you watch.
        </h1>
        <p className="mt-4 mb-8 max-w-xl text-base text-zinc-300 sm:text-lg">
          Discover trending movies and shows, and keep a log of everything
          you&apos;ve seen.
        </p>
        <SignUpButton mode="modal">
          <Button>Get Started Now</Button>
        </SignUpButton>
      </div>
    </section>
  );
}
