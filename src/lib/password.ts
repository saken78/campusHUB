export const passwordHelper = {
  async hashPassword(plain: string): Promise<string> {
    const passwordhash = await Bun.password.hash(plain, {
      algorithm: "argon2id",
      memoryCost: 19456,
      timeCost: 3,
    });
    return passwordhash;
  },
  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(plain, hash);
  },
};
