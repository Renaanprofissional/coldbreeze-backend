import { FastifyInstance } from "fastify";
import { authGuard } from "@/shared/middlewares.js";
import { OrderController } from "./controller.js";

export async function orderRoutes(app: FastifyInstance) {
  // 🧱 Garante que todas as rotas exijam autenticação
  app.addHook("preHandler", authGuard);

  // ✅ Listar e buscar pedidos
  app.get("/", OrderController.list);
  app.get("/:id", OrderController.get);

  // ✅ Criar novo pedido
  app.post("/", OrderController.create);

  // ✅ Cancelar pedido
  app.patch("/:id/cancel", OrderController.cancel);

  // ✅ Excluir pedido (somente cancelado)
  app.delete("/:id", OrderController.remove);
}
