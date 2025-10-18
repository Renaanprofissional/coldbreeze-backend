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

// 🚀 Criação da instância principal do servidor
export const app = fastify({
  logger: true,
  forceCloseConnections: true, // evita bug de "premature close"
});

// 🧩 Configura Fastify pra entender Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.withTypeProvider<ZodTypeProvider>();

// ⚙️ Plugin pra habilitar corpo bruto (Stripe precisa disso)
app.register(rawBody, {
  field: "rawBody",
  global: false,
});

// 🌍 CORS — libera frontend local, produção e webhooks
app.register(fastifyCors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      "http://localhost:5173", // local dev
      "https://coldbreeze.vercel.app",
      "https://coldbreeze-store.vercel.app",
      "https://coldbreeze.com.br",
      "https://coldbreeze-frontend.vercel.app", // novo domínio Vercel
      env.FRONTEND_URL, // variável de ambiente no Render
    ].filter(Boolean);

    // 🔹 Permite requests sem origin (ex: SSR, Postman, Stripe)
    if (!origin) {
      cb(null, true);
      return;
    }

    // 🔹 Verifica se o origin é permitido
    const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));
    if (isAllowed) {
      cb(null, true);
    } else {
      console.warn(`🚫 Bloqueado por CORS: ${origin}`);
      cb(new Error("Origin not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// 🧠 Segurança básica
app.register(fastifyHelmet, {
  crossOriginResourcePolicy: false, // ✅ permite imagens externas
});

// 🚦 Rate limit básico
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
app.register(orderRoutes, { prefix: "/orders" });
app.register(paymentRoutes, { prefix: "/payments" });
app.register(couponRoutes, { prefix: "/coupons" });
app.register(distanceRoutes);

// 🔥 Handler global de erros
setupErrorHandler(app);
