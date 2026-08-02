#!/usr/bin/env python3
"""Build the Meta Test 01 image exports.

The generated photographs are retained under the campaign asset directory. This
script applies deterministic crops, colour treatment, branding and typography so
Meta never has to auto-crop the creative.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "docs" / "marketing" / "assets" / "meta-test-01"
SOURCE_DIR = ASSET_DIR / "sources"
MARK_PATH = ROOT / "src" / "img" / "nakedtech-mark.png"

SLATE = (45, 48, 53)
PEACH = (255, 140, 105)
BONE = (248, 245, 237)
WHITE = (255, 255, 255)
REGULAR_FONT = Path("/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf")
BOLD_FONT = Path("/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf")


@dataclass(frozen=True)
class ExportSpec:
    source: Path
    crop: tuple[int, int, int, int]
    size: tuple[int, int]
    output: Path
    title: str
    support: str
    offer: str


SPECS = (
    ExportSpec(
        source=SOURCE_DIR / "wifi-dropouts-source.png",
        crop=(1, 1, 1121, 1401),
        size=(1080, 1350),
        output=ASSET_DIR / "meta-test-01-wifi-dropouts-v1-4x5.webp",
        title="WI-FI KEEPS\nDROPPING OUT?",
        support="Find the cause before\nbuying more hardware.",
        offer="$190 FIXED DIAGNOSIS",
    ),
    ExportSpec(
        source=SOURCE_DIR / "wifi-dropouts-source.png",
        crop=(0, 140, 1122, 1262),
        size=(1080, 1080),
        output=ASSET_DIR / "meta-test-01-wifi-dropouts-v1-1x1.webp",
        title="WI-FI KEEPS\nDROPPING OUT?",
        support="Find the cause before\nbuying more hardware.",
        offer="$190 FIXED DIAGNOSIS",
    ),
    ExportSpec(
        source=SOURCE_DIR / "wifi-dropouts-source.png",
        crop=(165, 0, 954, 1402),
        size=(1080, 1920),
        output=ASSET_DIR / "meta-test-01-wifi-dropouts-v1-9x16.webp",
        title="WI-FI KEEPS\nDROPPING OUT?",
        support="Find the cause before\nbuying more hardware.",
        offer="$190 FIXED DIAGNOSIS",
    ),
    ExportSpec(
        source=SOURCE_DIR / "wifi-dropouts-source.png",
        crop=(0, 500, 1122, 1088),
        size=(1200, 628),
        output=ASSET_DIR / "meta-test-01-wifi-dropouts-v1-1.91x1.webp",
        title="WI-FI KEEPS\nDROPPING OUT?",
        support="Find the cause before\nbuying more hardware.",
        offer="$190 FIXED DIAGNOSIS",
    ),
    ExportSpec(
        source=SOURCE_DIR / "slow-computer-source-v3-hand-free-chatgpt.png",
        crop=(1, 1, 1121, 1401),
        size=(1080, 1350),
        output=ASSET_DIR / "meta-test-01-slow-computer-v3-4x5.webp",
        title="SLOW COMPUTER?",
        support="Clear diagnosis before you spend.",
        offer="$190 FIXED · 60–75 MIN ONSITE",
    ),
    ExportSpec(
        source=SOURCE_DIR / "slow-computer-source-v3-hand-free-chatgpt.png",
        crop=(0, 140, 1122, 1262),
        size=(1080, 1080),
        output=ASSET_DIR / "meta-test-01-slow-computer-v3-1x1.webp",
        title="SLOW COMPUTER?",
        support="Clear diagnosis before you spend.",
        offer="$190 FIXED · 60–75 MIN ONSITE",
    ),
    ExportSpec(
        source=SOURCE_DIR / "slow-computer-source-v3-hand-free-chatgpt.png",
        crop=(265, 0, 1054, 1402),
        size=(1080, 1920),
        output=ASSET_DIR / "meta-test-01-slow-computer-v3-9x16.webp",
        title="SLOW COMPUTER?",
        support="Clear diagnosis before you spend.",
        offer="$190 FIXED · 60–75 MIN ONSITE",
    ),
    ExportSpec(
        source=SOURCE_DIR / "slow-computer-source-v3-hand-free-chatgpt.png",
        crop=(0, 562, 1122, 1150),
        size=(1200, 628),
        output=ASSET_DIR / "meta-test-01-slow-computer-v3-1.91x1.webp",
        title="SLOW\nCOMPUTER?",
        support="Clear diagnosis before you spend.",
        offer="$190 FIXED · 60–75 MIN ONSITE",
    ),
)


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def tracked_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, tracking: int) -> int:
    if not text:
        return 0
    return sum(draw.textlength(char, font=face) for char in text) + tracking * (len(text) - 1)


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    position: tuple[int, int],
    text: str,
    face: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: int,
) -> None:
    x, y = position
    for char in text:
        draw.text((x, y), char, font=face, fill=fill)
        x += int(draw.textlength(char, font=face)) + tracking


def wrap_text(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textlength(candidate, font=face) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def add_top_gradient(image: Image.Image, end_y: int) -> Image.Image:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    pixels = overlay.load()
    width, height = image.size
    for y in range(min(end_y, height)):
        progress = y / max(1, end_y - 1)
        alpha = int(232 * (1 - progress) ** 1.45)
        for x in range(width):
            pixels[x, y] = (*SLATE, alpha)
    return Image.alpha_composite(image.convert("RGBA"), overlay)


def prepare_mark(height: int) -> Image.Image:
    with Image.open(MARK_PATH) as raw:
        mark = raw.convert("RGBA")
        bbox = mark.getchannel("A").getbbox()
        if bbox is None:
            raise ValueError(f"No visible mark found in {MARK_PATH}")
        mark = mark.crop(bbox)
        pixels = mark.load()
        if pixels is None:
            raise ValueError(f"Could not access mark pixels in {MARK_PATH}")
        for y in range(mark.height):
            for x in range(mark.width):
                pixel = pixels[x, y]
                if not isinstance(pixel, tuple) or len(pixel) != 4:
                    raise ValueError(f"Unexpected mark pixel format in {MARK_PATH}")
                red, green, blue, alpha = map(int, pixel)
                if alpha == 0:
                    continue
                peach_distance = abs(red - PEACH[0]) + abs(green - PEACH[1]) + abs(blue - PEACH[2])
                colour = PEACH if peach_distance < 180 else BONE
                pixels[x, y] = (*colour, alpha)
        width = round(mark.width * height / mark.height)
        return mark.resize((width, height), Image.Resampling.LANCZOS)


def render(spec: ExportSpec) -> None:
    horizontal = spec.size == (1200, 628)
    wifi = spec.output.name.startswith("meta-test-01-wifi-dropouts-")
    with Image.open(spec.source) as source:
        cropped = source.convert("RGB").crop(spec.crop)
        image = cropped.resize(spec.size, Image.Resampling.LANCZOS)

    image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=78, threshold=3))
    square = spec.size[0] == spec.size[1]
    vertical = spec.size == (1080, 1920)
    if horizontal:
        image = image.convert("RGBA")
    else:
        image = add_top_gradient(image, 560 if square else 920 if vertical else 690)
    draw = ImageDraw.Draw(image)

    if square:
        margin = 58
        brand_y = 48
        mark_height = 42
        brand_size = 29
        title_y = 122
        title_size = 60
        title_spacing = 62
        support_size = 31
        support_spacing = 39
        content_width = 920
        accent_width = 6
        offer_size = 22
        offer_height = 52
        offer_pad_x = 24
    elif vertical:
        margin = 68
        brand_y = 250 if wifi else 260
        mark_height = 52 if wifi else 46
        brand_size = 36 if wifi else 31
        title_y = 345
        title_size = 74 if wifi else 64
        title_spacing = 80 if wifi else 70
        support_size = 40 if wifi else 34
        support_spacing = 49 if wifi else 43
        content_width = 900
        accent_width = 7
        offer_size = 30 if wifi else 24
        offer_height = 68 if wifi else 58
        offer_pad_x = 32 if wifi else 27
    elif horizontal:
        margin = 56
        brand_y = 38 if wifi else 45
        mark_height = 42 if wifi else 36
        brand_size = 30 if wifi else 25
        title_y = 96 if wifi else 104
        title_size = 54 if wifi else 40
        title_spacing = 55 if wifi else 42
        support_size = 30 if wifi else 23
        support_spacing = 34 if wifi else 29
        content_width = 430 if wifi else 270
        accent_width = 6
        offer_size = 18 if wifi else 14
        offer_height = 48 if wifi else 40
        offer_pad_x = 18 if wifi else 12
    else:
        margin = 68
        brand_y = 150
        mark_height = 50
        brand_size = 33
        title_y = 235
        title_size = 74
        title_spacing = 78
        support_size = 36
        support_spacing = 46
        content_width = 920
        accent_width = 7
        offer_size = 25
        offer_height = 58
        offer_pad_x = 28

    mark = prepare_mark(mark_height)
    image.alpha_composite(mark, (margin, brand_y))
    brand_face = font(BOLD_FONT, brand_size)
    brand_x = margin + mark.width + 18
    brand_text_y = brand_y + max(0, (mark_height - brand_size) // 2 - 3)
    draw_tracked(draw, (brand_x, brand_text_y), "NAKED TECH", brand_face, BONE, tracking=3)

    title_face = font(BOLD_FONT, title_size)
    title_lines = spec.title.split("\n")
    title_x = margin + 22
    title_height = title_spacing * len(title_lines)
    draw.rounded_rectangle(
        (margin, title_y + 8, margin + accent_width, title_y + title_height - 10),
        radius=accent_width // 2,
        fill=PEACH,
    )
    for index, line in enumerate(title_lines):
        draw.text((title_x, title_y + index * title_spacing), line, font=title_face, fill=WHITE)

    support_face = font(BOLD_FONT, support_size)
    support_y = title_y + title_height + (8 if square else 10)
    support_lines = [
        line
        for paragraph in spec.support.split("\n")
        for line in wrap_text(draw, paragraph, support_face, content_width - 22)
    ]
    for index, line in enumerate(support_lines):
        draw.text((title_x, support_y + index * support_spacing), line, font=support_face, fill=WHITE)

    offer_face = font(BOLD_FONT, offer_size)
    offer_gap = 14 if horizontal and wifi else 18 if square else 22
    offer_y = support_y + len(support_lines) * support_spacing + offer_gap
    offer_width = int(draw.textlength(spec.offer, font=offer_face)) + 2 * offer_pad_x
    draw.rounded_rectangle(
        (title_x, offer_y, title_x + offer_width, offer_y + offer_height),
        radius=offer_height // 2,
        fill=PEACH,
    )
    offer_bbox = draw.textbbox((0, 0), spec.offer, font=offer_face)
    offer_text_height = offer_bbox[3] - offer_bbox[1]
    offer_text_y = offer_y + (offer_height - offer_text_height) // 2 - offer_bbox[1]
    draw.text((title_x + offer_pad_x, offer_text_y), spec.offer, font=offer_face, fill=SLATE)

    spec.output.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(spec.output, "WEBP", quality=92, method=6)
    print(f"created {spec.output.relative_to(ROOT)} ({spec.size[0]}×{spec.size[1]})")


def main() -> None:
    for spec in SPECS:
        render(spec)


if __name__ == "__main__":
    main()
