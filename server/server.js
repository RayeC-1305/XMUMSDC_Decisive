import "dotenv/config";
import http from "node:http";
import { createApp } from "./app.js";

const { app, evidence } = createApp();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";
const server = http.createServer(app);
server.requestTimeout = 30000;
server.headersTimeout = 10000;
server.on("error", error => {
  console.error(`Could not start the API at ${host}:${port}: ${error.code || error.message}. Set PORT to an available port.`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`NexusTalent API listening at http://${host}:${port}`);
  console.log("Rules baseline; public research metadata; no GPU or model credentials required.");
  if (process.env.TREND_AUTO_REFRESH !== "false") evidence.refresh().then(state => console.log(`Public evidence: ${state.status}; ${state.sources.length} sources.`));
});
let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  server.close(() => process.exit(0));
  setTimeout(() => { server.closeAllConnections(); process.exit(0); }, 5000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
