// ===============================
// 🌬️ Cold Breeze — app.ts FINAL
// ===============================

import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCookie from "@fastify/cookie";
import rawBody from "fastify-raw-body"; // ⚡ necessário pro Stripe Webhook

import { distanceRoutes } from "./modules/distance/routes.js";
import { env } from "./env/index.js";
import { setupErrorHandler } from "./shared/errorHandler.js";
import { couponRoutes } from "@/modules/cupons/routes.js";
import { authRoutes } from "./modules/auth/routes.js";
import { productRoutes } from "./modules/products/routes.js";
import { cartRoutes } from "./modules/cart/routes.js";
import { shippingRoutes } from "./modules/shipping/routes.js";
import { orderRoutes } from "./modules/orders/routes.js";
import { paymentRoutes } from "./modules/payments/routes.js";

import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";

// 🚀 Instância principal do servidor
export const app = fastify({
  logger: true,
  forceCloseConnections: true,
});

// 🧩 Configura Fastify + Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider<ZodTypeProvider>();

// ⚙️ Corpo bruto (Stripe precisa disso)
app.register(rawBody, {
  field: "rawBody",
  global: false,
});

// 🌍 CORS — totalmente liberado entre frontend e backend (com HTTPS)
app.register(fastifyCors, {
  origin: [
    "http://localhost:5173", // dev local
    "https://coldbreeze.com.br", // domínio oficial (HostGator)
    "https://www.coldbreeze.com.br",
    "https://coldbreeze-backend.onrender.com", // backend (para requisições diretas)
  ],
  credentials: true, // ✅ necessário para cookies cross-domain
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 🧩 Hook adicional — garante header necessário para mobile (Safari/Chrome)
app.addHook("onSend", async (req, reply, payload) => {
  reply.header("Access-Control-Allow-Credentials", "true");
  return payload;
});

// 🧠 Helmet — segurança ajustada (sem bloquear cookies cross-domain)
app.register(fastifyHelmet, {
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false, // ⚡ evita bloqueio de cookies
  contentSecurityPolicy: false, // opcional (permite imagens externas)
});

// 🚦 Limite de requisições
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// 🍪 Cookies — configurados para mobile + cross-domain
app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET || "coldbreeze_secret",
  hook: "onRequest",
  parseOptions: {
    sameSite: "none", // ✅ necessário pra cross-domain
    secure: true,     // ✅ obrigatório em HTTPS
  },
});

// 🧱 Rotas principais
app.get("/", async () => ({ message: "Cold Breeze API online 🌬️" }));

app.register(authRoutes, { prefix: "/auth" });
app.register(productRoutes, { prefix: "/store" });
app.register(cartRoutes, { prefix: "/cart" });
app.register(shippingRoutes, { prefix: "/shipping" });
app.register(orderRoutes, { prefix: "/orders" });
app.register(paymentRoutes, { prefix: "/payments" });
app.register(couponRoutes, { prefix: "/coupons" });
app.register(distanceRoutes);

// 🔥 Handler global de erros
setupErrorHandler(app);
