import { Moon } from "lucide-react";

/**
 * Compact "Focus on — N hidden · Exit" banner shown at the top of the sidebar
 * while Focus (Zen) mode is active. Split out of AppSidebar to keep that file
 * under its size ratchet.
 */
export function SidebarFocusBanner({
  hiddenCount,
  onExit,
}: {
  hiddenCount: number;
  onExit?: () => void;
}) {
  return (
    <div
      className="mx-1 flex items-center justify-between gap-2 rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-xs"
      data-testid="sidebar-focus-banner"
    >
      <span className="flex min-w-0 items-center gap-1.5 text-primary">
        <Moon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate font-medium">
          {hiddenCount > 0 ? `Focus on — ${hiddenCount} hidden` : "Focus on"}
        </span>
      </span>
      <button
        className="shrink-0 rounded-md px-1.5 py-0.5 font-medium text-primary transition-colors hover:bg-primary/15"
        data-testid="sidebar-exit-focus"
        onClick={onExit}
        type="button"
      >
        Exit
      </button>
    </div>
  );
}
