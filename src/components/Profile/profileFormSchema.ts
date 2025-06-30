
import { z } from "zod";

export const SBIR_CATEGORIES = [
  "Aerospace",
  "Biotechnology",
  "Defense", 
  "Energy",
  "Healthcare",
  "Information Technology",
  "Manufacturing",
  "Transportation"
];

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  display_email: z.string().email("Valid email is required"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  notification_categories: z.array(z.string()).optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
