#!/usr/bin/env python3
"""Generate the Ivanhoe Primary School fundraiser prize sheet and QR code."""

from __future__ import annotations

import shutil
from pathlib import Path

import qrcode
from qrcode.constants import ERROR_CORRECT_H
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PDF = ROOT / "output/pdf/ivanhoe-primary-school-fundraiser-prizes.pdf"
SITE_PDF = ROOT / "src/assets/ivanhoe-primary-school-fundraiser-prizes.pdf"
QR_PNG = ROOT / "tmp/pdfs/ivanhoe-primary-school-fundraiser-qr.png"

LANDING_PAGE_URL = "https://nakedtech.au/ivanhoe-primary-school-fundraiser/"
QR_TARGET = (
    f"{LANDING_PAGE_URL}?utm_source=ivanhoe_primary_school"
    "&utm_medium=qr&utm_campaign=community_fundraiser_2026"
)

SLATE = HexColor("#2D3035")
PEACH = HexColor("#FF8C69")
PEACH_INK = HexColor("#B84424")
BONE = HexColor("#F7F4EF")
SURFACE = HexColor("#FFFFFF")
MUTED = HexColor("#606369")
LINE = HexColor("#DCD8D1")


def draw_logo(pdf: canvas.Canvas, x: float, y: float, scale: float = 0.42) -> None:
    pdf.setFillColor(white)
    pdf.rect(x + 15 * scale, y + 10 * scale, 25 * scale, 80 * scale, fill=1, stroke=0)
    path = pdf.beginPath()
    path.moveTo(x + 40 * scale, y + 10 * scale)
    path.lineTo(x + 65 * scale, y + 90 * scale)
    path.lineTo(x + 90 * scale, y + 90 * scale)
    path.lineTo(x + 90 * scale, y + 10 * scale)
    path.lineTo(x + 65 * scale, y + 10 * scale)
    path.lineTo(x + 65 * scale, y + 90 * scale)
    pdf.setStrokeColor(PEACH)
    pdf.setLineWidth(3 * scale)
    pdf.drawPath(path, stroke=1, fill=0)


def draw_wrapped_text(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font_name: str,
    font_size: float,
    leading: float,
    color=SLATE,
) -> float:
    lines = wrap_text_lines(pdf, text, max_width, font_name, font_size)

    pdf.setFillColor(color)
    pdf.setFont(font_name, font_size)
    for line in lines:
        pdf.drawString(x, y, line)
        y -= leading
    return y


def wrap_text_lines(
    pdf: canvas.Canvas,
    text: str,
    max_width: float,
    font_name: str,
    font_size: float,
) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if pdf.stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_service_card(
    pdf: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    height: float,
    prize_label: str,
    value: str,
    services: tuple[str, ...],
    accent_header: bool = False,
) -> None:
    pdf.setFillColor(SURFACE)
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.8)
    pdf.roundRect(x, y, width, height, 14, fill=1, stroke=1)

    header_height = 72
    pdf.setFillColor(PEACH if accent_header else SLATE)
    pdf.roundRect(x, y + height - header_height, width, header_height, 14, fill=1, stroke=0)
    pdf.rect(x, y + height - header_height, width, 14, fill=1, stroke=0)

    header_ink = SLATE if accent_header else white
    pdf.setFillColor(header_ink)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(x + 18, y + height - 24, prize_label.upper())
    pdf.setFont("Helvetica-Bold", 25)
    pdf.drawString(x + 18, y + height - 53, value)
    pdf.setFont("Helvetica-Bold", 8.4)
    pdf.drawString(x + 90, y + height - 50, "INCL. GST")

    item_baseline = y + height - header_height - 27
    item_font_size = 10.2
    item_leading = 12.6
    item_gap = 9.5
    for index, service in enumerate(services, start=1):
        lines = wrap_text_lines(
            pdf,
            service,
            width - 58,
            "Helvetica-Bold",
            item_font_size,
        )
        marker_center_y = item_baseline + 3.2
        pdf.setFillColor(PEACH)
        pdf.circle(x + 22, marker_center_y, 8.5, fill=1, stroke=0)
        pdf.setFillColor(SLATE)
        pdf.setFont("Helvetica-Bold", 8.2)
        pdf.drawCentredString(x + 22, item_baseline + 0.5, str(index))
        pdf.setFont("Helvetica-Bold", item_font_size)
        for line_index, line in enumerate(lines):
            pdf.drawString(x + 39, item_baseline - line_index * item_leading, line)
        item_baseline -= len(lines) * item_leading + item_gap


def generate_qr() -> None:
    QR_PNG.parent.mkdir(parents=True, exist_ok=True)
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=12,
        border=4,
    )
    qr.add_data(QR_TARGET)
    qr.make(fit=True)
    image = qr.make_image(fill_color="#2D3035", back_color="white")
    image.save(QR_PNG)


def generate_pdf() -> None:
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    SITE_PDF.parent.mkdir(parents=True, exist_ok=True)
    generate_qr()

    page_width, page_height = A4
    pdf = canvas.Canvas(str(OUTPUT_PDF), pagesize=A4, pageCompression=1)
    pdf.setTitle("Ivanhoe Primary School Fundraiser - Naked Tech Prizes")
    pdf.setAuthor("Naked Tech")
    pdf.setSubject("Two local in-home technology service prizes donated by Naked Tech")

    pdf.setFillColor(BONE)
    pdf.rect(0, 0, page_width, page_height, fill=1, stroke=0)

    header_height = 184
    pdf.setFillColor(SLATE)
    pdf.rect(0, page_height - header_height, page_width, header_height, fill=1, stroke=0)
    pdf.setStrokeColor(PEACH)
    pdf.setLineWidth(28)
    pdf.circle(page_width + 28, page_height + 8, 128, fill=0, stroke=1)
    pdf.setStrokeColor(HexColor("#484B50"))
    pdf.setLineWidth(22)
    pdf.circle(110, page_height - header_height - 70, 92, fill=0, stroke=1)

    draw_logo(pdf, 36, page_height - 81, 0.45)
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 15)
    pdf.drawString(88, page_height - 58, "NAKED TECH")

    pdf.setFillColor(PEACH)
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(36, page_height - 103, "IVANHOE PRIMARY SCHOOL FUNDRAISER")
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 26)
    pdf.drawString(36, page_height - 139, "Two local technology prizes")
    pdf.setFillColor(HexColor("#D9D6D0"))
    pdf.setFont("Helvetica", 11)
    pdf.drawString(37, page_height - 162, "Eight practical ways for a local household to get unstuck.")

    pdf.setFillColor(PEACH)
    pdf.roundRect(page_width - 166, page_height - 143, 126, 64, 12, fill=1, stroke=0)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 8.4)
    pdf.drawCentredString(page_width - 103, page_height - 101, "COMBINED CURRENT VALUE")
    pdf.setFont("Helvetica-Bold", 25)
    pdf.drawCentredString(page_width - 103, page_height - 128, "$440")
    pdf.setFont("Helvetica-Bold", 8.2)
    pdf.drawCentredString(page_width - 103, page_height - 139, "INCL. GST")

    card_y = 386
    card_height = 225
    card_width = 248
    draw_service_card(
        pdf,
        36,
        card_y,
        card_width,
        card_height,
        "Prize one - choose one",
        "$190",
        (
            "Wi-Fi Dropout Diagnosis",
            "Slow Computer Performance Assessment",
            "Printer Troubleshooting Visit",
            "Personal Email Troubleshooting Visit",
        ),
    )
    draw_service_card(
        pdf,
        311,
        card_y,
        card_width,
        card_height,
        "Prize two - choose one",
        "$250",
        (
            "Scam & Account-Security Assessment",
            "Virus & Malware Diagnosis and Removal Visit",
            "New Printer Setup Visit",
            "Computer Backup Setup Visit",
        ),
        accent_header=True,
    )

    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(36, 350, "Good to know")
    good_to_know = (
        "For one home in Ivanhoe or Eaglemont; local call-out included.",
        "Appointments are normally Monday to Friday, 9am-5pm.",
        "Transferable before booking; not redeemable for cash or combinable.",
        "Published service scope applies; hardware and third-party charges are excluded.",
        "Assessment and troubleshooting do not guarantee repair or complete resolution.",
    )
    bullet_baseline = 327
    bullet_font_size = 9.6
    bullet_leading = 12.2
    for item in good_to_know:
        lines = wrap_text_lines(pdf, item, 330, "Helvetica", bullet_font_size)
        pdf.setFillColor(PEACH)
        pdf.circle(42, bullet_baseline + 3, 3, fill=1, stroke=0)
        pdf.setFillColor(MUTED)
        pdf.setFont("Helvetica", bullet_font_size)
        for line_index, line in enumerate(lines):
            pdf.drawString(54, bullet_baseline - line_index * bullet_leading, line)
        bullet_baseline -= len(lines) * bullet_leading + 4.5

    qr_size = 126
    qr_x = page_width - qr_size - 40
    qr_y = 152
    pdf.setFillColor(SURFACE)
    pdf.roundRect(qr_x - 10, qr_y - 10, qr_size + 20, qr_size + 20, 12, fill=1, stroke=0)
    pdf.drawImage(str(QR_PNG), qr_x, qr_y, qr_size, qr_size, preserveAspectRatio=True, mask="auto")
    pdf.linkURL(QR_TARGET, (qr_x, qr_y, qr_x + qr_size, qr_y + qr_size), relative=0)
    pdf.setFillColor(PEACH_INK)
    pdf.setFont("Helvetica-Bold", 9.5)
    pdf.drawCentredString(qr_x + qr_size / 2, qr_y - 25, "SCAN TO COMPARE THE PRIZES")

    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.8)
    pdf.line(36, 115, page_width - 36, 115)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 10.5)
    pdf.drawString(36, 93, "nakedtech.au/ivanhoe-primary-school-fundraiser/")
    pdf.linkURL(LANDING_PAGE_URL, (36, 84, 330, 103), relative=0)
    pdf.setFillColor(MUTED)
    pdf.setFont("Helvetica", 8.5)
    footer = (
        "Two separate prizes. Each winner receives a uniquely numbered voucher with issue date, expiry date "
        "and full conditions. Virus and malware removal is undertaken only where safe and practical within scope."
    )
    draw_wrapped_text(pdf, footer, 36, 73, page_width - 72, "Helvetica", 8.5, 10.5, MUTED)
    pdf.setFont("Helvetica", 8.5)
    pdf.drawString(36, 29, "Naked Tech - Peter Reginald - ABN 57 221 340 918 - 03 7068 5422")
    pdf.drawRightString(page_width - 36, 29, "Local in-home technology help for Ivanhoe & Eaglemont")

    pdf.showPage()
    pdf.save()
    shutil.copyfile(OUTPUT_PDF, SITE_PDF)


if __name__ == "__main__":
    generate_pdf()
    print(OUTPUT_PDF)
    print(SITE_PDF)
    print(QR_TARGET)
