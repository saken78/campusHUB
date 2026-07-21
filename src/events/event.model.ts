import { z } from "zod";

export const CREATE_EVENT_SCHEMA = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  excerpt: z.string().max(300).optional(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime().optional(),
  deadline: z.iso.datetime().optional(),
  location: z.string().max(200).optional(),
  organizer: z.string().max(200).optional(),
  contact: z.string().max(200).optional(),
  registrationLink: z.url().max(2048).optional(),
  featured: z.boolean().optional(),
  categoryIds: z.array(z.uuid()).optional(),
  tagIds: z.array(z.uuid()).optional(),
});

export const UPDATE_EVENT_SCHEMA = CREATE_EVENT_SCHEMA.partial();

export type CreateEventRequest = z.infer<typeof CREATE_EVENT_SCHEMA>;

export type UpdateEventRequest = z.infer<typeof UPDATE_EVENT_SCHEMA>;
