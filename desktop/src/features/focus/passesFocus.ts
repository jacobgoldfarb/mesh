/**
 * Pure Focus-mode predicates shared by the notification gates and the
 * sidebar/inbox filters. When Focus mode is disabled every predicate returns
 * `true` (no filtering), so callers can apply them unconditionally.
 */
import {
  getThreadReference,
  isBroadcastReply,
} from "@/features/messages/lib/threading";
import { hasMentionForEvent } from "@/features/notifications/lib/shouldNotify";
import type { RelayEvent } from "@/shared/api/types";
import { normalizePubkey } from "@/shared/lib/pubkey";
import type { FocusModeConfig } from "./focusModeStorage";

export type ResolvedFocusFilter = {
  enabled: boolean;
  importantPubkeys: ReadonlySet<string>;
  importantChannelIds: ReadonlySet<string>;
  dmPolicy: "important" | "all";
  mentionsBreakThrough: boolean;
  followedThreadsBreakThrough: boolean;
  hiddenFibreKinds: ReadonlySet<string>;
};

/**
 * Precompute lookup sets once so per-event/per-item checks stay O(1). The
 * result is stable for a given config reference, so callers can memoize on the
 * config object from `useFocusMode`.
 */
export function resolveFocusFilter(
  config: FocusModeConfig,
): ResolvedFocusFilter {
  return {
    enabled: config.enabled,
    importantPubkeys: new Set(config.importantPubkeys.map(normalizePubkey)),
    importantChannelIds: new Set(config.importantChannelIds),
    dmPolicy: config.dmPolicy,
    mentionsBreakThrough: config.mentionsBreakThrough,
    followedThreadsBreakThrough: config.followedThreadsBreakThrough,
    hiddenFibreKinds: new Set(config.hiddenFibreKinds),
  };
}

export type FocusEventContext = {
  channelId?: string | null;
  isDm?: boolean;
  followedRootIds?: ReadonlySet<string>;
};

/**
 * Whether an incoming relay event should break through Focus mode.
 *
 * `currentPubkey` must be normalized (trimmed, lowercase) to match
 * `hasMentionForEvent`.
 */
export function eventPassesFocus(
  event: RelayEvent,
  currentPubkey: string,
  filter: ResolvedFocusFilter,
  ctx: FocusEventContext = {},
): boolean {
  if (!filter.enabled) {
    return true;
  }
  if (isBroadcastReply(event.tags)) {
    return true;
  }
  if (filter.mentionsBreakThrough && hasMentionForEvent(event, currentPubkey)) {
    return true;
  }
  if (filter.importantPubkeys.has(event.pubkey.toLowerCase())) {
    return true;
  }
  const channelId = ctx.channelId ?? null;
  if (channelId !== null && filter.importantChannelIds.has(channelId)) {
    return true;
  }
  if (ctx.isDm && filter.dmPolicy === "all") {
    return true;
  }
  if (filter.followedThreadsBreakThrough && ctx.followedRootIds) {
    const { rootId } = getThreadReference(event.tags);
    if (rootId !== null && ctx.followedRootIds.has(rootId)) {
      return true;
    }
  }
  return false;
}

export type FocusFeedItem = {
  pubkey: string;
  channelId: string | null;
  category?: string | null;
};

/** Whether a home-feed alert item should break through Focus mode. */
export function feedItemPassesFocus(
  item: FocusFeedItem,
  filter: ResolvedFocusFilter,
): boolean {
  if (!filter.enabled) {
    return true;
  }
  if (filter.mentionsBreakThrough && item.category === "mention") {
    return true;
  }
  if (filter.importantPubkeys.has(item.pubkey.toLowerCase())) {
    return true;
  }
  if (
    item.channelId !== null &&
    filter.importantChannelIds.has(item.channelId)
  ) {
    return true;
  }
  return false;
}

/** Structural shape of a triage fibre relevant to focus filtering. */
export type FocusFibre = {
  kind: string;
  channelId: string | null;
  isDm: boolean;
  people: readonly { pubkey: string }[];
  artifacts: readonly { authorPubkey: string | null }[];
};

/** Whether an inbox fibre should remain visible in Focus mode. */
export function fibrePassesFocus(
  fibre: FocusFibre,
  filter: ResolvedFocusFilter,
): boolean {
  if (!filter.enabled) {
    return true;
  }
  // Category gate applies on top of the source allowlist: a hidden category
  // never reaches the inbox, even from an important person or channel.
  if (filter.hiddenFibreKinds.has(fibre.kind)) {
    return false;
  }
  if (
    fibre.channelId !== null &&
    filter.importantChannelIds.has(fibre.channelId)
  ) {
    return true;
  }
  if (fibre.isDm && filter.dmPolicy === "all") {
    return true;
  }
  for (const person of fibre.people) {
    if (filter.importantPubkeys.has(person.pubkey.toLowerCase())) {
      return true;
    }
  }
  for (const artifact of fibre.artifacts) {
    if (
      artifact.authorPubkey &&
      filter.importantPubkeys.has(artifact.authorPubkey.toLowerCase())
    ) {
      return true;
    }
  }
  return false;
}
