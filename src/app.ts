import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyCookie from "@fastify/cookie";
import rawBody from "fastify-raw-body"; // ⚡ necessário pro Stripe Webhook

import { env } from "./env/index.js";
import { setupErrorHandler } from "./shared/errorHandler.js";

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
  field: "rawBody", // onde o corpo cru será armazenado
  global: false,    // só ativaremos em rotas específicas
});

// 🌍 CORS — permite o frontend acessar a API
app.register(fastifyCors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      env.FRONTEND_URL || "http://localhost:5173",
      "https://coldbreeze.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true); // ✅ permite a requisição
    } else {
      cb(new Error("Origin not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
app.register(orderRoutes, { prefix: "/orders" });
app.register(paymentRoutes, { prefix: "/payments" });

// 🔥 Handler global de erros (centralizado)
setupErrorHandler(app);
