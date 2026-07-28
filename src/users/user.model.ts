import type { users_role } from "../../generated/prisma/enums";

export type UserPatchRoleRequest = {
  role: users_role;
};
