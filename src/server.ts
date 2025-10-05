import { app } from "./app.js";
import { env } from "./env/index.js";

// ⚙️ Adiciona parser pra capturar o corpo cru (necessário pro Stripe)
app.addContentTypeParser(
  "application/json",
  { parseAs: "buffer" },
  (req, body, done) => {
    (req as any).rawBody = body; // salva o Buffer original na req
    try {
      const json = JSON.parse(body.toString());
      done(null, json);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
);

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 Server running on http://localhost:3333`);
});
