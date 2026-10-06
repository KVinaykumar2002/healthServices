import { z } from "zod";

export const enquiryTypes = ["patient", "employer"] as const;
export const enquiryStatuses = ["new", "contacted", "in_progress", "closed", "spam"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(5, "Phone number is required").max(40),
  org: z.string().trim().max(120).optional().default(""),
  enquiryType: z.union([z.enum(enquiryTypes), z.literal("")]).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  /** Which form the lead came from, e.g. "Request a Nurse". */
  source: z.string().trim().max(80).optional().default("Contact us"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryRecord = EnquiryInput & {
  id: string;
  status: EnquiryStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export const enquiryUpdateSchema = z
  .object({
    status: z.enum(enquiryStatuses).optional(),
    notes: z.string().max(5000).optional(),
  })
  .refine((value) => value.status !== undefined || value.notes !== undefined, {
    message: "Nothing to update",
  });

export type EnquiryUpdate = z.infer<typeof enquiryUpdateSchema>;

const optionalFilter = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === "" || value === "all" ? undefined : value), schema.optional());

export const enquiryListQuerySchema = z.object({
  search: z.string().trim().max(100).optional().default(""),
  status: optionalFilter(z.enum(enquiryStatuses)),
  enquiryType: optionalFilter(z.enum([...enquiryTypes, "unspecified"])),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type EnquiryListQuery = z.infer<typeof enquiryListQuerySchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
});
