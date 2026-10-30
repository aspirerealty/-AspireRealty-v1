// Sends enquiry form data to the AWS Lambda function (see aws/lead-form-lambda).
// Nothing is stored — the Lambda emails each lead to the sales inbox.

export type Lead = {
  name: string;
  phone: string;
  email: string;
  message?: string;
  reason?: string;
  project?: string;
  referrerName?: string;
  referrerPhone?: string;
  source: string;
  website?: string; // honeypot — real users leave this empty
};

const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

export async function submitLead(lead: Lead) {
  if (!endpoint) {
    if (process.env.NODE_ENV === "development") {
      console.info("[lead] NEXT_PUBLIC_LEAD_ENDPOINT not set — simulating success", lead);
      await new Promise((r) => setTimeout(r, 800));
      return;
    }
    throw new Error("Lead endpoint is not configured");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, page: window.location.pathname }),
  });
  if (!res.ok) throw new Error(`Lead submission failed (${res.status})`);
}
