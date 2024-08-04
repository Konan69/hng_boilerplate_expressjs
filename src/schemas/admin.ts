import { z } from "zod";

const adminLogSchema = z.object({
  page: z
    .number()
    .optional()
    .refine((val) => val >= 1, {
      message: "Page must be a positive integer.",
      path: ["page"],
    }),
  limit: z
    .number()
    .optional()
    .refine((val) => val >= 1, {
      message: "Limit must be a positive integer.",
      path: ["limit"],
    }),
  sort: z
    .enum(["asc", "desc"])
    .optional()
    .refine((val) => val?.toLowerCase() === val, {
      message: "Sort must be either 'asc' or 'desc'",
      path: ["sort"],
    }),
  offset: z
    .number()
    .optional()
    .refine((val) => val >= 0, {
      message: "Offset must be a non-negative integer.",
      path: ["offset"],
    }),
});

export { adminLogSchema };
