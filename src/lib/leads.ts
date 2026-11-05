// Sends enquiry form data. Delivery depends on where the site is built:
//  - NEXT_PUBLIC_LEAD_ENDPOINT set → POST JSON there. The Hostinger build sets
//    it to /api/lead.php (hostinger/public/api/lead.php), which saves the lead
//    to MySQL and emails it. (The AWS Lambda in aws/ accepts the same JSON.)
//  - Otherwise in production → Netlify Forms (form definition lives in
//    public/__forms.html). Leads appear in the Netlify dashboard.
// In `npm run dev` with no endpoint, submissions are simulated.

export type Lead = {
  name: string;
  phone: string;
  email: string;
  message?: string;
  reason?: string;
  project?: string;
  source: string;
  website?: string; // honeypot — real users leave this empty
};

const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

export async function submitLead(lead: Lead) {
  const data = { ...lead, page: window.location.pathname };

  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Lead submission failed (${res.status})`);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[lead] no lead endpoint in dev — simulating success", data);
    await new Promise((r) => setTimeout(r, 800));
    return;
  }

  const body = new URLSearchParams({ "form-name": "enquiry" });
  for (const [key, value] of Object.entries(data)) if (value) body.append(key, value);
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Lead submission failed (${res.status})`);
}
