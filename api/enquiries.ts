import { createEnquiry, parseEnquiryBody } from "../server/enquiries";

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  const parsed = parseEnquiryBody(req.body);
  if (!parsed.success) {
    res.status(400).json({
      ok: false,
      error: "Invalid enquiry",
      details: parsed.error.flatten(),
    });
    return;
  }

  try {
    const record = await createEnquiry(parsed.data);
    res.status(201).json({ ok: true, id: record.id });
  } catch (error) {
    console.error("[enquiry] vercel handler failed", error);
    res.status(500).json({ ok: false, error: "Unable to save enquiry" });
  }
}
