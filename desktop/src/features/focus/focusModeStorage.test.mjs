import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_FOCUS_CONFIG,
  sanitizeFocusConfig,
} from "./focusModeStorage.ts";

test("sanitizeFocusConfig: non-object returns the default config", () => {
  assert.deepEqual(sanitizeFocusConfig(null), DEFAULT_FOCUS_CONFIG);
  assert.deepEqual(sanitizeFocusConfig("nope"), DEFAULT_FOCUS_CONFIG);
});

test("sanitizeFocusConfig: normalizes and de-dupes important pubkeys", () => {
  const result = sanitizeFocusConfig({
    enabled: true,
    importantPubkeys: ["ABCD", "abcd", "  EF  ", 42, "ef"],
  });
  assert.deepEqual(result.importantPubkeys, ["abcd", "ef"]);
  assert.equal(result.enabled, true);
});

test("sanitizeFocusConfig: invalid dmPolicy falls back to 'important'", () => {
  assert.equal(
    sanitizeFocusConfig({ dmPolicy: "bogus" }).dmPolicy,
    "important",
  );
  assert.equal(sanitizeFocusConfig({ dmPolicy: "all" }).dmPolicy, "all");
});

test("sanitizeFocusConfig: boolean flags default when missing or wrong type", () => {
  const result = sanitizeFocusConfig({ mentionsBreakThrough: "yes" });
  assert.equal(result.mentionsBreakThrough, true);
  assert.equal(result.followedThreadsBreakThrough, true);
  assert.equal(
    sanitizeFocusConfig({ followedThreadsBreakThrough: false })
      .followedThreadsBreakThrough,
    false,
  );
});

test("sanitizeFocusConfig: drops non-string channel ids", () => {
  const result = sanitizeFocusConfig({
    importantChannelIds: ["chan-1", 7, "chan-1", "chan-2"],
  });
  assert.deepEqual(result.importantChannelIds, ["chan-1", "chan-2"]);
});

test("sanitizeFocusConfig: hiddenFibreKinds defaults to empty and de-dupes", () => {
  assert.deepEqual(sanitizeFocusConfig({}).hiddenFibreKinds, []);
  assert.deepEqual(
    sanitizeFocusConfig({ hiddenFibreKinds: ["fyi", "fyi", 3, "idea"] })
      .hiddenFibreKinds,
    ["fyi", "idea"],
  );
});

test("sanitizeFocusConfig: rejects negative or non-finite updatedAt", () => {
  assert.equal(sanitizeFocusConfig({ updatedAt: -5 }).updatedAt, 0);
  assert.equal(sanitizeFocusConfig({ updatedAt: Number.NaN }).updatedAt, 0);
  assert.equal(sanitizeFocusConfig({ updatedAt: 123 }).updatedAt, 123);
});
