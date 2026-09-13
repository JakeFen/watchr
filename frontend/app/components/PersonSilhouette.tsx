import Image from "next/image";

export function PersonSilhouette({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/silhouette.svg"
      alt=""
      fill
      sizes="100px"
      className={`object-contain ${className}`}
    />
  );
}
