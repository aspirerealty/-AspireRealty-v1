// Sends enquiry form data to the PHP handler on Hostinger
// (hostinger/public/api/lead.php), which saves it to MySQL, emails it and
// copies it to the Google Sheet. In `npm run dev` there is no PHP, so
// submissions are simulated.

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

const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "/api/lead.php";

export async function submitLead(lead: Lead) {
  const data = { ...lead, page: window.location.pathname };

  if (process.env.NODE_ENV === "development") {
    console.info("[lead] no lead endpoint in dev — simulating success", data);
    await new Promise((r) => setTimeout(r, 800));
    return;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Lead submission failed (${res.status})`);
}
