import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCompress from "@fastify/compress";
import fastifyCookie from "@fastify/cookie";
import { env } from "./env/index.js";
import { setupErrorHandler } from "./shared/errorHandler.js";
import { authRoutes } from "./modules/auth/routes.js"; // 👈 IMPORT AQUI

export const app = fastify({ logger: true });

app.register(fastifyCors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
});
app.register(fastifyHelmet);
app.register(fastifyRateLimit, { max: 100, timeWindow: "1 minute" });
app.register(fastifyCompress);
app.register(fastifyCookie);

// 🚀 Rotas públicas
app.get("/", async () => ({ message: "Cold Breeze API online 🌬️" }));

// 🧩 Rotas de autenticação
app.register(authRoutes, { prefix: "/auth" });

// 🔥 Handler global de erros
setupErrorHandler(app);
