import { app } from "./app.js";
import { env } from "./env/index.js";

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log(`🔥 Server running on http://localhost:3333`);
});
