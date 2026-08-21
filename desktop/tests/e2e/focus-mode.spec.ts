import { expect, test } from "@playwright/test";

import { installMockBridge } from "../helpers/bridge";

const MOCK_PUBKEY = "deadbeef".repeat(8);
const ENGINEERING_CHANNEL_ID = "1c7e1c02-87bb-5e88-b2da-5a7a9432d0c9";
const FOCUS_STORAGE_KEY = `buzz-focus-mode.v1:${MOCK_PUBKEY}`;

function seedFocusConfig(
  page: import("@playwright/test").Page,
  config: Record<string, unknown>,
) {
  return page.addInitScript(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: FOCUS_STORAGE_KEY, value: config },
  );
}

test.describe("focus mode", () => {
  test("01 — seeded focus trims the sidebar to important channels", async ({
    page,
  }) => {
    await seedFocusConfig(page, {
      enabled: true,
      importantPubkeys: [],
      importantChannelIds: [ENGINEERING_CHANNEL_ID],
      dmPolicy: "important",
      mentionsBreakThrough: true,
      followedThreadsBreakThrough: true,
      updatedAt: 1_700_000_000,
    });
    await installMockBridge(page);
    await page.goto("/");

    // Focus affordances are visible.
    await expect(page.getByTestId("sidebar-focus-banner")).toBeVisible();
    await expect(page.getByTestId("focus-mode-indicator")).toBeVisible();
    await expect(page.getByTestId("toggle-focus-mode")).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // The important channel stays; a non-allowlisted member channel is hidden.
    await expect(page.getByTestId("channel-engineering")).toBeVisible();
    await expect(page.getByTestId("channel-random")).toHaveCount(0);

    // Exiting focus from the sidebar banner restores the full channel list.
    await page.getByTestId("sidebar-exit-focus").click();
    await expect(page.getByTestId("sidebar-focus-banner")).toHaveCount(0);
    await expect(page.getByTestId("channel-random")).toBeVisible();
  });

  test("02 — top-chrome toggle enters focus and hides channels", async ({
    page,
  }) => {
    await installMockBridge(page);
    await page.goto("/");

    // Starts off: no banner, a normal member channel is visible.
    await expect(page.getByTestId("channel-random")).toBeVisible();
    await expect(page.getByTestId("sidebar-focus-banner")).toHaveCount(0);
    await expect(page.getByTestId("toggle-focus-mode")).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    // Toggle focus on — with an empty allowlist every non-priority channel hides.
    await page.getByTestId("toggle-focus-mode").click();
    await expect(page.getByTestId("sidebar-focus-banner")).toBeVisible();
    await expect(page.getByTestId("channel-random")).toHaveCount(0);
  });
});
