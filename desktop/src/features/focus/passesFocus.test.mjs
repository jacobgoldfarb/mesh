import assert from "node:assert/strict";
import test from "node:test";

import {
  eventPassesFocus,
  feedItemPassesFocus,
  fibrePassesFocus,
  resolveFocusFilter,
} from "./passesFocus.ts";

const ME = "aaaa";
const IMPORTANT = "bbbb";
const STRANGER = "cccc";

function makeConfig(over = {}) {
  return {
    enabled: true,
    importantPubkeys: [],
    importantChannelIds: [],
    dmPolicy: "important",
    mentionsBreakThrough: true,
    followedThreadsBreakThrough: true,
    hiddenFibreKinds: [],
    updatedAt: 0,
    ...over,
  };
}

function makeEvent(over = {}) {
  return {
    id: "evt",
    pubkey: STRANGER,
    kind: 1,
    tags: [],
    content: "",
    created_at: 0,
    sig: "",
    ...over,
  };
}

// ── resolveFocusFilter ────────────────────────────────────────────────────

test("resolveFocusFilter normalizes and de-dupes pubkeys into a set", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantPubkeys: ["ABCD", "abcd"] }),
  );
  assert.equal(filter.importantPubkeys.has("abcd"), true);
  assert.equal(filter.importantPubkeys.size, 1);
});

// ── eventPassesFocus ──────────────────────────────────────────────────────

test("eventPassesFocus: disabled focus lets everything through", () => {
  const filter = resolveFocusFilter(makeConfig({ enabled: false }));
  assert.equal(eventPassesFocus(makeEvent(), ME, filter), true);
});

test("eventPassesFocus: non-allowlisted event is suppressed", () => {
  const filter = resolveFocusFilter(makeConfig());
  assert.equal(
    eventPassesFocus(makeEvent(), ME, filter, { channelId: "chan" }),
    false,
  );
});

test("eventPassesFocus: important author breaks through", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantPubkeys: [IMPORTANT] }),
  );
  assert.equal(
    eventPassesFocus(makeEvent({ pubkey: IMPORTANT }), ME, filter),
    true,
  );
});

test("eventPassesFocus: important channel breaks through", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantChannelIds: ["chan"] }),
  );
  assert.equal(
    eventPassesFocus(makeEvent(), ME, filter, { channelId: "chan" }),
    true,
  );
});

test("eventPassesFocus: mentions break through when enabled, not when disabled", () => {
  const event = makeEvent({ tags: [["p", ME]] });
  assert.equal(
    eventPassesFocus(event, ME, resolveFocusFilter(makeConfig()), {}),
    true,
  );
  assert.equal(
    eventPassesFocus(
      event,
      ME,
      resolveFocusFilter(makeConfig({ mentionsBreakThrough: false })),
      {},
    ),
    false,
  );
});

test("eventPassesFocus: dmPolicy 'all' lets any DM through", () => {
  const filter = resolveFocusFilter(makeConfig({ dmPolicy: "all" }));
  assert.equal(eventPassesFocus(makeEvent(), ME, filter, { isDm: true }), true);
  assert.equal(
    eventPassesFocus(makeEvent(), ME, filter, { isDm: false }),
    false,
  );
});

// ── feedItemPassesFocus ───────────────────────────────────────────────────

test("feedItemPassesFocus: mention category breaks through", () => {
  const filter = resolveFocusFilter(makeConfig());
  assert.equal(
    feedItemPassesFocus(
      { pubkey: STRANGER, channelId: "x", category: "mention" },
      filter,
    ),
    true,
  );
});

test("feedItemPassesFocus: non-allowlisted item is suppressed", () => {
  const filter = resolveFocusFilter(makeConfig());
  assert.equal(
    feedItemPassesFocus(
      { pubkey: STRANGER, channelId: "x", category: "activity" },
      filter,
    ),
    false,
  );
});

test("feedItemPassesFocus: important channel breaks through", () => {
  const filter = resolveFocusFilter(makeConfig({ importantChannelIds: ["x"] }));
  assert.equal(
    feedItemPassesFocus(
      { pubkey: STRANGER, channelId: "x", category: "activity" },
      filter,
    ),
    true,
  );
});

// ── fibrePassesFocus ──────────────────────────────────────────────────────

function makeFibre(over = {}) {
  return {
    kind: "blocker",
    channelId: "chan",
    isDm: false,
    people: [],
    artifacts: [],
    ...over,
  };
}

test("fibrePassesFocus: disabled focus keeps every fibre", () => {
  const filter = resolveFocusFilter(makeConfig({ enabled: false }));
  assert.equal(fibrePassesFocus(makeFibre(), filter), true);
});

test("fibrePassesFocus: important person keeps the fibre", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantPubkeys: [IMPORTANT] }),
  );
  assert.equal(
    fibrePassesFocus(makeFibre({ people: [{ pubkey: IMPORTANT }] }), filter),
    true,
  );
});

test("fibrePassesFocus: important artifact author keeps the fibre", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantPubkeys: [IMPORTANT] }),
  );
  assert.equal(
    fibrePassesFocus(
      makeFibre({ artifacts: [{ authorPubkey: IMPORTANT }] }),
      filter,
    ),
    true,
  );
});

test("fibrePassesFocus: unrelated fibre is filtered out", () => {
  const filter = resolveFocusFilter(makeConfig());
  assert.equal(
    fibrePassesFocus(makeFibre({ people: [{ pubkey: STRANGER }] }), filter),
    false,
  );
});

test("fibrePassesFocus: a hidden category is filtered out even from an important person", () => {
  const filter = resolveFocusFilter(
    makeConfig({ importantPubkeys: [IMPORTANT], hiddenFibreKinds: ["fyi"] }),
  );
  // Same important person, allowed category → shown.
  assert.equal(
    fibrePassesFocus(
      makeFibre({ kind: "blocker", people: [{ pubkey: IMPORTANT }] }),
      filter,
    ),
    true,
  );
  // Hidden category short-circuits regardless of the important source.
  assert.equal(
    fibrePassesFocus(
      makeFibre({ kind: "fyi", people: [{ pubkey: IMPORTANT }] }),
      filter,
    ),
    false,
  );
});
