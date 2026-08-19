import { cn } from "@/shared/lib/cn";
import { BuzzMark } from "./BuzzMark";
import type { BuzzLogoAnimationProps } from "./BuzzLogoAnimation";
import "./buzz-logo-animation.css";

export type FuzzyLogoProps = {
  /** Kept for call-site compatibility. The mesh mark does not use turbulence. */
  fuzz?: boolean;
  className?: string;
  ariaLabel?: string;
  loop?: boolean;
  loopRestSeconds?: number;
  /** When false, skip the CSS pulse. */
  pulse?: boolean;
  reverse?: boolean;
  variant?: BuzzLogoAnimationProps["variant"];
};

/**
 * Superhuman Mesh mark used in loading and agent-liveness spots.
 * The bee morph is retired; this renders the mesh with an optional pulse.
 */
export function FuzzyLogo({
  className,
  ariaLabel = "Superhuman Mesh logo",
  pulse = true,
}: FuzzyLogoProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={cn("buzz-logo", pulse && "buzz-logo--pulse", className)}
    >
      <BuzzMark className="buzz-logo__mark block h-auto w-full" />
    </div>
  );
}
