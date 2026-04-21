import "server-only";

import { Resend } from "resend";
import { db } from "@/lib/db";

// ─── Resend client (shared) ──────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Hosted assets ───────────────────────────────────────────────────────────
export const APP_URL  = process.env.NEXT_PUBLIC_APP_URL || "https://chainviax-six.vercel.app";
const LOGO_URL = `${APP_URL}/chainviax-logo.svg`;

// ─── HTML template for notification emails ───────────────────────────────────
// Reuses the exact same dark template styling (colors, fonts, logo, footer,
// card, accent bar) from the OTP verification email, but replaces the OTP
// block with heading, message paragraphs, and an optional CTA button.

/** Optional transaction-summary card rendered between the message body and
 *  the CTA. Used by deposit and withdrawal approval emails so users get a
 *  scannable summary of amount / asset / destination / status at a glance. */
export interface EmailSummaryCard {
  title?: string;                       // Defaults to "Transaction Summary"
  /** Primary big-number value, e.g. "$12,500.00 USD" */
  primary: { label: string; value: string };
  /** Secondary smaller value, e.g. "0.125 BTC" */
  secondary?: { label: string; value: string };
  /** Bullet rows shown under the primary value. */
  rows?: Array<{ label: string; value: string; mono?: boolean }>;
  /** Optional status pill colour. */
  statusColor?: "success" | "neutral" | "warning";
  status?: string;
}

function buildSummaryCardHtml(card: EmailSummaryCard): string {
  // Green, neutral, and warning palettes used by the status pill.
  const statusPalette = {
    success: { bg: "#062012", border: "rgba(34,197,94,0.45)", color: "#4ade80" },
    neutral: { bg: "#1a1a22", border: "rgba(244,196,64,0.45)", color: "#f4c440" },
    warning: { bg: "#2a1a06", border: "rgba(245,158,11,0.55)", color: "#f59e0b" },
  }[card.statusColor ?? "success"];

  const statusPill = card.status
    ? `
      <tr>
        <td align="center" style="padding:0 0 18px 0;">
          <span style="
            display:inline-block;
            background-color:${statusPalette.bg};
            color:${statusPalette.color};
            border:1px solid ${statusPalette.border};
            border-radius:999px;
            font-size:11px;
            font-weight:700;
            letter-spacing:0.16em;
            text-transform:uppercase;
            padding:6px 16px;
          ">${card.status}</span>
        </td>
      </tr>`
    : "";

  const rowsHtml = (card.rows ?? [])
    .map(
      (r) => `
      <tr>
        <td style="padding:16px 0;border-top:1px solid rgba(255,255,255,0.06);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="
                font-size:11px;
                font-weight:700;
                letter-spacing:0.14em;
                text-transform:uppercase;
                color:#a1a5ae !important;
              ">${r.label}</td>
              <td align="right" style="
                font-size:13.5px;
                font-weight:500;
                color:#ffffff !important;
                font-family:${r.mono ? "'SFMono-Regular',Menlo,Consolas,monospace" : "inherit"};
                word-break:break-all;
              ">${r.value}</td>
            </tr>
          </table>
        </td>
      </tr>`,
    )
    .join("");

  const secondaryHtml = card.secondary
    ? `
      <p style="
        margin:10px 0 0 0;
        font-size:13px;
        color:#a1a5ae !important;
        text-align:center;
      ">${card.secondary.value}</p>`
    : "";

  return `
    <!-- Transaction summary card (clean, no glow, thin hairline borders) -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px 0;">
      <tr>
        <td bgcolor="#0a0b10" style="
          background-color:#0a0b10 !important;
          border:1px solid rgba(255,255,255,0.06);
          border-radius:14px;
          padding:26px 24px 22px 24px;
        ">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${statusPill}
            <tr>
              <td align="center" style="padding:0 0 6px 0;">
                <div style="
                  font-size:30px;
                  font-weight:700;
                  color:#ffffff !important;
                  letter-spacing:-0.6px;
                  line-height:1.1;
                ">${card.primary.value}</div>
                ${secondaryHtml}
              </td>
            </tr>
            <tr><td style="height:18px;line-height:18px;font-size:0;">&nbsp;</td></tr>
            ${rowsHtml}
          </table>
        </td>
      </tr>
    </table>`;
}

function buildNotificationEmail(opts: {
  name: string;
  heading: string;
  body: string[];
  cta?: { label: string; url: string };
  summaryCard?: EmailSummaryCard;
}): string {
  const { name, heading, body, cta, summaryCard } = opts;

  // Prepend a soft greeting unless the first line already starts with "Hi"
  const startsWithGreeting = body[0]?.trim().toLowerCase().startsWith("hi ");
  const bodyWithGreeting = startsWithGreeting ? body : [`Hi ${name},`, ...body];

  const paragraphs = bodyWithGreeting
    .map(
      (p, i) => `
      <p style="
        margin:0 0 ${i === 0 ? 22 : 18}px 0;
        font-size:14.5px;
        line-height:1.65;
        color:#a1a5ae !important;
        text-align:center;
      ">${p}</p>`
    )
    .join("");

  const cardBlock = summaryCard ? buildSummaryCardHtml(summaryCard) : "";

  const ctaBlock = cta
    ? `
      <!-- CTA Button — gold, full width, subtle -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 0 0;">
        <tr>
          <td align="center">
            <a href="${cta.url}" target="_blank" rel="noopener noreferrer" style="
              display:block;
              background:linear-gradient(180deg,#ffe38a 0%,#f5c94c 45%,#e0a51e 100%);
              color:#1b1205 !important;
              font-size:14.5px;
              font-weight:700;
              text-decoration:none;
              padding:15px 24px;
              border-radius:12px;
              letter-spacing:0.02em;
              border:1px solid rgba(255,232,150,0.55);
              text-align:center;
            ">${cta.label}</a>
          </td>
        </tr>
      </table>`
    : "";

  /* Palette — clean black + gold. Every important surface uses both
     bgcolor and inline style so Gmail/Outlook/iOS Mail render consistently. */
  const BG_PAGE    = "#05060a";   // near-black page background
  const BG_CARD    = "#0b0c12";   // card surface
  const BORDER     = "rgba(255,255,255,0.06)"; // thin hairlines
  const CARD_BORDER = "rgba(244,196,64,0.14)"; // very subtle gold hairline on card
  const TEXT_WHITE = "#ffffff";
  const TEXT_MUTED = "#a1a5ae";
  const TEXT_DIM   = "#6b7080";
  const GOLD       = "#f4c440";

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <title>${heading}</title>
  <style>
    :root { color-scheme: dark; }
    body, table, td { color: ${TEXT_WHITE} !important; }
    a { color: ${GOLD} !important; }
    u + .body .gmail-dark-safe { background-color: ${BG_PAGE} !important; }
    @media (prefers-color-scheme: dark) {
      body, table, td { background-color: ${BG_PAGE} !important; }
    }
  </style>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body class="body" bgcolor="${BG_PAGE}" style="margin:0;padding:0;background-color:${BG_PAGE} !important;color:${TEXT_WHITE} !important;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Email wrapper -->
  <table class="gmail-dark-safe" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG_PAGE}" style="background-color:${BG_PAGE} !important;min-height:100vh;">
    <tr>
      <td align="center" bgcolor="${BG_PAGE}" style="padding:40px 16px;background-color:${BG_PAGE} !important;">

        <!-- Container — max 520px -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

          <!-- ─── CARD ───────────────────────────────────────────────── -->
          <tr>
            <td bgcolor="${BG_CARD}" style="
              background-color:${BG_CARD} !important;
              border-radius:18px;
              border:1px solid ${CARD_BORDER};
            ">

              <!-- Card header: centered logo + thin gold hairline -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:36px 40px 20px 40px;">
                    <img
                      src="${LOGO_URL}"
                      alt="Chainviax"
                      width="180"
                      height="42"
                      style="display:block;border:0;width:180px;height:42px;outline:none;-ms-interpolation-mode:bicubic;"
                    />
                  </td>
                </tr>
                <tr>
                  <td style="height:1px;line-height:1px;font-size:0;background:linear-gradient(90deg,transparent,rgba(244,196,64,0.35),transparent);">&nbsp;</td>
                </tr>
              </table>

              <!-- Card content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BG_CARD}">
                <tr>
                  <td bgcolor="${BG_CARD}" style="padding:40px 34px 36px 34px;background-color:${BG_CARD} !important;">

                    <!-- Heading -->
                    <h1 style="
                      margin:0 0 12px 0;
                      font-size:26px;
                      font-weight:700;
                      color:${TEXT_WHITE} !important;
                      text-align:center;
                      letter-spacing:-0.5px;
                      line-height:1.2;
                    ">${heading}</h1>

                    <!-- Greeting is included in the body paragraphs for
                         tighter spacing — the caller prepends "Hi Name," when
                         appropriate. If no body is sent, fall back to a simple
                         greeting. -->
                    ${paragraphs || `<p style="margin:0 0 24px 0;font-size:14.5px;line-height:1.65;color:${TEXT_MUTED} !important;text-align:center;">Hi ${name},</p>`}

                    ${cardBlock}

                    ${ctaBlock}

                  </td>
                </tr>
              </table>

              <!-- Footer inside card: automated message + copyright -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:6px 34px 24px 34px;">
                    <p style="
                      margin:0 0 4px 0;
                      font-size:12px;
                      color:${TEXT_DIM} !important;
                      text-align:center;
                    ">This is an automated message. Do not reply.</p>
                    <p style="
                      margin:0;
                      font-size:11.5px;
                      color:${TEXT_DIM} !important;
                      text-align:center;
                    ">&copy; ${new Date().getFullYear()} Chainviax. All rights reserved.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 34px;">
                    <div style="height:1px;background:rgba(255,255,255,0.05);"></div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:14px 34px 26px 34px;">
                    <span style="font-size:10.5px;font-weight:600;letter-spacing:0.12em;color:${GOLD};margin-right:14px;">
                      &#128274; TLS Secured
                    </span>
                    <span style="font-size:10.5px;font-weight:600;letter-spacing:0.12em;color:${GOLD};">
                      &#10003; KYC Verified
                    </span>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Extra outside-card breathing room -->
          <tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ─── Send notification email ─────────────────────────────────────────────────
export async function sendNotificationEmail(opts: {
  to: string;
  name: string;
  subject: string;
  heading: string;
  body: string[];
  cta?: { label: string; url: string };
  summaryCard?: EmailSummaryCard;
}): Promise<string> {
  const tag = "[sendNotificationEmail]";
  const { to, name, subject, heading, body, cta, summaryCard } = opts;

  const from = process.env.EMAIL_FROM || "Chainviax <no-reply@chainviax.com>";

  console.log(`${tag} to: ${to} | subject: ${subject}`);

  const html = buildNotificationEmail({ name, heading, body, cta, summaryCard });

  /* Plain-text mirror of the HTML: primary value + rows after the body. */
  const cardText = summaryCard
    ? [
        "",
        `── ${summaryCard.title ?? "Transaction Summary"} ──`,
        `${summaryCard.primary.label}: ${summaryCard.primary.value}`,
        ...(summaryCard.secondary ? [summaryCard.secondary.value] : []),
        ...(summaryCard.rows ?? []).map((r) => `${r.label}: ${r.value}`),
      ]
    : [];

  const text = [
    `Hi ${name},`,
    "",
    ...body,
    ...cardText,
    "",
    ...(cta ? [`${cta.label}: ${cta.url}`, ""] : []),
    "— Chainviax",
  ].join("\n");

  const result = await resend.emails.send({ from, to, subject, text, html });

  if (result.error) {
    console.error(`${tag} RESEND ERROR:`, JSON.stringify(result.error));
    throw new Error(
      `Email provider rejected the send request. name="${result.error.name}" message="${result.error.message}"`
    );
  }

  const messageId = result.data?.id ?? "(no id returned)";
  console.log(`${tag} Email queued. Resend id: ${messageId}`);
  return messageId;
}

// ─── Unified notifyUser: in-app + email ──────────────────────────────────────
// Creates an in-app notification AND sends a branded email (fire-and-forget).

export async function notifyUser(opts: {
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "TRADE" | "DEPOSIT" | "WITHDRAWAL" | "VERIFICATION" | "SUPPORT" | "SECURITY";
  email?: {
    to: string;
    name: string;
    subject: string;
    heading: string;
    body: string[];
    cta?: { label: string; url: string };
    summaryCard?: EmailSummaryCard;
  };
}) {
  const { userId, title, message, type, email } = opts;

  // 1. In-app notification
  await db.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });

  // 2. Email — fire-and-forget (don't block on failure)
  if (email) {
    sendNotificationEmail(email).catch((err) => {
      console.error("[notifyUser] email send failed (non-blocking):", err);
    });
  }
}
