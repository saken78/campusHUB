import { HTTPException } from "hono/http-exception";
import { prisma } from "../db";
import { HttpStatus } from "../utils/status_code";

export const withRelations = {
  categories: {
    include: {
      category: true,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  _count: {
    select: {
      bookmarks: true,
      comments: true,
    },
  },
};

export const findOwned = async (id: string, userId: string, role: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
  if (!event) {
    throw new HTTPException(HttpStatus.NOT_FOUND, {
      message: "Event tidak ditemukan",
    });
  }
  if (role === "dosen" && event.createdBy !== userId) {
    throw new HTTPException(HttpStatus.FORBIDDEN, {
      message: "Tidak boleh mengubah event orang lain",
    });
  }
  return event;
};
