import type { EnquiryRecord } from "./schema";

const ENQUIRY_TYPE_LABELS: Record<string, string> = {
  patient: "Patient / family home care",
  employer: "Employer / facility staffing",
};

async function notifyWebhook(record: EnquiryRecord) {
  const webhook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch (error) {
    console.error("[enquiry] webhook failed", error);
  }
}

async function notifyEmail(record: EnquiryRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL || "Info@bhsknursingservices.com";
  const from = process.env.ENQUIRY_FROM_EMAIL || "onboarding@resend.dev";
  if (!apiKey) return;

  const lines = [
    `New enquiry (${record.source})`,
    `ID: ${record.id}`,
    `Time: ${record.createdAt}`,
    `Name: ${record.name}`,
    `Phone: ${record.phone || "—"}`,
    `Organisation / city: ${record.org || "—"}`,
    `Enquiry type: ${ENQUIRY_TYPE_LABELS[record.enquiryType] ?? "Not specified"}`,
    `Service: ${record.service || "—"}`,
    `Message: ${record.message || "—"}`,
  ];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `BHSK enquiry: ${record.service || record.name}`,
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("[enquiry] resend failed", await response.text());
    }
  } catch (error) {
    console.error("[enquiry] email failed", error);
  }
}

export async function notifyNewEnquiry(record: EnquiryRecord) {
  await Promise.all([notifyWebhook(record), notifyEmail(record)]);
}
