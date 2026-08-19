/**
 * Utilities for classifying relay connectivity errors.
 *
 * The Rust backend (`desktop/src-tauri/src/relay.rs`) prefixes every
 * "relay unreachable" error message with this literal string so that the
 * frontend can distinguish a transient connectivity failure (e.g. corporate VPN
 * needs reauth, Cloudflare Access 403) from an application-level error.
 *
 * Contract: the Rust layer MUST emit errors starting with exactly this prefix
 * for any condition where the relay host is unreachable at the network or
 * auth layer. Do not change this string without updating relay.rs in lockstep.
 */
const RELAY_UNREACHABLE_PREFIX = "relay unreachable:";

export const RELAY_UNREACHABLE_SHORT = "Can't reach the relay.";
export const RELAY_UNREACHABLE_MESSAGE =
  "Can't reach the relay — check your VPN or network connection.";

/**
 * Returns true when `error` carries the stable Rust-layer prefix indicating
 * the relay is unreachable (network failure, VPN reauth needed, etc.).
 *
 * Accepts both `Error` instances and raw strings so callers can pass whatever
 * the Tauri IPC or WebSocket layer hands them without pre-normalizing.
 */
function errorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return null;
}

export function isRelayUnreachableError(error: unknown): boolean {
  const message = errorMessage(error);
  return message !== null && message.startsWith(RELAY_UNREACHABLE_PREFIX);
}

/**
 * True when the relay (or the local session latch) is refusing this identity
 * as a non-member / blocked pubkey.
 *
 * Includes `Relay session is terminal; cannot reconnect.` — that is what
 * `RelayClient.ensureConnected` throws after NIP-42 AUTH is permanently
 * rejected (`restricted:` / `blocked:`). Onboarding used to treat that as a
 * generic server error.
 */
export function isRelayMembershipDeniedError(error: unknown): boolean {
  const message = errorMessage(error);
  if (message === null) return false;
  const normalized = message.toLowerCase();
  return (
    normalized.includes("you must be a relay member") ||
    normalized.includes("relay_membership_required") ||
    normalized.includes("restricted:") ||
    normalized.includes("blocked:") ||
    normalized.includes("invalid: you are not a relay member") ||
    normalized.includes("relay session is terminal")
  );
}
