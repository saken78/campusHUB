import { HTTPException } from "hono/http-exception";
import { prisma } from "../db";
import { HttpStatus } from "../utils/status_code";

export const UserService = {
  async getUsers() {
    const data = await prisma.user.findMany();
    return data;
  },
  async changeRole(id: string) {
    const data = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: "dosen",
      },
    });
    return data;
  },
  async deleteUser(id: string) {
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
