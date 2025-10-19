// ===============================
// 🌬️ Cold Breeze — app.ts corrigido
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

// 🌍 CORS — essencial pra autenticação cross-domain (mobile + desktop)
app.register(fastifyCors, {
  origin: [
    "http://localhost:5173", // dev local
    "https://coldbreeze.vercel.app",
    "https://coldbreeze-store.vercel.app",
    "https://coldbreeze-frontend.vercel.app",
    "https://coldbreeze.com.br",          // domínio oficial HostGator
    "https://www.coldbreeze.com.br",
    env.FRONTEND_URL,                     // variável no Render
  ].filter(Boolean),
  credentials: true, // ✅ permite cookies cross-domain
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// 🧠 Helmet — segurança ajustada (sem bloquear cookies cross-domain)
app.register(fastifyHelmet, {
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false, // ⚡ evita bloqueio de cookies em mobile
  contentSecurityPolicy: false,     // opcional (libera imagens e iframes externos)
});

// 🚦 Limite de requisições
app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

// 🍪 Cookies — configurados corretamente para mobile e cross-domain
app.register(fastifyCookie, {
  secret: env.COOKIE_SECRET || "coldbreeze_secret",
  hook: "onRequest",
  parseOptions: {
    sameSite: "none", // ✅ necessário pra cross-domain (mobile)
    secure: true,     // ✅ obrigatório em HTTPS (Render + HostGator)
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
