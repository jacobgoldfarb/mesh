import 'package:buzz/shared/deeplink/deep_link.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  _inviteTests();
  _channelTests();
  _buildMessageLinkTests();

  group('parseMessageDeepLink', () {
    const channel = '580ca78b-9dae-46f3-8854-bd671853ba32';
    const id =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const thread =
        'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

    test('parses canonical channel, id, and optional thread', () {
      expect(
        parseMessageDeepLink(
          Uri.parse('mesh://message?channel=$channel&id=$id&thread=$thread'),
        ),
        const MessageDeepLink(
          channelId: channel,
          messageId: id,
          threadRootId: thread,
        ),
      );
    });

    test('rejects malformed or ambiguous forms', () {
      for (final url in [
        'mesh://message?id=$id',
        'mesh://message?channel=&id=$id',
        'mesh://message?channel=$channel',
        'https://message?channel=$channel&id=$id',
        'mesh://connect?channel=$channel&id=$id',
        'mesh://message:1234?channel=$channel&id=$id',
        'mesh://message/path?channel=$channel&id=$id',
        'mesh://message?channel=$channel&id=$id#fragment',
        'mesh://user@message?channel=$channel&id=$id',
        'mesh://message?channel=$channel&id=$id&extra=true',
        'mesh://message?channel=$channel&channel=$channel&id=$id',
        'mesh://message?channel=$channel&id=$id&id=$id',
        'mesh://message?channel=$channel&id=$id&thread=',
        'mesh://message?channel=not-a-uuid&id=$id',
        'mesh://message?channel=$channel&id=not-hex',
        'mesh://message?channel=$channel&id=$id&thread=not-hex',
      ]) {
        expect(parseMessageDeepLink(Uri.parse(url)), isNull, reason: url);
      }
    });
  });
}

void _channelTests() {
  group('parseChannelDeepLink', () {
    test('parses canonical channel path', () {
      expect(
        parseChannelDeepLink(
          Uri.parse('mesh://channel/580ca78b-9dae-46f3-8854-bd671853ba32'),
        ),
        const ChannelDeepLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
        ),
      );
    });

    test('accepts v7 and canonicalizes uppercase UUIDs', () {
      expect(
        parseChannelDeepLink(
          Uri.parse('mesh://channel/018fdb5d-3a64-7c35-b5f9-4a23e1f9d2d9'),
        ),
        const ChannelDeepLink(
          channelId: '018fdb5d-3a64-7c35-b5f9-4a23e1f9d2d9',
        ),
      );
      expect(
        parseChannelDeepLink(
          Uri.parse('mesh://channel/580CA78B-9DAE-46F3-8854-BD671853BA32'),
        ),
        const ChannelDeepLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
        ),
      );
    });

    test('rejects missing, extra, query, and fragment forms', () {
      for (final url in [
        'mesh://channel',
        'mesh://channel/',
        'mesh://channel/one/two',
        'mesh://channel:1234/580ca78b-9dae-46f3-8854-bd671853ba32',
        'mesh://channel/one?extra=true',
        'mesh://channel/one#fragment',
        'https://channel/one',
        'mesh://channel/not-a-uuid',
        'mesh://channel/%2F',
        'mesh://channel/%00',
      ]) {
        expect(parseChannelDeepLink(Uri.parse(url)), isNull, reason: url);
      }
    });

    test('is included in the top-level parser', () {
      expect(
        parseBuzzDeepLink(
          Uri.parse('mesh://channel/580ca78b-9dae-46f3-8854-bd671853ba32'),
        ),
        const ChannelDeepLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
        ),
      );
    });
  });
}

void _inviteTests() {
  group('parseInviteDeepLink', () {
    test('parses canonical HTTPS invite URL', () {
      final link = parseInviteDeepLink(
        Uri.parse('https://relay.example.com/invite/abc123'),
      );
      expect(
        link,
        const InviteDeepLink(
          relayUrl: 'wss://relay.example.com',
          code: 'abc123',
        ),
      );
    });

    test('parses HTTP invite URL for local/dev relays', () {
      final link = parseInviteDeepLink(
        Uri.parse('http://localhost:3000/invite/dev-code'),
      );
      expect(
        link,
        const InviteDeepLink(relayUrl: 'ws://localhost:3000', code: 'dev-code'),
      );
    });

    test('parses buzz join handoff link', () {
      final link = parseInviteDeepLink(
        Uri.parse(
          'mesh://join?relay=wss%3A%2F%2Frelay.example.com&code=abc123',
        ),
      );
      expect(
        link,
        const InviteDeepLink(
          relayUrl: 'wss://relay.example.com',
          code: 'abc123',
        ),
      );
    });

    test('normalizes trailing slash in buzz join handoff', () {
      final link = parseInviteDeepLink(
        Uri.parse(
          'mesh://join?relay=wss%3A%2F%2Frelay.example.com%2F&code=abc123',
        ),
      );
      expect(link?.relayUrl, 'wss://relay.example.com');
    });

    test('rejects plaintext public buzz join handoff', () {
      final relay = Uri.encodeQueryComponent('ws://relay.example.com');
      expect(
        parseInviteDeepLink(Uri.parse('mesh://join?relay=$relay&code=abc')),
        isNull,
      );
    });

    test('preserves policy receipt in buzz join handoff', () {
      final link = parseInviteDeepLink(
        Uri.parse(
          'mesh://join?relay=wss%3A%2F%2Frelay.example.com&code=abc123&policy_receipt=receipt.value',
        ),
      );
      expect(
        link,
        const InviteDeepLink(
          relayUrl: 'wss://relay.example.com',
          code: 'abc123',
          policyReceipt: 'receipt.value',
        ),
      );
    });

    test('rejects non-invite HTTPS paths', () {
      expect(
        parseInviteDeepLink(Uri.parse('https://relay.example.com/api/invites')),
        isNull,
      );
      expect(
        parseInviteDeepLink(Uri.parse('https://relay.example.com/invite/')),
        isNull,
      );
      expect(
        parseInviteDeepLink(Uri.parse('https://relay.example.com/invite/a/b')),
        isNull,
      );
    });

    test('rejects credentials and fragments', () {
      expect(
        parseInviteDeepLink(
          Uri.parse('https://user:pass@relay.example.com/invite/abc'),
        ),
        isNull,
      );
      expect(
        parseInviteDeepLink(
          Uri.parse('https://relay.example.com/invite/abc#x'),
        ),
        isNull,
      );
      expect(
        parseInviteDeepLink(
          Uri.parse(
            'mesh://join?relay=wss%3A%2F%2Fuser%3Apass%40relay.example.com&code=abc',
          ),
        ),
        isNull,
      );
    });

    test('rejects buzz join without websocket relay or code', () {
      expect(
        parseInviteDeepLink(
          Uri.parse('mesh://join?relay=https://relay.example.com&code=abc'),
        ),
        isNull,
      );
      expect(
        parseInviteDeepLink(
          Uri.parse('mesh://join?relay=wss://relay.example.com'),
        ),
        isNull,
      );
      expect(
        parseInviteDeepLink(Uri.parse('mesh://connect?relay=wss://x')),
        isNull,
      );
    });

    test('rejects non-public invite relay destinations', () {
      for (final url in [
        'https://127.0.0.1/invite/abc',
        'https://169.254.169.254/invite/abc',
        'https://192.168.1.1/invite/abc',
        'https://[::1]/invite/abc',
        'https://[::ffff:127.0.0.1]/invite/abc',
      ]) {
        expect(parseInviteDeepLink(Uri.parse(url)), isNull, reason: url);
      }
    });

    test('rejects buzz join with dangerous relay schemes', () {
      // The `relay=` param is an allowlist — only `ws` / `wss` are safe to
      // hand to a Nostr relay session. Anything else must be dropped by the
      // parser so a hostile QR / share link can't smuggle a browser scheme
      // (`javascript:`, `data:`), a local resource (`file:`), or an
      // unrelated transport (`ftp:`, `chrome:`) into the join flow.
      for (final hostile in [
        'javascript:alert(1)',
        'data:text/html,evil',
        'file:///etc/passwd',
        'ftp://relay.example.com',
        'chrome://settings',
        'about:blank',
        'ssh://relay.example.com',
      ]) {
        final encoded = Uri.encodeQueryComponent(hostile);
        expect(
          parseInviteDeepLink(Uri.parse('mesh://join?relay=$encoded&code=abc')),
          isNull,
          reason: 'must reject relay scheme in $hostile',
        );
      }
    });
  });
}

void _buildMessageLinkTests() {
  group('buildMessageLink', () {
    test('builds channel + id link', () {
      expect(
        buildMessageLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
          messageId:
              'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        ),
        'mesh://message?channel=580ca78b-9dae-46f3-8854-bd671853ba32&id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      );
    });

    test('includes thread root when present', () {
      expect(
        buildMessageLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
          messageId:
              'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          threadRootId:
              'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        ),
        'mesh://message?channel=580ca78b-9dae-46f3-8854-bd671853ba32&id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&thread=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      );
    });

    test('treats empty thread root as absent', () {
      expect(
        buildMessageLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
          messageId:
              'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          threadRootId: '',
        ),
        'mesh://message?channel=580ca78b-9dae-46f3-8854-bd671853ba32&id=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      );
    });

    test('round-trips through parseMessageDeepLink', () {
      final url = buildMessageLink(
        channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
        messageId:
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        threadRootId:
            'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      );
      final parsed = parseMessageDeepLink(Uri.parse(url));
      expect(
        parsed,
        const MessageDeepLink(
          channelId: '580ca78b-9dae-46f3-8854-bd671853ba32',
          messageId:
              'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          threadRootId:
              'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        ),
      );
    });

    test('throws on empty channel or id', () {
      expect(
        () => buildMessageLink(channelId: '', messageId: 'abc'),
        throwsArgumentError,
      );
      expect(
        () => buildMessageLink(channelId: 'chan', messageId: ''),
        throwsArgumentError,
      );
    });
  });
  group('entity deep links', () {
    final owner = 'ab' * 32;
    final id = 'cd' * 32;

    test('parses repo, PR, and issue permalinks', () {
      expect(
        parseEntityDeepLink(Uri.parse('mesh://repo?owner=$owner&d=buzz'))?.type,
        'repo',
      );
      expect(
        parseEntityDeepLink(
          Uri.parse('mesh://pr?id=$id&owner=$owner&d=buzz'),
        )?.eventId,
        id,
      );
      expect(
        parseEntityDeepLink(
          Uri.parse('mesh://issue?id=$id&owner=$owner&d=buzz'),
        )?.type,
        'issue',
      );
    });

    test('rejects malformed entity permalinks', () {
      expect(
        parseEntityDeepLink(Uri.parse('mesh://repo?owner=short&d=buzz')),
        isNull,
      );
      expect(
        parseEntityDeepLink(
          Uri.parse('mesh://pr?id=$id&owner=$owner&d=buzz&extra=true'),
        ),
        isNull,
      );
      expect(
        parseEntityDeepLink(Uri.parse('mesh://repo?owner=$owner&d=a..b')),
        isNull,
      );
      expect(
        parseEntityDeepLink(
          Uri.parse('mesh://repo?owner=$owner&d=${'a' * 65}'),
        ),
        isNull,
      );
      for (final url in [
        'mesh://repo?owner=$owner&owner=$owner&d=buzz',
        'mesh://repo?owner=$owner&d=buzz&d=other',
        'mesh://pr?id=$id&id=$id&owner=$owner&d=buzz',
        'mesh://issue?id=$id&owner=$owner&owner=$owner&d=buzz',
      ]) {
        expect(parseEntityDeepLink(Uri.parse(url)), isNull, reason: url);
      }
    });
  });
}
