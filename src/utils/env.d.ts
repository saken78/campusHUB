declare module "bun" {
  interface Env {
    PORT: string;
    DATABASE_URL: string;
    DATABASE_HOST: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_NAME: string;
    JWT_SECRET: string;
  }
}
