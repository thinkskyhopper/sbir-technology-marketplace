
import { z } from "zod";

const promotionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  photo_url: z.string().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo_url: z.string().optional(),
  display_order: z.number().min(0, "Display order must be 0 or greater"),
  promotions: z.array(promotionSchema).max(4, "Maximum 4 promotions allowed").optional(),
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type Promotion = z.infer<typeof promotionSchema>;
