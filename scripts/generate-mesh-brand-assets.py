#!/usr/bin/env python3
"""Generate Superhuman Mesh icon masters, SVG marks, and splash/DMG assets."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SRC_ICON = Path(
    "/Users/jacob/.cursor/projects/Users-jacob-Developer-velo/assets/"
    "superhuman_mesh-09b69f6c-c4b8-444f-b818-ee3bcc64a605.png"
)
CHARCOAL = (45, 44, 49)
BLACK = (0, 0, 0)


def full_bleed_master(src: Path, dest: Path) -> Image.Image:
    """Fill the pre-applied squircle/bezel with charcoal so OS masks look right."""
    im = Image.open(src).convert("RGB")
    arr = np.asarray(im).copy()
    h, w = arr.shape[:2]
    cy, cx = (h - 1) / 2.0, (w - 1) / 2.0
    # Inset past the metallic bezel (~y=96) while keeping the circular mesh.
    radius = 400.0
    n = 5.0
    ys = (np.arange(h) - cy) / radius
    xs = (np.arange(w) - cx) / radius
    xx, yy = np.meshgrid(xs, ys)
    inside = np.abs(xx) ** n + np.abs(yy) ** n <= 1.0
    out = np.empty_like(arr)
    out[:] = CHARCOAL
    out[inside] = arr[inside]
    result = Image.fromarray(out, mode="RGB")
    dest.parent.mkdir(parents=True, exist_ok=True)
    result.save(dest, format="PNG")
    return result


def mesh_geometry(cx: float = 256.0, cy: float = 256.0, r: float = 210.0):
    """Circular node mesh with a capital-M skeleton through the center."""
    nodes: list[tuple[float, float]] = []

    def add(x: float, y: float) -> int:
        for i, (nx, ny) in enumerate(nodes):
            if (nx - x) ** 2 + (ny - y) ** 2 < 16:
                return i
        nodes.append((x, y))
        return len(nodes) - 1

    # Concentric rings
    add(cx, cy)
    for ring, count in ((0.28, 8), (0.50, 12), (0.72, 16), (0.92, 20), (1.0, 16)):
        for i in range(count):
            a = (2 * math.pi * i / count) - math.pi / 2
            add(cx + r * ring * math.cos(a), cy + r * ring * math.sin(a))

    # M skeleton (normalized -1..1 inside the mesh circle)
    m = [
        (-0.58, 0.62),
        (-0.58, 0.20),
        (-0.58, -0.22),
        (-0.58, -0.62),
        (-0.32, -0.18),
        (0.00, 0.22),
        (0.32, -0.18),
        (0.58, -0.62),
        (0.58, -0.22),
        (0.58, 0.20),
        (0.58, 0.62),
        (-0.38, 0.62),
        (0.38, 0.62),
        (-0.20, -0.62),
        (0.20, -0.62),
    ]
    m_idx = [add(cx + r * x, cy + r * y) for x, y in m]
    m_edges = [
        (0, 1),
        (1, 2),
        (2, 3),
        (3, 4),
        (4, 5),
        (5, 6),
        (6, 7),
        (7, 8),
        (8, 9),
        (9, 10),
        (0, 11),
        (10, 12),
        (3, 13),
        (7, 14),
        (13, 14),
    ]

    edges: set[tuple[int, int]] = set()

    def connect(i: int, j: int) -> None:
        if i == j:
            return
        edges.add((i, j) if i < j else (j, i))

    for a, b in m_edges:
        connect(m_idx[a], m_idx[b])

    # Connect each node to its nearest neighbors
    for i, (x, y) in enumerate(nodes):
        dist = sorted(
            (
                (math.hypot(x - nx, y - ny), j)
                for j, (nx, ny) in enumerate(nodes)
                if j != i
            )
        )
        for _, j in dist[:3]:
            connect(i, j)

    return nodes, sorted(edges), set(m_idx)


def write_mesh_svg(path: Path, *, branded: bool, aria: str) -> None:
    nodes, edges, m_idx = mesh_geometry()
    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img"',
        f'  aria-label="{aria}">',
    ]
    if branded:
        lines.append('  <rect width="512" height="512" fill="#2d2c31"/>')
        stroke = "url(#mesh-grad)"
        node_fill = "url(#mesh-grad)"
        lines.append("  <defs>")
        lines.append(
            '    <linearGradient id="mesh-grad" x1="18%" y1="88%" x2="86%" y2="10%">'
        )
        lines.append('      <stop offset="0%" stop-color="#c878e8"/>')
        lines.append('      <stop offset="55%" stop-color="#7ec8f8"/>')
        lines.append('      <stop offset="100%" stop-color="#8ef0ff"/>')
        lines.append("    </linearGradient>")
        lines.append("  </defs>")
    else:
        stroke = "currentColor"
        node_fill = "currentColor"

    lines.append(
        f'  <g fill="none" stroke="{stroke}" stroke-linecap="round" stroke-linejoin="round">'
    )
    for i, j in edges:
        x1, y1 = nodes[i]
        x2, y2 = nodes[j]
        weight = 2.6 if i in m_idx and j in m_idx else 1.35
        lines.append(
            f'    <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke-width="{weight}"/>'
        )
    lines.append("  </g>")
    for i, (x, y) in enumerate(nodes):
        rad = 5.4 if i in m_idx else 3.4
        lines.append(
            f'  <circle cx="{x:.1f}" cy="{y:.1f}" r="{rad}" fill="{node_fill}"/>'
        )
    lines.append("</svg>\n")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(line + "\n" for line in lines), encoding="utf-8")


def write_admin_favicon(path: Path) -> None:
    nodes, edges, m_idx = mesh_geometry(cx=233.0, cy=154.5, r=140.0)
    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466 309">',
        "  <style>",
        "    .mark { fill: #231e1e; stroke: #231e1e; }",
        "    @media (prefers-color-scheme: dark) {",
        "      .mark { fill: #d7d72e; stroke: #d7d72e; }",
        "    }",
        "  </style>",
        '  <g class="mark" fill="none" stroke-linecap="round" stroke-linejoin="round">',
    ]
    for i, j in edges:
        x1, y1 = nodes[i]
        x2, y2 = nodes[j]
        weight = 2.4 if i in m_idx and j in m_idx else 1.2
        lines.append(
            f'    <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke-width="{weight}"/>'
        )
    lines.append("  </g>")
    lines.append('  <g class="mark">')
    for i, (x, y) in enumerate(nodes):
        rad = 4.6 if i in m_idx else 2.8
        lines.append(f'    <circle cx="{x:.1f}" cy="{y:.1f}" r="{rad}"/>')
    lines.append("  </g>")
    lines.append("</svg>\n")
    path.write_text("\n".join(lines), encoding="utf-8")


def write_mark_tsx(path: Path) -> None:
    nodes, edges, m_idx = mesh_geometry()
    line_els = []
    for i, j in edges:
        x1, y1 = nodes[i]
        x2, y2 = nodes[j]
        weight = 2.6 if i in m_idx and j in m_idx else 1.35
        line_els.append(
            f'        <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'strokeWidth="{weight}" />'
        )
    circle_els = []
    for i, (x, y) in enumerate(nodes):
        rad = 5.4 if i in m_idx else 3.4
        circle_els.append(
            f'        <circle cx="{x:.1f}" cy="{y:.1f}" r="{rad}" fill="currentColor" />'
        )
    body = f'''import {{ useId }} from "react";

/**
 * Superhuman Mesh mark — a circular node network with an "M" through the
 * center, rendered in `currentColor` so it tints per-theme.
 */
export function BuzzMark({{ className }}: {{ className?: string }}) {{
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  void uid;

  return (
    <svg
      aria-hidden="true"
      className={{["buzz-mark", className].filter(Boolean).join(" ")}}
      viewBox="0 0 512 512"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
{chr(10).join(line_els)}
      </g>
{chr(10).join(circle_els)}
    </svg>
  );
}}
'''
    path.write_text(body, encoding="utf-8")


def write_mesh_path_rs_snippet(path: Path) -> None:
    nodes, edges, _m_idx = mesh_geometry()
    path.write_text(
        "NODES = "
        + repr([(round(x, 2), round(y, 2)) for x, y in nodes])
        + "\nEDGES = "
        + repr(edges)
        + "\n",
        encoding="utf-8",
    )


def resize_icon(src: Image.Image, size: int, dest: Path) -> None:
    out = src.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    out.save(dest, format="PNG")


def splash(src: Image.Image, size: int, dest: Path) -> None:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    mark = src.resize((int(size * 0.58), int(size * 0.58)), Image.Resampling.LANCZOS)
    if mark.mode != "RGBA":
        mark = mark.convert("RGBA")
    x = (size - mark.width) // 2
    y = (size - mark.height) // 2
    canvas.paste(mark, (x, y), mark)
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, format="PNG")


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        p = Path(candidate)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size=size, index=0)
            except OSError:
                continue
    return ImageFont.load_default()


def dmg_background(master: Image.Image, dest: Path) -> None:
    w, h = 1320, 1000
    img = Image.new("RGB", (w, h), "#d7d72e")
    draw = ImageDraw.Draw(img)
    top = (215, 215, 46)
    bottom = (215, 231, 246)
    for y in range(h):
        t = y / (h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    title_font = load_font(72, bold=True)
    tag_font = load_font(28, bold=False)
    title = "Superhuman Mesh"
    tag = "Your people, your agents, your project — all in one place."
    tw = draw.textbbox((0, 0), title, font=title_font)
    title_w = tw[2] - tw[0]
    draw.text(((w - title_w) / 2, 70), title, font=title_font, fill=(20, 18, 18))
    tb = draw.textbbox((0, 0), tag, font=tag_font)
    tag_w = tb[2] - tb[0]
    draw.text(((w - tag_w) / 2, 160), tag, font=tag_font, fill=(35, 30, 30))

    card_w, card_h = 560, 360
    card_x, card_y = (w - card_w) // 2, 280
    card = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card)
    card_draw.rounded_rectangle(
        (card_x, card_y, card_x + card_w, card_y + card_h),
        radius=36,
        fill=(255, 255, 255, 255),
    )
    img = Image.alpha_composite(img.convert("RGBA"), card)

    mark = master.resize((240, 240), Image.Resampling.LANCZOS).convert("RGBA")
    mx = (w - mark.width) // 2
    my = card_y + (card_h - mark.height) // 2
    img.paste(mark, (mx, my), mark)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGBA").save(dest, format="PNG")


def main() -> None:
    master_path = ROOT / "desktop/src-tauri/icons/mesh-source.png"
    master = full_bleed_master(SRC_ICON, master_path)
    master.save(ROOT / "desktop/src-tauri/icons/buzz-source.png", format="PNG")

    write_mesh_svg(ROOT / "desktop/public/buzz.svg", branded=True, aria="Superhuman Mesh")
    write_mesh_svg(ROOT / "web/public/favicon.svg", branded=True, aria="Superhuman Mesh")
    write_admin_favicon(ROOT / "admin-web/public/favicon.svg")
    write_mark_tsx(ROOT / "desktop/src/shared/ui/buzz-logo/BuzzMark.tsx")
    write_mesh_path_rs_snippet(ROOT / "desktop/src-tauri/icons/mesh-geometry.txt")

    resize_icon(master, 112, ROOT / "desktop/public/app-icon@2x.png")
    resize_icon(master, 168, ROOT / "desktop/public/app-icon@3x.png")
    resize_icon(master, 168, ROOT / "web/src/assets/app-icon@3x.png")

    marketing = Image.open(SRC_ICON).convert("RGBA")
    marketing.save(ROOT / "desktop/public/landing/mesh-icon.png", format="PNG")

    for size, dest in (
        (168, ROOT / "mobile/ios/Runner/Assets.xcassets/LaunchImage.imageset/LaunchImage.png"),
        (336, ROOT / "mobile/ios/Runner/Assets.xcassets/LaunchImage.imageset/LaunchImage@2x.png"),
        (504, ROOT / "mobile/ios/Runner/Assets.xcassets/LaunchImage.imageset/LaunchImage@3x.png"),
        (288, ROOT / "mobile/android/app/src/main/res/mipmap-mdpi/launch_image.png"),
        (432, ROOT / "mobile/android/app/src/main/res/mipmap-hdpi/launch_image.png"),
        (576, ROOT / "mobile/android/app/src/main/res/mipmap-xhdpi/launch_image.png"),
        (864, ROOT / "mobile/android/app/src/main/res/mipmap-xxhdpi/launch_image.png"),
        (1152, ROOT / "mobile/android/app/src/main/res/mipmap-xxxhdpi/launch_image.png"),
    ):
        splash(master, size, dest)

    dmg_background(master, ROOT / "desktop/src-tauri/icons/dmg-background.png")
    print(f"wrote master {master_path} {master.size}")


if __name__ == "__main__":
    main()
