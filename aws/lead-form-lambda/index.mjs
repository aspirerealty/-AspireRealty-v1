// AWS Lambda (Node.js 22.x) behind a Function URL. Receives enquiry form
// submissions from the website and emails them to the sales inbox via
// Amazon SES. Nothing is stored.
//
// Environment variables:
//   LEAD_TO_EMAIL    inbox that receives leads (e.g. sales@yourdomain.com)
//   LEAD_FROM_EMAIL  SES-verified sender (e.g. website@yourdomain.com)
//
// Configure CORS on the Function URL itself (allowed origin = your site),
// not in this code, to avoid duplicate CORS headers.
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({});

const FIELDS = [
  ["name", "Name"],
  ["phone", "Mobile"],
  ["email", "Email"],
  ["reason", "Reason"],
  ["project", "Project"],
  ["referrerName", "Referred by"],
  ["referrerPhone", "Referrer mobile"],
  ["message", "Message"],
  ["source", "Form"],
  ["page", "Page"],
];

const clean = (v, max = 1000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const handler = async (event) => {
  if (event.requestContext?.http?.method !== "POST") return { statusCode: 405 };

  let body;
  try {
    body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // Honeypot filled → bot. Pretend success so it doesn't retry.
  if (clean(body.website)) return { statusCode: 200, body: "ok" };

  const lead = Object.fromEntries(FIELDS.map(([key]) => [key, clean(body[key])]));
  const digits = lead.phone.replace(/\D/g, "");
  if (!lead.name || digits.length < 10 || !/^\S+@\S+\.\S+$/.test(lead.email)) {
    return { statusCode: 400, body: "Missing or invalid fields" };
  }

  const lines = FIELDS.filter(([key]) => lead[key]).map(([key, label]) => `${label}: ${lead[key]}`);
  const subject = `New lead: ${lead.name}${lead.project ? ` — ${lead.project}` : ""}${lead.reason ? ` (${lead.reason})` : ""}`;

  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: process.env.LEAD_FROM_EMAIL,
      Destination: { ToAddresses: [process.env.LEAD_TO_EMAIL] },
      ReplyToAddresses: [lead.email],
      Content: {
        Simple: {
          Subject: { Data: subject.slice(0, 200) },
          Body: { Text: { Data: `${lines.join("\n")}\n\nReceived: ${new Date().toISOString()}` } },
        },
      },
    }),
  );

  return { statusCode: 200, body: "ok" };
};
