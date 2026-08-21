import * as React from "react";

import { setDesktopAppBadge } from "@/features/notifications/lib/desktop";
import { useForegroundQueryRefresh } from "@/features/workflows/hooks";
import { relayClient } from "@/shared/api/relayClient";
import { useRelayResumeTriggers } from "@/shared/api/useRelayResumeTriggers";

type AppShellLifecycleEffectsOptions = {
  desktopBadgeEnabled: boolean;
  homeBadgeCountExcludingHighPriority: number;
  unreadChannelIds: ReadonlySet<string>;
  unreadChannelNotificationCount: number;
  /**
   * Focus (Zen) mode dock-badge override. When set the numeric badge is
   * suppressed: "dot" shows a plain dot (allowlisted unread present), "none"
   * clears it. `null`/undefined = Focus off, use the normal count logic.
   */
  focusBadge?: "dot" | "none" | null;
};

export function useAppShellLifecycleEffects({
  desktopBadgeEnabled,
  homeBadgeCountExcludingHighPriority,
  unreadChannelIds,
  unreadChannelNotificationCount,
  focusBadge,
}: AppShellLifecycleEffectsOptions) {
  // Event-driven reconnect: network online / focus / visibility short-circuit
  // the backoff timer when the relay session is degraded (CMD+R gap G1).
  useRelayResumeTriggers();
  useForegroundQueryRefresh();

  // Prevent webview file:/// navigation on file drop outside the composer.
  // Scoped to file drags only (text drag-and-drop into inputs still works).
  // Composer's onDrop fires first (React synthetic before window bubble).
  React.useEffect(() => {
    function preventNavigation(e: DragEvent) {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
      }
    }
    window.addEventListener("dragover", preventNavigation);
    window.addEventListener("drop", preventNavigation);
    return () => {
      window.removeEventListener("dragover", preventNavigation);
      window.removeEventListener("drop", preventNavigation);
    };
  }, []);

  React.useEffect(() => {
    let isCancelled = false;

    const startPreconnect = () => {
      if (isCancelled) {
        return;
      }

      void relayClient.preconnect().catch((error) => {
        if (!isCancelled) {
          console.error("Failed to preconnect to relay", error);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(startPreconnect, {
        timeout: 1_500,
      });
      return () => {
        isCancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(startPreconnect, 250);
    return () => {
      isCancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  React.useEffect(() => {
    if (!desktopBadgeEnabled) {
      return;
    }

    // Focus mode suppresses the noisy numeric badge: show a dot only when an
    // allowlisted-visible channel is unread, otherwise clear it entirely.
    if (focusBadge) {
      void setDesktopAppBadge(
        focusBadge === "dot" ? { kind: "dot" } : { kind: "none" },
      );
      return;
    }

    const count =
      unreadChannelNotificationCount + homeBadgeCountExcludingHighPriority;
    void setDesktopAppBadge(
      count
        ? { kind: "count", count }
        : { kind: unreadChannelIds.size ? "dot" : "none" },
    );
  }, [
    desktopBadgeEnabled,
    focusBadge,
    homeBadgeCountExcludingHighPriority,
    unreadChannelIds,
    unreadChannelNotificationCount,
  ]);
}
