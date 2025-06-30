
import { z } from "zod";
import { CATEGORIES } from "@/utils/categoryConstants";

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_email: z.string().email("Valid email is required").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  notification_categories: z.array(z.string()).optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
