import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(req) {
  try {
    if (!process.env.SENDGRID_API_KEY || !process.env.SEND_FROM) {
      return NextResponse.json({ ok: false, error: "Missing SENDGRID_API_KEY or SEND_FROM env var." }, { status: 500 });
    }

    const { to, cc, subject, html, photos = [] } = await req.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ ok: false, error: "Missing required fields (to, subject, html)." }, { status: 400 });
    }

    const executablePath = await chromium.executablePath();
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    const attachments = [
      {
        content: Buffer.from(pdfBuffer).toString("base64"),
        filename: "visit-report.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
      ...photos.map((p, i) => ({
        content: p.content, // base64 content only (no data: prefix)
        filename: p.filename || `photo-${i + 1}.jpg`,
        type: p.type || "image/jpeg",
        disposition: "attachment",
      })),
    ];

    const msg = {
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      from: process.env.SEND_FROM,
      subject,
      html,
      attachments,
    };
    if (cc && cc.length) {
      msg.cc = cc.split(",").map((s) => s.trim()).filter(Boolean);
    }

    await sgMail.send(msg);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/send] error:", err);
    return NextResponse.json({ ok: false, error: err.message || "Unknown error" }, { status: 500 });
  }
}
