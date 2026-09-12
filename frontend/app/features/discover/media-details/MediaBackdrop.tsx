import Image from "next/image";

export function MediaBackdrop({ backdropUrl }: { backdropUrl?: string }) {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="relative h-[70vh] min-h-96 w-full">
        {backdropUrl && (
          <Image src={backdropUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-zinc-900/20" />
      </div>
    </div>
  );
}
