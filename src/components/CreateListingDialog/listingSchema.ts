
import * as z from "zod";

export const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(5000, "Description too long"),
  phase: z.enum(["Phase I", "Phase II"], {
    required_error: "Please select a phase",
  }),
  agency: z.string().min(1, "Agency is required").max(100, "Agency name too long"),
  value: z.number().min(1, "Value must be greater than 0"),
  deadline: z.string().min(1, "Deadline is required"),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  technology_summary: z.string().max(50, "Technology summary too long").optional(),
});

export type ListingFormData = z.infer<typeof listingSchema>;
