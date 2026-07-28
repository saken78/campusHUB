import { HTTPException } from "hono/http-exception";
import { prisma } from "../db";
import { HttpStatus } from "../utils/status_code";
import type { users_role } from "../../generated/prisma/enums";
import type { UserResponse } from "./user.model";

export const UserService = {
  async getUsers(): Promise<UserResponse[]> {
    const data = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  },
  async changeRole(id: string, role: users_role): Promise<UserResponse> {
    const data = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  },
  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    const data = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (data) {
      throw new HTTPException(HttpStatus.FOUND, {
        message: "delete user failed",
      });
    }
  },
};
