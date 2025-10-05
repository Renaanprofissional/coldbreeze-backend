import { config } from "dotenv";
config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
};
