import fs from "fs";
import genTicketPdf from "./puppeteer";

const pdfBuffer = await genTicketPdf({
  movieTitle: "Interstellar",
  theatre: {
    title: "PVR Cinemas — Select Citywalk",
    address: "A-3, Saket District Centre",
    city: "New Delhi",
    country: "India",
  },
  showTime: { start: "2026-07-12T19:30:00", end: "2026-07-12T22:15:00" },
  seat: { row: "F", col: 12 },
  price: 450,
  // Optional: embed a font that has the ₹ glyph, e.g. Noto Sans
  // fontPath: "./fonts/NotoSans-Regular.ttf",
  // fontBoldPath: "./fonts/NotoSans-Bold.ttf",
});

fs.writeFileSync("ticket.pdf", pdfBuffer);

export * from "./puppeteer"
export * from "./resend"