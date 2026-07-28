import { z } from "zod";
import type { PaginationMeta } from "../lib/pagination";

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

export type CategoryResponse = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TagResponse = {
  id: string;
  name: string;
};

export type EventCategoryResponse = {
  id: string;
  eventId: string;
  categoryId: string;
  category: CategoryResponse;
};

export type EventTagResponse = {
  id: string;
  eventId: string;
  tagId: string;
  tag: TagResponse;
};

export type EventCountResponse = {
  bookmarks: number;
  comments: number;
};

export type EventResponse = {
  id: string;
  title: string;
  description: string;
  excerpt: string | null;
  poster: string | null;
  startDate: Date;
  endDate: Date | null;
  deadline: Date | null;
  location: string | null;
  organizer: string | null;
  contact: string | null;
  registrationLink: string | null;
  status: string;
  featured: boolean;
  views: number;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type EventWithRelations = EventResponse & {
  categories: EventCategoryResponse[];
  tags: EventTagResponse[];
  _count: EventCountResponse;
};

export type EventMetaResponse = {
  data: EventWithRelations[];
  meta: PaginationMeta;
};
