
import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo_url: z.string().optional(),
  promotion_title: z.string().optional(),
  promotion_description: z.string().optional(),
  promotion_photo_url: z.string().optional(),
  display_order: z.number().min(0, "Display order must be 0 or greater"),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
