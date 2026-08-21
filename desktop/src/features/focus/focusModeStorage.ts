/**
 * Persistence for Focus (Zen) mode. Device-local and scoped per pubkey,
 * mirroring the notification-settings storage pattern
 * (`buzz-notification-settings.v2:${pubkey}`). Users are global (pubkeys);
 * channel-allowlist entries are community-scoped UUIDs that simply do not
 * match in other communities, so no per-community reset is required.
 *
 * Cross-device sync (kind 30078, like `channelMutesSync`) is a deliberate
 * future extension — v1 is local-only.
 */
import { normalizePubkey } from "@/shared/lib/pubkey";
import { getStorageItem, setStorageItem } from "@/shared/lib/safeStorage";

/** Which direct messages break through Focus mode. */
export type FocusDmPolicy = "important" | "all";

export type FocusModeConfig = {
  /** Whether Focus mode is currently active. */
  enabled: boolean;
  /** Pubkeys (normalized lowercase) whose DMs and messages always break through. */
  importantPubkeys: string[];
  /** Channel ids that stay visible and keep notifying while focused. */
  importantChannelIds: string[];
  /** Which DMs break through: only those from important users, or all. */
  dmPolicy: FocusDmPolicy;
  /** Allow direct @-mentions to break through. */
  mentionsBreakThrough: boolean;
  /** Allow replies in threads you follow to break through. */
  followedThreadsBreakThrough: boolean;
  /**
   * Fibre categories (triage kinds) hidden from the inbox while focused. Empty
   * (the default) allows every category — stored as an exclusion list so new
   * fibre kinds stay visible by default and existing configs need no migration.
   */
  hiddenFibreKinds: string[];
  updatedAt: number;
};

const STORAGE_KEY_PREFIX = "buzz-focus-mode.v1";

/** Cap allowlist growth so a corrupted or runaway entry can't bloat storage. */
export const MAX_FOCUS_ENTRIES = 500;

export const DEFAULT_FOCUS_CONFIG: FocusModeConfig = Object.freeze({
  enabled: false,
  importantPubkeys: [],
  importantChannelIds: [],
  dmPolicy: "important",
  mentionsBreakThrough: true,
  followedThreadsBreakThrough: true,
  hiddenFibreKinds: [],
  updatedAt: 0,
});

export function focusStorageKey(pubkey: string): string {
  return `${STORAGE_KEY_PREFIX}:${pubkey}`;
}

function sanitizeStringList(
  value: unknown,
  normalize?: (entry: string) => string,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }
    const normalized = normalize ? normalize(entry) : entry.trim();
    if (normalized.length === 0 || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
    if (result.length >= MAX_FOCUS_ENTRIES) {
      break;
    }
  }
  return result;
}

export function sanitizeFocusConfig(value: unknown): FocusModeConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_FOCUS_CONFIG;
  }
  const candidate = value as Partial<FocusModeConfig>;
  return {
    enabled:
      typeof candidate.enabled === "boolean"
        ? candidate.enabled
        : DEFAULT_FOCUS_CONFIG.enabled,
    importantPubkeys: sanitizeStringList(
      candidate.importantPubkeys,
      normalizePubkey,
    ),
    importantChannelIds: sanitizeStringList(candidate.importantChannelIds),
    dmPolicy: candidate.dmPolicy === "all" ? "all" : "important",
    mentionsBreakThrough:
      typeof candidate.mentionsBreakThrough === "boolean"
        ? candidate.mentionsBreakThrough
        : DEFAULT_FOCUS_CONFIG.mentionsBreakThrough,
    followedThreadsBreakThrough:
      typeof candidate.followedThreadsBreakThrough === "boolean"
        ? candidate.followedThreadsBreakThrough
        : DEFAULT_FOCUS_CONFIG.followedThreadsBreakThrough,
    hiddenFibreKinds: sanitizeStringList(candidate.hiddenFibreKinds),
    updatedAt:
      typeof candidate.updatedAt === "number" &&
      Number.isFinite(candidate.updatedAt) &&
      candidate.updatedAt >= 0
        ? candidate.updatedAt
        : 0,
  };
}

export function readFocusConfig(pubkey: string): FocusModeConfig {
  if (pubkey.length === 0) {
    return DEFAULT_FOCUS_CONFIG;
  }
  const raw = getStorageItem(focusStorageKey(pubkey));
  if (!raw) {
    return DEFAULT_FOCUS_CONFIG;
  }
  try {
    return sanitizeFocusConfig(JSON.parse(raw));
  } catch {
    return DEFAULT_FOCUS_CONFIG;
  }
}

export function writeFocusConfig(
  pubkey: string,
  config: FocusModeConfig,
): boolean {
  if (pubkey.length === 0) {
    return false;
  }
  return setStorageItem(focusStorageKey(pubkey), JSON.stringify(config));
}
