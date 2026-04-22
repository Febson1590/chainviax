import "server-only";
import { Resend } from "resend";

// ─── Resend client ────────────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Hosted assets ────────────────────────────────────────────────────────────
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL || "https://chainviax-six.vercel.app";
const LOGO_URL = `${APP_URL}/chainviax-logo.png`;

// ─── HTML template ────────────────────────────────────────────────────────────
// Premium black + gold identity, Binance/Coinbase quality. All colors inline
// (email clients strip classes) and every hex is repeated with !important so
// Gmail / Outlook dark-mode overrides can't repaint it.
function buildVerificationEmail(opts: {
  name:    string;
  code:    string;
  type:    "REGISTER" | "LOGIN";
}): string {
  const { name, code, type } = opts;

  const heading = type === "REGISTER" ? "Verify your email" : "Confirm your sign-in";
  const message = type === "REGISTER"
    ? "Use this code to confirm your account."
    : "Use this code to finish signing in.";

  // Spaced digits for the OTP code
  const spaced = code.split("").join("&nbsp;&nbsp;");

  // Brand tokens
  const bgDark   = "#05060a";  // page background — near-black
  const cardBg   = "#0b0c12";  // card surface
  const otpBg    = "#0a0b10";  // OTP well
  const goldHi   = "#f4c440";  // primary gold
  const goldLo   = "rgba(244,196,64,0.18)"; // gold hairline
  const textWhite = "#ffffff";
  const textMute  = "#a1a5ae"; // neutral slate, not blue
  const textDim   = "#6b7080";

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
<body style="margin:0;padding:0;background-color:${bgDark};color:${textWhite};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${message} Code: ${code}
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bgDark};min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;background-color:${bgDark};">

        <!-- Container — max 520px -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">

          <!-- ─── LOGO ──────────────────────────────────────────────── -->
          <tr>
            <td align="center" style="padding:0 0 40px 0;background-color:${bgDark};">
              <img
                src="${LOGO_URL}"
                alt="Chainviax"
                width="170"
                height="40"
                style="display:block;border:0;width:170px;height:40px;object-fit:contain;"
              />
            </td>
          </tr>

          <!-- ─── CARD ──────────────────────────────────────────────── -->
          <tr>
            <td style="
              background-color:${cardBg};
              border:1px solid ${goldLo};
              border-radius:18px;
              padding:0;
            ">

              <!-- Card inner -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:48px 40px 44px 40px;">

                    <!-- Heading -->
                    <h1 style="
                      margin:0 0 12px 0;
                      font-size:26px;
                      font-weight:700;
                      color:${textWhite};
                      text-align:center;
                      letter-spacing:-0.5px;
                      line-height:1.2;
                    ">${heading}</h1>

                    <!-- Message -->
                    <p style="
                      margin:0 0 36px 0;
                      font-size:15px;
                      line-height:1.6;
                      color:${textMute};
                      text-align:center;
                    ">Hi ${name}, ${message}</p>

                    <!-- OTP code block (centered, bold, gold-rimmed dark well) -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center" style="padding:0;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="
                                background-color:${otpBg};
                                border:1px solid rgba(244,196,64,0.32);
                                border-radius:14px;
                                padding:26px 44px;
                                box-shadow:0 0 40px rgba(244,196,64,0.06);
                              ">
                                <span style="
                                  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
                                  font-size:42px;
                                  font-weight:800;
                                  color:${textWhite};
                                  letter-spacing:0.24em;
                                  font-variant-numeric:tabular-nums;
                                  display:block;
                                  text-align:center;
                                  line-height:1;
                                ">${spaced}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Expiry note -->
                    <p style="
                      margin:24px 0 0 0;
                      font-size:12.5px;
                      color:${textMute};
                      text-align:center;
                      letter-spacing:0.02em;
                    ">
                      Expires in <span style="color:${goldHi};font-weight:600;">10 minutes</span>. Do not share this code.
                    </p>

                  </td>
                </tr>
              </table>

              <!-- Hairline separator -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,rgba(244,196,64,0.18),transparent);line-height:1px;font-size:1px;">&nbsp;</td>
                </tr>
              </table>

              <!-- Security note (inline, no nested card) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:20px 40px 24px 40px;">
                    <p style="
                      margin:0;
                      font-size:12.5px;
                      line-height:1.65;
                      color:${textMute};
                      text-align:center;
                    ">
                      Didn&rsquo;t request this? You can safely ignore this email — your account stays secure.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ─── FOOTER ────────────────────────────────────────────── -->
          <tr>
            <td align="center" style="padding:32px 0 0 0;background-color:${bgDark};">
              <p style="
                margin:0 0 6px 0;
                font-size:11.5px;
                color:${textDim};
                text-align:center;
                letter-spacing:0.03em;
              ">
                This is an automated message. Do not reply.
              </p>
              <p style="
                margin:0;
                font-size:11px;
                color:${textDim};
                text-align:center;
              ">
                &copy; ${new Date().getFullYear()} Chainviax
              </p>
            </td>
          </tr>

        </table>
        <!-- /Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ─── Public API ───────────────────────────────────────────────────────────────
// Returns the Resend message ID on success, throws with a detailed message on failure.
export async function sendVerificationEmail(opts: {
  to:   string;
  name: string;
  code: string;
  type: "REGISTER" | "LOGIN";
}): Promise<string> {
  const tag = "[sendVerificationEmail]";
  const { to, name, code, type } = opts;

  const from    = process.env.EMAIL_FROM || "Chainviax <no-reply@chainviax.com>";
  const subject = type === "REGISTER"
    ? "Verify your Chainviax account"
    : "Your Chainviax login code";

  console.log(`${tag} ── START ──────────────────────────────────────`);
  console.log(`${tag} to      : ${to}`);
  console.log(`${tag} from    : ${from}`);
  console.log(`${tag} subject : ${subject}`);
  console.log(`${tag} type    : ${type}`);
  console.log(`${tag} name    : ${name}`);
  console.log(`${tag} code    : ${code}`);

  const html = buildVerificationEmail({ name, code, type });

  const text = [
    `Hi ${name},`,
    "",
    type === "REGISTER"
      ? "Use this code to confirm your account:"
      : "Use this code to finish signing in:",
    "",
    `    ${code}`,
    "",
    "Expires in 10 minutes. Do not share this code.",
    "",
    "Didn't request this? You can safely ignore this email.",
    "",
    "— Chainviax",
  ].join("\n");

  console.log(`${tag} Calling resend.emails.send() …`);

  // The Resend SDK never throws — it returns { data, error }.
  // Not checking this return value is the silent-failure bug.
  const result = await resend.emails.send({ from, to, subject, text, html });

  console.log(`${tag} Raw Resend response:`, JSON.stringify(result));

  if (result.error) {
    // Log the full provider error so it appears in Vercel Function logs.
    console.error(`${tag} ❌ RESEND ERROR ──────────────────────────────`);
    console.error(`${tag} name    : ${result.error.name}`);
    console.error(`${tag} message : ${result.error.message}`);
    console.error(`${tag} full    :`, JSON.stringify(result.error));
    throw new Error(
      `Email provider rejected the send request. ` +
      `name="${result.error.name}" message="${result.error.message}"`
    );
  }

  const messageId = result.data?.id ?? "(no id returned)";
  console.log(`${tag} ✅ Email queued/delivered. Resend message id: ${messageId}`);
  console.log(`${tag} ── END ────────────────────────────────────────`);

  return messageId;
}
