import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCookie from "@fastify/cookie";

import { env } from "./env/index.js";
import { setupErrorHandler } from "./shared/errorHandler.js";
import { authRoutes } from "./modules/auth/routes.js";
import { productRoutes } from "./modules/products/routes.js";
import { cartRoutes } from "./modules/cart/routes.js";
import { shippingRoutes } from "./modules/shipping/routes.js";

// 🚀 Instância principal do servidor
export const app = fastify({
  logger: true,
  forceCloseConnections: true, // evita bug de "premature close"
});

// 🌍 CORS — permite o frontend acessar a API
app.register(fastifyCors, {
  origin: [env.FRONTEND_URL],
  credentials: true,
});

// 🧠 Segurança básica (protege headers)
app.register(fastifyHelmet);

// 🚦 Limita requisições pra evitar spam
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// 🍪 Cookies e autenticação
app.register(fastifyCookie);

// 🧱 Rotas principais
app.get("/", async () => ({ message: "Cold Breeze API online 🌬️" }));
app.register(authRoutes, { prefix: "/auth" });
app.register(productRoutes, { prefix: "/store" });
app.register(cartRoutes, { prefix: "/cart" });
app.register(shippingRoutes, { prefix: "/shipping" });

// 🔥 Handler global de erros (centralizado)
setupErrorHandler(app);
