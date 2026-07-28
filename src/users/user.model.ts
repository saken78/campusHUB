import type { users_role } from "../../generated/prisma/enums";

export type UserPatchRoleRequest = {
  role: users_role;
};

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: users_role;
  createdAt: Date;
  updatedAt: Date;
};
