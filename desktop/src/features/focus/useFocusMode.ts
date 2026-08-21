import * as React from "react";

import { normalizePubkey } from "@/shared/lib/pubkey";
import {
  DEFAULT_FOCUS_CONFIG,
  focusStorageKey,
  MAX_FOCUS_ENTRIES,
  readFocusConfig,
  writeFocusConfig,
  type FocusDmPolicy,
  type FocusModeConfig,
} from "./focusModeStorage";

// Module-level store keyed by pubkey so every `useFocusMode` caller (settings
// card, AppShell, top-chrome toggle, notification gates) shares one reactive
// source via `useSyncExternalStore`. The cache holds a stable object per
// pubkey and only replaces it on write, so `getSnapshot` stays referentially
// stable between unrelated renders. Only one identity is active at a time, so
// a single slot per pubkey is sufficient; entries never leak across
// communities because pubkeys are global and channel ids are unique UUIDs.
const listeners = new Set<() => void>();
const cache = new Map<string, FocusModeConfig>();

function emitChange(): void {
  for (const listener of listeners) {
    listener();
  }
}

function getConfigFor(pubkey: string): FocusModeConfig {
  if (pubkey.length === 0) {
    return DEFAULT_FOCUS_CONFIG;
  }
  const cached = cache.get(pubkey);
  if (cached) {
    return cached;
  }
  const loaded = readFocusConfig(pubkey);
  cache.set(pubkey, loaded);
  return loaded;
}

function updateConfig(
  pubkey: string,
  updater: (prev: FocusModeConfig) => FocusModeConfig,
): void {
  if (pubkey.length === 0) {
    return;
  }
  const prev = getConfigFor(pubkey);
  const next: FocusModeConfig = {
    ...updater(prev),
    updatedAt: Math.floor(Date.now() / 1000),
  };
  cache.set(pubkey, next);
  writeFocusConfig(pubkey, next);
  emitChange();
}

/** Non-hook read for module consumers and tests. */
export function getFocusConfig(pubkey: string | undefined): FocusModeConfig {
  return getConfigFor(pubkey ? normalizePubkey(pubkey) : "");
}

/** Reset the in-memory cache — test-only helper. */
export function __resetFocusModeCacheForTests(): void {
  cache.clear();
}

function addTo(list: string[], value: string): string[] {
  if (value.length === 0 || list.includes(value)) {
    return list;
  }
  if (list.length >= MAX_FOCUS_ENTRIES) {
    return list;
  }
  return [...list, value];
}

export type FocusModeController = {
  config: FocusModeConfig;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  addImportantUser: (pubkey: string) => void;
  removeImportantUser: (pubkey: string) => void;
  addImportantChannel: (channelId: string) => void;
  removeImportantChannel: (channelId: string) => void;
  setDmPolicy: (policy: FocusDmPolicy) => void;
  setMentionsBreakThrough: (value: boolean) => void;
  setFollowedThreadsBreakThrough: (value: boolean) => void;
  /** Allow (or hide) an inbox fibre category while focused. */
  setFibreKindAllowed: (kind: string, allowed: boolean) => void;
};

export function useFocusMode(pubkey: string | undefined): FocusModeController {
  const normalizedPubkey = pubkey ? normalizePubkey(pubkey) : "";

  // Keep the module cache in sync with edits made in other windows.
  React.useEffect(() => {
    if (normalizedPubkey.length === 0) {
      return;
    }
    const key = focusStorageKey(normalizedPubkey);
    const handler = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }
      cache.set(normalizedPubkey, readFocusConfig(normalizedPubkey));
      emitChange();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [normalizedPubkey]);

  const subscribe = React.useCallback((listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const getSnapshot = React.useCallback(
    () => getConfigFor(normalizedPubkey),
    [normalizedPubkey],
  );

  const config = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULT_FOCUS_CONFIG,
  );

  const setEnabled = React.useCallback(
    (enabled: boolean) => {
      updateConfig(normalizedPubkey, (prev) => ({ ...prev, enabled }));
    },
    [normalizedPubkey],
  );
  const toggle = React.useCallback(() => {
    updateConfig(normalizedPubkey, (prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  }, [normalizedPubkey]);
  const addImportantUser = React.useCallback(
    (nextPubkey: string) => {
      const norm = normalizePubkey(nextPubkey);
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        importantPubkeys: addTo(prev.importantPubkeys, norm),
      }));
    },
    [normalizedPubkey],
  );
  const removeImportantUser = React.useCallback(
    (nextPubkey: string) => {
      const norm = normalizePubkey(nextPubkey);
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        importantPubkeys: prev.importantPubkeys.filter((p) => p !== norm),
      }));
    },
    [normalizedPubkey],
  );
  const addImportantChannel = React.useCallback(
    (channelId: string) => {
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        importantChannelIds: addTo(prev.importantChannelIds, channelId),
      }));
    },
    [normalizedPubkey],
  );
  const removeImportantChannel = React.useCallback(
    (channelId: string) => {
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        importantChannelIds: prev.importantChannelIds.filter(
          (id) => id !== channelId,
        ),
      }));
    },
    [normalizedPubkey],
  );
  const setDmPolicy = React.useCallback(
    (policy: FocusDmPolicy) => {
      updateConfig(normalizedPubkey, (prev) => ({ ...prev, dmPolicy: policy }));
    },
    [normalizedPubkey],
  );
  const setMentionsBreakThrough = React.useCallback(
    (value: boolean) => {
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        mentionsBreakThrough: value,
      }));
    },
    [normalizedPubkey],
  );
  const setFollowedThreadsBreakThrough = React.useCallback(
    (value: boolean) => {
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        followedThreadsBreakThrough: value,
      }));
    },
    [normalizedPubkey],
  );
  const setFibreKindAllowed = React.useCallback(
    (kind: string, allowed: boolean) => {
      updateConfig(normalizedPubkey, (prev) => ({
        ...prev,
        hiddenFibreKinds: allowed
          ? prev.hiddenFibreKinds.filter((k) => k !== kind)
          : addTo(prev.hiddenFibreKinds, kind),
      }));
    },
    [normalizedPubkey],
  );

  return {
    config,
    enabled: config.enabled,
    setEnabled,
    toggle,
    addImportantUser,
    removeImportantUser,
    addImportantChannel,
    removeImportantChannel,
    setDmPolicy,
    setMentionsBreakThrough,
    setFollowedThreadsBreakThrough,
    setFibreKindAllowed,
  };
}
