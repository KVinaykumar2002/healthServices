import { z } from "zod";

export const enquirySources = ["contact", "hero", "lab", "offers"] as const;

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().max(40).optional().default(""),
  org: z.string().trim().max(120).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.enum(enquirySources).optional().default("contact"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryRecord = EnquiryInput & {
  id: string;
  createdAt: string;
};

export type EnquiryResponse = {
  ok: true;
  id: string;
};
