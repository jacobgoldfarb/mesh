import * as React from "react";

import type { Channel } from "@/shared/api/types";
import { resolveFocusFilter, type ResolvedFocusFilter } from "./passesFocus";
import { useFocusMode, type FocusModeController } from "./useFocusMode";

export type FocusModeView = FocusModeController & {
  focusFilter: ResolvedFocusFilter;
  /**
   * Channels that stay visible while focused — allowlisted channels, DMs from
   * important users (or all DMs under dmPolicy "all"), any channel with an
   * unread high-priority ping, plus the channel currently open. `undefined`
   * means Focus mode is off (no filtering).
   */
  visibleChannelIds: ReadonlySet<string> | undefined;
  /** Whether any allowlisted-visible channel is unread (drives the dock dot). */
  hasVisibleUnread: boolean;
  /**
   * Dock-badge override for `useAppShellLifecycleEffects`: `"dot"`/`"none"`
   * while focused (numeric badge suppressed), `null` when Focus is off.
   */
  badge: "dot" | "none" | null;
};

/**
 * Bundles the Focus-mode controller with the derived sidebar/badge projections
 * so AppShell can consume it in a single call. Kept out of AppShell to respect
 * that file's size ratchet.
 */
export function useFocusModeView(
  pubkey: string | undefined,
  input: {
    channels: readonly Channel[];
    highPriorityUnreadChannelIds: ReadonlySet<string>;
    unreadChannelIds: ReadonlySet<string>;
    selectedChannelId: string | null;
  },
): FocusModeView {
  const controller = useFocusMode(pubkey);
  const { channels, highPriorityUnreadChannelIds, unreadChannelIds } = input;
  const { selectedChannelId } = input;
  const focusFilter = React.useMemo(
    () => resolveFocusFilter(controller.config),
    [controller.config],
  );

  const visibleChannelIds = React.useMemo<
    ReadonlySet<string> | undefined
  >(() => {
    if (!controller.enabled) {
      return undefined;
    }
    const visible = new Set<string>();
    for (const channel of channels) {
      if (
        focusFilter.importantChannelIds.has(channel.id) ||
        highPriorityUnreadChannelIds.has(channel.id)
      ) {
        visible.add(channel.id);
        continue;
      }
      if (
        channel.channelType === "dm" &&
        (focusFilter.dmPolicy === "all" ||
          channel.participantPubkeys.some((pk) =>
            focusFilter.importantPubkeys.has(pk.toLowerCase()),
          ))
      ) {
        visible.add(channel.id);
      }
    }
    if (selectedChannelId) {
      visible.add(selectedChannelId);
    }
    return visible;
  }, [
    channels,
    controller.enabled,
    focusFilter,
    highPriorityUnreadChannelIds,
    selectedChannelId,
  ]);

  const hasVisibleUnread = React.useMemo(() => {
    if (!visibleChannelIds) {
      return false;
    }
    for (const id of unreadChannelIds) {
      if (visibleChannelIds.has(id)) {
        return true;
      }
    }
    return false;
  }, [unreadChannelIds, visibleChannelIds]);

  const badge: "dot" | "none" | null = !controller.enabled
    ? null
    : hasVisibleUnread
      ? "dot"
      : "none";

  return {
    ...controller,
    focusFilter,
    visibleChannelIds,
    hasVisibleUnread,
    badge,
  };
}
