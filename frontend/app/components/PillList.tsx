import { Pill } from "./Pill";

export function PillList({ items, className = "" }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <Pill key={item}>{item}</Pill>
      ))}
    </div>
  );
}
