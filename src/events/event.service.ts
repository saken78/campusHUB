import { HTTPException } from "hono/http-exception";
import { prisma } from "../db";
import { HttpStatus } from "../utils/status_code";
import { buildMeta, paginate } from "../lib/pagination";
import type { EventStatus } from "../../generated/prisma/enums";
import {
  CREATE_EVENT_SCHEMA,
  UPDATE_EVENT_SCHEMA,
  type CreateEventRequest,
  type UpdateEventRequest,
} from "./event.model";
import { findOwned, withRelations } from "./event.helper";

export const EventService = {
  async create(req: CreateEventRequest, userId: string) {
    const data = CREATE_EVENT_SCHEMA.parse(req);

    if (data.endDate && data.startDate >= data.endDate) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "endDate harus setelah startDate",
      });
    }

    return prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          title: data.title,
          description: data.description,
          excerpt: data.excerpt ?? null,
          location: data.location ?? null,
          organizer: data.organizer ?? null,
          contact: data.contact ?? null,
          registrationLink: data.registrationLink ?? null,
          featured: data.featured ?? false,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          deadline: data.deadline ? new Date(data.deadline) : null,
          createdBy: userId,
        },
      });

      if (data.categoryIds?.length) {
        await tx.eventCategory.createMany({
          data: data.categoryIds.map((categoryId) => ({
            eventId: event.id,
            categoryId,
          })),
        });
      }

      if (data.tagIds?.length) {
        await tx.eventTag.createMany({
          data: data.tagIds.map((tagId) => ({ eventId: event.id, tagId })),
        });
      }

      return tx.event.findUnique({
        where: { id: event.id },
        include: withRelations,
      });
    });
  },
  async list(page: string, perPage: string) {
    const pg = paginate(page, perPage);

    const [data, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: {
          deletedAt: null,
        },
        include: withRelations,
        orderBy: {
          createdAt: "desc",
        },
        skip: pg.skip,
        take: pg.perPage,
      }),
      prisma.event.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    return {
      data,
      meta: buildMeta(total, pg.page, pg.perPage),
    };
  },
  async findById(id: string) {
    const event = await prisma.event.findFirst({
      where: {
        id,
        deletedAt: null,
        status: "published",
      },
      include: withRelations,
    });
    if (!event) {
      throw new HTTPException(HttpStatus.NOT_FOUND, {
        message: "Event tidak ditemukan",
      });
    }

    await prisma.event.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return event;
  },
  async update(
    id: string,
    req: UpdateEventRequest,
    userId: string,
    role: string,
  ) {
    await findOwned(id, userId, role);

    const data = UPDATE_EVENT_SCHEMA.parse(req);

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw new HTTPException(HttpStatus.BAD_REQUEST, {
        message: "endDate harus setelah startDate",
      });
    }

    const { categoryIds, tagIds, startDate, endDate, deadline, ...fields } =
      data;

    return prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
      UPDATE events
      SET
        title = ${fields.title},
        description = ${fields.description},
        location = ${fields.location},
        start_date = ${startDate ? new Date(startDate) : null},
        end_date = ${endDate ? new Date(endDate) : null},
        deadline = ${deadline ? new Date(deadline) : null},
        updated_at = NOW()
      WHERE id = ${id};
    `;

      if (categoryIds) {
        await tx.$executeRaw`
        DELETE FROM event_category
        WHERE event_id = ${id};
      `;

        for (const categoryId of categoryIds) {
          await tx.$executeRaw`
          INSERT INTO event_category (event_id, category_id)
          VALUES (${id}, ${categoryId});
        `;
        }
      }

      if (tagIds) {
        await tx.$executeRaw`
        DELETE FROM event_tag
        WHERE event_id = ${id};
      `;

        for (const tagId of tagIds) {
          await tx.$executeRaw`
          INSERT INTO event_tags (event_id, tag_id)
          VALUES (${id}, ${tagId});
        `;
        }
      }

      const event = await tx.$queryRaw`
      SELECT *
      FROM events
      WHERE id = ${id};
    `;

      return event;
    });
  },
  async remove(id: string, userId: string, role: string): Promise<void> {
    await findOwned(id, userId, role);
    await prisma.event.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  async setStatus(
    id: string,
    status: EventStatus,
    userId: string,
    role: string,
  ) {
    await findOwned(id, userId, role);
    return prisma.event.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },
};
