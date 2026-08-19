import 'dart:math' show min;

import 'package:flutter/material.dart';

/// Superhuman Mesh mark. Callers may still pass [flapAmount] / [eyeProgress]
/// for API compatibility; the mesh is static.
class FlappingBee extends StatelessWidget {
  /// The rendered width of the complete mark.
  final double width;

  /// The color used for the mesh strokes and nodes.
  final Color color;

  /// Unused. Kept so existing call sites compile.
  final double flapAmount;

  /// Unused. Kept so existing call sites compile.
  final double? eyeProgress;

  const FlappingBee({
    required this.width,
    required this.color,
    required this.flapAmount,
    this.eyeProgress,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: CustomPaint(
        size: Size.square(width),
        painter: _MeshMarkPainter(color: color),
      ),
    );
  }
}

class _MeshMarkPainter extends CustomPainter {
  final Color color;

  const _MeshMarkPainter({required this.color});

  static const _nodes = <Offset>[
    Offset(256.0, 256.0),
    Offset(256.0, 197.2),
    Offset(297.6, 214.4),
    Offset(314.8, 256.0),
    Offset(297.6, 297.6),
    Offset(256.0, 314.8),
    Offset(214.4, 297.6),
    Offset(197.2, 256.0),
    Offset(214.4, 214.4),
    Offset(256.0, 151.0),
    Offset(308.5, 165.1),
    Offset(346.9, 203.5),
    Offset(361.0, 256.0),
    Offset(346.9, 308.5),
    Offset(308.5, 346.9),
    Offset(256.0, 361.0),
    Offset(203.5, 346.9),
    Offset(165.1, 308.5),
    Offset(151.0, 256.0),
    Offset(165.1, 203.5),
    Offset(203.5, 165.1),
    Offset(256.0, 104.8),
    Offset(313.9, 116.3),
    Offset(362.9, 149.1),
    Offset(395.7, 198.1),
    Offset(407.2, 256.0),
    Offset(395.7, 313.9),
    Offset(362.9, 362.9),
    Offset(313.9, 395.7),
    Offset(256.0, 407.2),
    Offset(198.1, 395.7),
    Offset(149.1, 362.9),
    Offset(116.3, 313.9),
    Offset(104.8, 256.0),
    Offset(116.3, 198.1),
    Offset(149.1, 149.1),
    Offset(198.1, 116.3),
    Offset(256.0, 62.8),
    Offset(315.7, 72.3),
    Offset(369.6, 99.7),
    Offset(412.3, 142.4),
    Offset(439.7, 196.3),
    Offset(449.2, 256.0),
    Offset(439.7, 315.7),
    Offset(412.3, 369.6),
    Offset(369.6, 412.3),
    Offset(315.7, 439.7),
    Offset(256.0, 449.2),
    Offset(196.3, 439.7),
    Offset(142.4, 412.3),
    Offset(99.7, 369.6),
    Offset(72.3, 315.7),
    Offset(62.8, 256.0),
    Offset(72.3, 196.3),
    Offset(99.7, 142.4),
    Offset(142.4, 99.7),
    Offset(196.3, 72.3),
    Offset(256.0, 46.0),
    Offset(336.4, 62.0),
    Offset(404.5, 107.5),
    Offset(450.0, 175.6),
    Offset(466.0, 256.0),
    Offset(450.0, 336.4),
    Offset(404.5, 404.5),
    Offset(336.4, 450.0),
    Offset(256.0, 466.0),
    Offset(175.6, 450.0),
    Offset(107.5, 404.5),
    Offset(62.0, 336.4),
    Offset(46.0, 256.0),
    Offset(62.0, 175.6),
    Offset(107.5, 107.5),
    Offset(175.6, 62.0),
    Offset(134.2, 386.2),
    Offset(134.2, 298.0),
    Offset(134.2, 209.8),
    Offset(134.2, 125.8),
    Offset(188.8, 218.2),
    Offset(256.0, 302.2),
    Offset(323.2, 218.2),
    Offset(377.8, 125.8),
    Offset(377.8, 209.8),
    Offset(377.8, 298.0),
    Offset(377.8, 386.2),
    Offset(176.2, 386.2),
    Offset(335.8, 386.2),
    Offset(214.0, 125.8),
    Offset(298.0, 125.8),
  ];

  static const _edges = <(int, int)>[
    (0, 2),
    (0, 6),
    (0, 78),
    (1, 2),
    (1, 8),
    (1, 9),
    (2, 3),
    (2, 10),
    (2, 79),
    (3, 4),
    (3, 12),
    (3, 79),
    (4, 5),
    (4, 13),
    (4, 14),
    (4, 78),
    (5, 6),
    (5, 15),
    (5, 78),
    (6, 7),
    (6, 16),
    (6, 17),
    (6, 78),
    (7, 8),
    (7, 18),
    (7, 77),
    (8, 20),
    (8, 77),
    (9, 21),
    (9, 86),
    (10, 22),
    (10, 87),
    (11, 24),
    (11, 79),
    (11, 81),
    (12, 25),
    (12, 81),
    (12, 82),
    (13, 26),
    (13, 82),
    (14, 15),
    (14, 28),
    (14, 85),
    (15, 29),
    (16, 30),
    (16, 84),
    (17, 32),
    (17, 74),
    (18, 33),
    (18, 74),
    (18, 75),
    (19, 34),
    (19, 75),
    (19, 77),
    (20, 36),
    (20, 86),
    (21, 37),
    (21, 57),
    (21, 86),
    (21, 87),
    (22, 38),
    (22, 58),
    (22, 87),
    (23, 39),
    (23, 40),
    (23, 80),
    (24, 41),
    (24, 60),
    (24, 81),
    (25, 42),
    (25, 61),
    (25, 82),
    (26, 43),
    (26, 62),
    (26, 82),
    (27, 44),
    (27, 83),
    (27, 85),
    (28, 46),
    (28, 64),
    (28, 85),
    (29, 47),
    (29, 65),
    (30, 48),
    (30, 66),
    (30, 84),
    (31, 49),
    (31, 50),
    (31, 73),
    (31, 84),
    (32, 51),
    (32, 68),
    (32, 74),
    (33, 52),
    (33, 69),
    (33, 74),
    (34, 53),
    (34, 70),
    (34, 75),
    (35, 54),
    (35, 55),
    (35, 76),
    (36, 56),
    (36, 72),
    (36, 86),
    (37, 38),
    (37, 57),
    (38, 57),
    (38, 58),
    (38, 87),
    (39, 58),
    (39, 59),
    (39, 80),
    (40, 59),
    (40, 60),
    (40, 80),
    (41, 42),
    (41, 60),
    (41, 61),
    (42, 43),
    (42, 61),
    (43, 62),
    (44, 62),
    (44, 63),
    (44, 83),
    (45, 63),
    (45, 64),
    (45, 83),
    (45, 85),
    (46, 64),
    (46, 85),
    (47, 48),
    (47, 65),
    (48, 65),
    (48, 66),
    (48, 84),
    (49, 66),
    (49, 67),
    (49, 73),
    (49, 84),
    (50, 51),
    (50, 67),
    (50, 68),
    (50, 73),
    (51, 68),
    (52, 53),
    (52, 69),
    (53, 69),
    (53, 70),
    (54, 70),
    (54, 71),
    (54, 76),
    (55, 71),
    (55, 72),
    (55, 76),
    (56, 72),
    (56, 86),
    (59, 80),
    (63, 83),
    (67, 73),
    (71, 76),
    (73, 74),
    (73, 84),
    (74, 75),
    (75, 76),
    (76, 77),
    (76, 86),
    (77, 78),
    (78, 79),
    (79, 80),
    (80, 81),
    (80, 87),
    (81, 82),
    (82, 83),
    (83, 85),
    (86, 87),
  ];

  static const _hub = <int>{
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
  };

  @override
  void paint(Canvas canvas, Size size) {
    final scale = min(size.width, size.height) / 512;
    canvas
      ..save()
      ..translate(
        (size.width - 512 * scale) / 2,
        (size.height - 512 * scale) / 2,
      )
      ..scale(scale);

    final line = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    for (final edge in _edges) {
      line.strokeWidth = _hub.contains(edge.$1) && _hub.contains(edge.$2)
          ? 2.6
          : 1.35;
      canvas.drawLine(_nodes[edge.$1], _nodes[edge.$2], line);
    }

    final fill = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    for (var i = 0; i < _nodes.length; i++) {
      canvas.drawCircle(_nodes[i], _hub.contains(i) ? 5.4 : 3.4, fill);
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(_MeshMarkPainter oldDelegate) =>
      color != oldDelegate.color;
}
