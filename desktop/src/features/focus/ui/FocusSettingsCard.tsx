import * as React from "react";
import { Hash, Plus, Search, X } from "lucide-react";

import { useChannelsQuery } from "@/features/channels/hooks";
import { ProfileAvatar } from "@/features/profile/ui/ProfileAvatar";
import {
  useFlattenedUserSearchResults,
  useInfiniteUserSearchQuery,
  useUsersBatchQuery,
} from "@/features/profile/hooks";
import { resolveUserLabel } from "@/features/profile/lib/identity";
import { FIBRE_KINDS, type FibreKind } from "@/features/triage/api";
import { SettingsSectionHeader } from "@/features/settings/ui/SettingsSectionHeader";
import {
  SettingsOptionGroup,
  SettingsOptionGroupList,
  SettingsOptionRow,
} from "@/features/settings/ui/SettingsOptionGroup";
import { cn } from "@/shared/lib/cn";
import { normalizePubkey, truncatePubkey } from "@/shared/lib/pubkey";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { useFocusMode } from "@/features/focus/useFocusMode";

const FIBRE_KIND_LABELS: Record<FibreKind, string> = {
  blocker: "Blockers",
  decision: "Decisions",
  ask: "Asks",
  commitment: "Commitments",
  idea: "Ideas",
  question: "Questions",
  fyi: "FYIs",
};

function ImportantPeopleEditor({
  currentPubkey,
  importantPubkeys,
  onAdd,
  onRemove,
}: {
  currentPubkey?: string;
  importantPubkeys: string[];
  onAdd: (pubkey: string) => void;
  onRemove: (pubkey: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const trimmed = query.trim();
  const searchQuery = useInfiniteUserSearchQuery(trimmed, {
    allowEmpty: false,
    enabled: trimmed.length > 0,
    limit: 20,
  });
  const results = useFlattenedUserSearchResults(searchQuery.data);
  const selectedSet = React.useMemo(
    () => new Set(importantPubkeys.map(normalizePubkey)),
    [importantPubkeys],
  );
  const selectedProfilesQuery = useUsersBatchQuery(importantPubkeys, {
    enabled: importantPubkeys.length > 0,
  });
  const selectedProfiles = selectedProfilesQuery.data?.profiles;

  const visibleResults = results
    .filter((user) => !selectedSet.has(normalizePubkey(user.pubkey)))
    .slice(0, 8);

  return (
    <div className="space-y-3 px-4 py-3">
      {importantPubkeys.length > 0 ? (
        <div
          className="flex flex-wrap gap-1.5"
          data-testid="focus-people-chips"
        >
          {importantPubkeys.map((pubkey) => {
            const profile = selectedProfiles?.[normalizePubkey(pubkey)];
            const label =
              profile?.displayName?.trim() || truncatePubkey(pubkey);
            return (
              <span
                className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 py-0.5 pl-1 pr-1.5 text-xs"
                key={pubkey}
              >
                <ProfileAvatar
                  avatarUrl={profile?.avatarUrl ?? null}
                  className="h-4 w-4 text-3xs"
                  iconClassName="h-2.5 w-2.5"
                  label={label}
                />
                <span className="max-w-40 truncate">{label}</span>
                <button
                  aria-label={`Remove ${label}`}
                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  onClick={() => onRemove(pubkey)}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-8 text-sm"
          data-testid="focus-people-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people to mark important"
          value={query}
        />
      </div>

      {trimmed.length > 0 ? (
        <div
          className="max-h-56 divide-y divide-border/50 overflow-y-auto rounded-lg border border-border/60"
          data-testid="focus-people-results"
        >
          {visibleResults.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              {searchQuery.isLoading ? "Searching…" : "No matching people."}
            </p>
          ) : (
            visibleResults.map((user) => {
              const label = resolveUserLabel({
                currentPubkey,
                profiles: undefined,
                pubkey: user.pubkey,
                fallbackName: user.displayName,
              });
              return (
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
                  key={user.pubkey}
                  onClick={() => {
                    onAdd(user.pubkey);
                    setQuery("");
                  }}
                  type="button"
                >
                  <ProfileAvatar
                    avatarUrl={user.avatarUrl ?? null}
                    className="h-6 w-6 text-2xs"
                    iconClassName="h-3 w-3"
                    label={label}
                  />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}

function ImportantChannelsEditor({
  importantChannelIds,
  onToggle,
}: {
  importantChannelIds: string[];
  onToggle: (channelId: string, next: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const channelsQuery = useChannelsQuery();
  const selectedSet = React.useMemo(
    () => new Set(importantChannelIds),
    [importantChannelIds],
  );
  const channels = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return (channelsQuery.data ?? [])
      .filter(
        (channel) =>
          channel.isMember &&
          channel.archivedAt === null &&
          (channel.channelType === "stream" || channel.channelType === "forum"),
      )
      .filter(
        (channel) =>
          trimmed.length === 0 ||
          (channel.name ?? "").toLowerCase().includes(trimmed),
      )
      .sort((left, right) => {
        // Selected first, then alphabetical, so armed channels stay in view.
        const leftSelected = selectedSet.has(left.id) ? 0 : 1;
        const rightSelected = selectedSet.has(right.id) ? 0 : 1;
        if (leftSelected !== rightSelected) {
          return leftSelected - rightSelected;
        }
        return (left.name ?? "").localeCompare(right.name ?? "");
      });
  }, [channelsQuery.data, query, selectedSet]);

  return (
    <div className="space-y-3 px-4 py-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-8 text-sm"
          data-testid="focus-channel-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search channels"
          value={query}
        />
      </div>
      <div
        className="max-h-64 divide-y divide-border/50 overflow-y-auto rounded-lg border border-border/60"
        data-testid="focus-channel-list"
      >
        {channels.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">
            No channels found.
          </p>
        ) : (
          channels.map((channel) => {
            const selected = selectedSet.has(channel.id);
            return (
              <div
                className="flex items-center gap-2 px-3 py-2 text-sm"
                data-testid={`focus-channel-row-${channel.id}`}
                key={channel.id}
              >
                <Hash
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    selected ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span className="min-w-0 flex-1 truncate">
                  {channel.name ?? "Untitled"}
                </span>
                <Switch
                  aria-label={`Mark ${channel.name ?? "channel"} important`}
                  checked={selected}
                  onCheckedChange={(next) => onToggle(channel.id, next)}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function FocusSettingsCard({
  currentPubkey,
}: {
  currentPubkey?: string;
}) {
  const focus = useFocusMode(currentPubkey);
  const { config } = focus;
  const hiddenFibreKinds = React.useMemo(
    () => new Set(config.hiddenFibreKinds),
    [config.hiddenFibreKinds],
  );

  return (
    <section className="min-w-0" data-testid="settings-focus">
      <SettingsSectionHeader
        title="Focus"
        description="Silence everything except the people, channels, and threads you choose. Turn it on for deep work and only what matters breaks through."
      />

      <SettingsOptionGroupList>
        <SettingsOptionGroup title="Focus mode">
          <SettingsOptionRow>
            <div className="min-w-0">
              <label className="text-sm font-medium" htmlFor="focus-enabled">
                Focus mode
              </label>
              <p
                className="text-sm font-normal text-muted-foreground/70"
                data-settings-subcopy
              >
                Mutes notifications, sounds, and badges, and trims the sidebar
                and inbox to your allowlist.
              </p>
            </div>
            <Switch
              checked={config.enabled}
              data-testid="focus-enabled-toggle"
              id="focus-enabled"
              onCheckedChange={focus.setEnabled}
            />
          </SettingsOptionRow>
        </SettingsOptionGroup>

        <SettingsOptionGroup title="What breaks through">
          <SettingsOptionRow>
            <div className="min-w-0">
              <span className="text-sm font-medium">All direct messages</span>
              <p
                className="text-sm font-normal text-muted-foreground/70"
                data-settings-subcopy
              >
                On: every DM breaks through. Off: only DMs from important
                people.
              </p>
            </div>
            <Switch
              aria-label="All direct messages break through"
              checked={config.dmPolicy === "all"}
              data-testid="focus-dm-policy-toggle"
              onCheckedChange={(next) =>
                focus.setDmPolicy(next ? "all" : "important")
              }
            />
          </SettingsOptionRow>
          <SettingsOptionRow>
            <div className="min-w-0">
              <span className="text-sm font-medium">Direct @-mentions</span>
              <p
                className="text-sm font-normal text-muted-foreground/70"
                data-settings-subcopy
              >
                Let messages that mention you break through.
              </p>
            </div>
            <Switch
              aria-label="Mentions break through"
              checked={config.mentionsBreakThrough}
              data-testid="focus-mentions-toggle"
              onCheckedChange={focus.setMentionsBreakThrough}
            />
          </SettingsOptionRow>
          <SettingsOptionRow>
            <div className="min-w-0">
              <span className="text-sm font-medium">Followed threads</span>
              <p
                className="text-sm font-normal text-muted-foreground/70"
                data-settings-subcopy
              >
                Let replies in threads you follow break through.
              </p>
            </div>
            <Switch
              aria-label="Followed threads break through"
              checked={config.followedThreadsBreakThrough}
              data-testid="focus-threads-toggle"
              onCheckedChange={focus.setFollowedThreadsBreakThrough}
            />
          </SettingsOptionRow>
        </SettingsOptionGroup>

        <SettingsOptionGroup
          description="While focused, only these fibre types reach your inbox — on top of the important people and channels below."
          title="Inbox categories"
        >
          {FIBRE_KINDS.map((kind) => (
            <SettingsOptionRow key={kind}>
              <span className="text-sm font-medium">
                {FIBRE_KIND_LABELS[kind]}
              </span>
              <Switch
                aria-label={`Show ${FIBRE_KIND_LABELS[kind]} in the inbox`}
                checked={!hiddenFibreKinds.has(kind)}
                data-testid={`focus-fibre-kind-${kind}`}
                onCheckedChange={(allowed) =>
                  focus.setFibreKindAllowed(kind, allowed)
                }
              />
            </SettingsOptionRow>
          ))}
        </SettingsOptionGroup>

        <SettingsOptionGroup
          description="Their DMs and messages always break through, and their DMs stay in the sidebar."
          title="Important people"
        >
          <ImportantPeopleEditor
            currentPubkey={currentPubkey}
            importantPubkeys={config.importantPubkeys}
            onAdd={focus.addImportantUser}
            onRemove={focus.removeImportantUser}
          />
        </SettingsOptionGroup>

        <SettingsOptionGroup
          description="These channels stay visible and keep notifying while focused."
          title="Important channels"
        >
          <ImportantChannelsEditor
            importantChannelIds={config.importantChannelIds}
            onToggle={(channelId, next) =>
              next
                ? focus.addImportantChannel(channelId)
                : focus.removeImportantChannel(channelId)
            }
          />
        </SettingsOptionGroup>
      </SettingsOptionGroupList>
    </section>
  );
}
