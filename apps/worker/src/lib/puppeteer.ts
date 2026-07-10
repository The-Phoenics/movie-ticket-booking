import PDFDocument from "pdfkit";

export interface TicketData {
  movieTitle: string;
  theatre?: {
    title: string;
    address: string;
    city: string;
    country: string;
  };
  showTime?: {
    start: string | Date;
    end: string | Date;
  };
  seat: {
    row: string | number;
    col: string | number;
  };
  price: number;
  /** Symbol/prefix to use for money. Defaults to "Rs." unless a Unicode font is supplied. */
  currency?: string;
  /** Path to a .ttf/.otf font file that contains the ₹ glyph (regular weight) */
  fontPath?: string;
  /** Path to the bold weight of the same font family */
  fontBoldPath?: string;
}

// ---- design tokens (lifted from the Tailwind classes in the React card) ----
const COLORS = {
  pageBg: "#000000",
  cardBg: "#18181b", // zinc-900
  cardBorder: "#27272a", // zinc-800
  divider: "#3f3f46", // zinc-700
  notch: "#000000", // punches show page bg through the card
  textPrimary: "#f4f4f5", // zinc-100
  textMuted: "#71717a", // zinc-500
  textFaint: "#52525b", // zinc-600
  red600: "#dc2626",
  red500: "#ef4444",
  red400: "#f87171",
  orange400: "#fb923c",
  buttonDisabled: "#3f3f46",
};

function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ---------------------------------------------------------------------------
// Small vector icon helpers (hand-drawn approximations of the lucide icons
// used in the React card, since PDFKit can't import SVG icon components).
// Each draws inside a size x size box with its top-left corner at (x, y).
// ---------------------------------------------------------------------------

function iconPin(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  const cx = x + size / 2;
  const r = size * 0.32;
  const cyTop = y + r;
  doc.save();
  doc.circle(cx, cyTop, r).fill(color);
  doc
    .moveTo(cx - r * 0.8, cyTop + r * 0.5)
    .lineTo(cx, y + size)
    .lineTo(cx + r * 0.8, cyTop + r * 0.5)
    .fill(color);
  doc.circle(cx, cyTop, r * 0.4).fill(COLORS.cardBg);
  doc.restore();
}

function iconCalendar(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  doc.save();
  doc
    .lineWidth(size * 0.09)
    .roundedRect(x, y + size * 0.15, size, size * 0.8, size * 0.12)
    .stroke(color);
  doc
    .moveTo(x, y + size * 0.42)
    .lineTo(x + size, y + size * 0.42)
    .lineWidth(size * 0.09)
    .stroke(color);
  doc
    .moveTo(x + size * 0.25, y)
    .lineTo(x + size * 0.25, y + size * 0.28)
    .lineWidth(size * 0.12)
    .stroke(color);
  doc
    .moveTo(x + size * 0.75, y)
    .lineTo(x + size * 0.75, y + size * 0.28)
    .lineWidth(size * 0.12)
    .stroke(color);
  doc.restore();
}

function iconClock(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size / 2 - size * 0.06;
  doc.save();
  doc
    .lineWidth(size * 0.09)
    .circle(cx, cy, r)
    .stroke(color);
  doc
    .moveTo(cx, cy)
    .lineTo(cx, cy - r * 0.55)
    .lineWidth(size * 0.09)
    .stroke(color);
  doc
    .moveTo(cx, cy)
    .lineTo(cx + r * 0.4, cy + r * 0.15)
    .lineWidth(size * 0.09)
    .stroke(color);
  doc.restore();
}

function iconSeat(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  // simplified armchair silhouette
  doc.save();
  doc.lineWidth(size * 0.09);
  doc.roundedRect(x + size * 0.15, y, size * 0.7, size * 0.55, size * 0.08).stroke(color);
  doc
    .moveTo(x + size * 0.2, y + size * 0.5)
    .lineTo(x + size * 0.2, y + size * 0.9)
    .stroke(color);
  doc
    .moveTo(x + size * 0.8, y + size * 0.5)
    .lineTo(x + size * 0.8, y + size * 0.9)
    .stroke(color);
  doc
    .moveTo(x + size * 0.15, y + size * 0.75)
    .lineTo(x + size * 0.85, y + size * 0.75)
    .stroke(color);
  doc.restore();
}

function iconTag(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  doc.save();
  doc
    .moveTo(x + size * 0.1, y + size * 0.1)
    .lineTo(x + size * 0.6, y + size * 0.1)
    .lineTo(x + size * 0.95, y + size * 0.45)
    .lineTo(x + size * 0.55, y + size * 0.85)
    .lineTo(x + size * 0.1, y + size * 0.4)
    .closePath()
    .lineWidth(size * 0.09)
    .stroke(color);
  doc.circle(x + size * 0.3, y + size * 0.3, size * 0.08).fill(color);
  doc.restore();
}

function iconTicket(doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) {
  doc.save();
  doc.roundedRect(x, y + size * 0.15, size, size * 0.7, size * 0.1).fill(color);
  doc.circle(x + size * 0.35, y + size * 0.5, size * 0.09).fill(COLORS.cardBg);
  doc.circle(x + size * 0.65, y + size * 0.5, size * 0.09).fill(COLORS.cardBg);
  doc.restore();
}

export default function genTicketPdf(data: TicketData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const usingUnicodeFont = !!data.fontPath;
    const currency = data.currency ?? (usingUnicodeFont ? "₹" : "Rs. ");

    const PAGE_W = 420;
    const PAGE_H = 640;
    const CARD_X = 30;
    const CARD_Y = 40;
    const CARD_W = PAGE_W - CARD_X * 2;

    const doc = new PDFDocument({ size: [PAGE_W, PAGE_H], margin: 0 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Register fonts (falls back to Helvetica family if none supplied)
    const REGULAR = "Body";
    const BOLD = "Heading";
    if (data.fontPath) {
      doc.registerFont(REGULAR, data.fontPath);
      doc.registerFont(BOLD, data.fontBoldPath ?? data.fontPath);
    } else {
      doc.registerFont(REGULAR, "Helvetica");
      doc.registerFont(BOLD, "Helvetica-Bold");
    }

    // ---- page background ----
    doc.rect(0, 0, PAGE_W, PAGE_H).fill(COLORS.pageBg);

    // ---- card shadow (subtle) ----
    doc.save();
    doc
      .roundedRect(CARD_X + 4, CARD_Y + 6, CARD_W, 500, 18)
      .fillOpacity(0.35)
      .fill("#000000");
    doc.restore();

    // ---- card body ----
    const CARD_H = 500;
    doc.roundedRect(CARD_X, CARD_Y, CARD_W, CARD_H, 18).fill(COLORS.cardBg);
    doc
      .roundedRect(CARD_X, CARD_Y, CARD_W, CARD_H, 18)
      .lineWidth(1)
      .strokeOpacity(1)
      .stroke(COLORS.cardBorder);

    // ---- top gradient accent bar ----
    const grad = doc.linearGradient(CARD_X, CARD_Y, CARD_X + CARD_W, CARD_Y);
    grad.stop(0, "#b91c1c").stop(0.5, COLORS.red500).stop(1, COLORS.orange400);
    doc.save();
    doc.roundedRect(CARD_X, CARD_Y, CARD_W, 18, 18).clip();
    doc.rect(CARD_X, CARD_Y, CARD_W, 4).fill(grad);
    doc.restore();

    // ---- header ----
    const headerY = CARD_Y + 24;
    const iconBoxSize = 40;
    const badgeCx = CARD_X + 24 + iconBoxSize / 2;
    const badgeCy = headerY + iconBoxSize / 2;
    doc
      .circle(badgeCx, badgeCy, iconBoxSize / 2)
      .fillOpacity(0.15)
      .fill(COLORS.red600);
    doc.fillOpacity(1);
    iconTicket(doc, badgeCx - 10, badgeCy - 10, 20, COLORS.red400);

    doc
      .fillOpacity(1)
      .fillColor(COLORS.textMuted)
      .font(BOLD)
      .fontSize(8)
      .text("BOOKING SUMMARY", CARD_X + 24 + iconBoxSize + 12, headerY + 6, {
        characterSpacing: 1,
      });
    doc
      .fillColor(COLORS.textPrimary)
      .font(BOLD)
      .fontSize(15)
      .text(data.movieTitle, CARD_X + 24 + iconBoxSize + 12, headerY + 18, {
        width: CARD_W - 24 * 2 - iconBoxSize - 12,
      });

    // ---- perforated dashed divider (ticket punch-hole look) ----
    function drawPerforation(y: number) {
      doc.save();
      doc.circle(CARD_X, y, 10).fill(COLORS.notch);
      doc.circle(CARD_X + CARD_W, y, 10).fill(COLORS.notch);
      doc.restore();
      doc
        .save()
        .dash(4, { space: 4 })
        .moveTo(CARD_X + 16, y)
        .lineTo(CARD_X + CARD_W - 16, y)
        .lineWidth(1)
        .stroke(COLORS.divider)
        .undash()
        .restore();
    }

    // header bottom divider (dashed perforation, like the React card)
    const headerBottomY = headerY + iconBoxSize + 16;
    drawPerforation(headerBottomY);

    // ---- details grid ----
    let cursorY = headerBottomY + 26;
    const colLeftX = CARD_X + 24;
    const colRightX = CARD_X + CARD_W / 2 + 8;
    const iconSize = 15;
    const labelGap = 22;

    function detailRow(
      x: number,
      y: number,
      icon: (doc: PDFKit.PDFDocument, x: number, y: number, size: number, color: string) => void,
      label: string,
      value: string,
      subValue?: string,
      width = CARD_W / 2 - 32,
    ) {
      icon(doc, x, y + 2, iconSize, COLORS.red400);
      doc
        .fillColor(COLORS.textMuted)
        .font(BOLD)
        .fontSize(7.5)
        .text(label.toUpperCase(), x + iconSize + 10, y, { characterSpacing: 0.5 });
      doc
        .fillColor(COLORS.textPrimary)
        .font(BOLD)
        .fontSize(10.5)
        .text(value, x + iconSize + 10, y + 12, { width: width - iconSize - 10 });
      if (subValue) {
        doc
          .fillColor(COLORS.textMuted)
          .font(REGULAR)
          .fontSize(8)
          .text(subValue, x + iconSize + 10, y + 26, { width: width - iconSize - 10 });
      }
    }

    if (data.theatre) {
      const rowHeight = 46;
      detailRow(
        colLeftX,
        cursorY,
        iconPin,
        "Theatre",
        data.theatre.title,
        `${data.theatre.address}, ${data.theatre.city}, ${data.theatre.country}`,
        CARD_W - 48,
      );
      cursorY += rowHeight + 14;
    }

    if (data.showTime) {
      detailRow(colLeftX, cursorY, iconCalendar, "Date", formatDate(data.showTime.start));
      detailRow(
        colRightX,
        cursorY,
        iconClock,
        "Show Time",
        `${formatTime(data.showTime.start)} - ${formatTime(data.showTime.end)}`,
      );
      cursorY += labelGap + 22;
    }

    detailRow(colLeftX, cursorY, iconSeat, "Seat", `Row ${data.seat.row} · Seat ${data.seat.col}`);
    detailRow(colRightX, cursorY, iconTag, "Price", `${currency}${data.price.toFixed(2)}`);
    cursorY += labelGap + 30;

    // ---- bottom perforation ----
    drawPerforation(cursorY);
    cursorY += 30;

    // ---- total row ----
    doc.fillColor(COLORS.textMuted).font(BOLD).fontSize(10).text("Total", colLeftX, cursorY);
    doc
      .fillColor(COLORS.textPrimary)
      .font(BOLD)
      .fontSize(20)
      .text(`${currency}${data.price.toFixed(2)}`, colLeftX, cursorY - 4, {
        width: CARD_W - 48,
        align: "right",
      });

    doc.end();
  });
}

/**
 * USAGE EXAMPLE
 *
 * import fs from "fs";
 * import genTicketPdf from "./genTicketPdf";
 *
 * const pdfBuffer = await genTicketPdf({
 *   movieTitle: "Interstellar",
 *   theatre: {
 *     title: "PVR Cinemas — Select Citywalk",
 *     address: "A-3, Saket District Centre",
 *     city: "New Delhi",
 *     country: "India",
 *   },
 *   showTime: { start: "2026-07-12T19:30:00", end: "2026-07-12T22:15:00" },
 *   seat: { row: "F", col: 12 },
 *   price: 450,
 *   // Optional: embed a font that has the ₹ glyph, e.g. Noto Sans
 *   // fontPath: "./fonts/NotoSans-Regular.ttf",
 *   // fontBoldPath: "./fonts/NotoSans-Bold.ttf",
 * });
 *
 * fs.writeFileSync("ticket.pdf", pdfBuffer);
 *
 * // Or send it straight from an Express route:
 * // res.setHeader("Content-Type", "application/pdf");
 * // res.send(pdfBuffer);
 */
