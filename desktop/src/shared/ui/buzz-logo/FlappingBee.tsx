import { BuzzMark } from "./BuzzMark";

/**
 * Loading / splash mark. The bee flap is gone; this is the Superhuman Mesh
 * network with a lightweight CSS pulse so boot still feels alive.
 */
export function FlappingBee({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={["buzz-logo", "buzz-logo--pulse", className]
        .filter(Boolean)
        .join(" ")}
    >
      <BuzzMark className="buzz-logo__mark block h-auto w-full" />
    </div>
  );
}
