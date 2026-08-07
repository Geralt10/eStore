import app from "./src/app.js";
import {config}  from "./src/config/config.js";
import { connectDatabase } from "./src/config/db.js";


const port = Number.parseInt(config.PORT ?? "3000", 10);

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.info(`Server listening on port ${port}.`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server.", error);
  process.exitCode = 1;
});
