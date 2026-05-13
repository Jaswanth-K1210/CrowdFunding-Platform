import PDFDocument from "pdfkit";

export const generateInvoice = (donation, donor, campaign) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const pageWidth = 595.28;
    const contentWidth = pageWidth - 100; // margin 50 each side

    // ── Helper: draw a full-width horizontal rule ───────────────
    const drawHR = (y, color = "#E0E0E0") => {
      doc.moveTo(50, y).lineTo(pageWidth - 50, y).strokeColor(color).lineWidth(1).stroke();
    };

    // ══════════════════════════════════════════════════
    // HEADER BAND
    // ══════════════════════════════════════════════════
    doc.rect(0, 0, pageWidth, 90).fill("#10b981");

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor("#FFFFFF")
      .text("DONATION RECEIPT", 50, 25, { align: "center" });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#C5CAE9")
      .text("Official Payment Confirmation", { align: "center" });

    doc.moveDown(3.5);

    // ══════════════════════════════════════════════════
    // STATUS BADGE
    // ══════════════════════════════════════════════════
    const isSuccess = donation.paymentStatus === "completed";
    const badgeColor = isSuccess ? "#1B5E20" : "#B71C1C";
    const badgeBg = isSuccess ? "#E8F5E9" : "#FFEBEE";
    const statusText = isSuccess ? "PAYMENT SUCCESSFUL" : "PAYMENT FAILED";

    const badgeY = doc.y;
    doc.rect(50, badgeY, contentWidth, 32).fill(badgeBg);
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(badgeColor)
      .text(statusText, 50, badgeY + 10, { width: contentWidth, align: "center" });

    doc.moveDown(2.8);

    // ══════════════════════════════════════════════════
    // RECEIPT META  (two-column: left label, right value)
    // ══════════════════════════════════════════════════
    const metaStartY = doc.y;
    const labelX = 50;
    const valueX = 260;

    const metaRows = [
      ["Receipt Date", new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })],
      ["Receipt No.", `INV-${donation._id.toString().slice(-6).toUpperCase()}`],
      ["Payment Gateway", (donation.paymentGateway || "Razorpay").toUpperCase()],
      ["Mode of Payment", "Online (UPI / Card / Net Banking)"],
    ];

    metaRows.forEach(([label, value], i) => {
      const rowY = metaStartY + i * 20;
      doc.font("Helvetica").fontSize(10).fillColor("#888888").text(label, labelX, rowY);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#212121").text(value, valueX, rowY);
    });

    doc.y = metaStartY + metaRows.length * 20 + 10;
    drawHR(doc.y);
    doc.moveDown(1);

    // ══════════════════════════════════════════════════
    // TWO-COLUMN SECTION: Donor | Campaign
    // ══════════════════════════════════════════════════
    const col1X = 50;
    const col2X = 320;
    const sectionY = doc.y;

    // Column 1 — Donor Details
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#10b981").text("DONOR DETAILS", col1X, sectionY);
    doc.font("Helvetica").fontSize(10).fillColor("#444444");
    doc.text(`Name`, col1X, sectionY + 18).text(`Email`, col1X, sectionY + 34);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#212121");
    doc.text(donor.name, col1X + 50, sectionY + 18).text(donor.email, col1X + 50, sectionY + 34);

    // Column 2 — Campaign Details
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#10b981").text("CAMPAIGN DETAILS", col2X, sectionY);
    doc.font("Helvetica").fontSize(10).fillColor("#444444");
    doc.text(`Title`, col2X, sectionY + 18);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#212121");
    doc.text(campaign.title, col2X + 40, sectionY + 18, { width: 190 });

    doc.y = sectionY + 65;
    drawHR(doc.y);
    doc.moveDown(1);

    // ══════════════════════════════════════════════════
    // PAYMENT REFERENCE TABLE
    // ══════════════════════════════════════════════════
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#10b981").text("PAYMENT REFERENCE", 50);
    doc.moveDown(0.5);

    const tableStartY = doc.y;
    const tableRows = [
      ["Razorpay Payment ID", donation.paymentId || "N/A"],
      ["Razorpay Order ID", donation.orderId || "N/A"],
      ["Payment Status", isSuccess ? "Success" : "Failed"],
      ["Transaction Date", new Date(donation.createdAt).toLocaleString("en-IN", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      })],
    ];

    tableRows.forEach(([label, value], i) => {
      const rowY = tableStartY + i * 22;
      const rowBg = i % 2 === 0 ? "#F5F5F5" : "#FFFFFF";
      doc.rect(50, rowY, contentWidth, 22).fill(rowBg);
      doc.font("Helvetica").fontSize(10).fillColor("#666666").text(label, 60, rowY + 6);
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#212121").text(value, 280, rowY + 6, { width: 260 });
    });

    doc.y = tableStartY + tableRows.length * 22 + 12;
    drawHR(doc.y, "#1A237E");
    doc.moveDown(0.8);

    // ══════════════════════════════════════════════════
    // AMOUNT BOX
    // ══════════════════════════════════════════════════
    const amountBoxY = doc.y;
    doc.rect(50, amountBoxY, contentWidth, 42).fill("#10b981");
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#C5CAE9")
      .text("TOTAL AMOUNT DONATED", 50, amountBoxY + 8, { width: contentWidth, align: "right" });

    // shift right for the value
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#FFFFFF")
      .text(`Rs. ${donation.amount.toLocaleString("en-IN")}`, 50, amountBoxY + 14, {
        width: contentWidth - 10,
        align: "right",
      });

    doc.y = amountBoxY + 42 + 20;

    // ══════════════════════════════════════════════════
    // FOOTER
    // ══════════════════════════════════════════════════
    drawHR(doc.y);
    doc.moveDown(0.6);

    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .fillColor("#888888")
      .text(
        "Thank you for your generous contribution! This is a system-generated receipt and does not require a signature.",
        { align: "center", width: contentWidth }
      );

    doc.moveDown(0.4);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#AAAAAA")
      .text(
        `Generated on ${new Date().toLocaleString("en-IN")} | Powered by Razorpay`,
        { align: "center", width: contentWidth }
      );

    doc.end();
  });
};
