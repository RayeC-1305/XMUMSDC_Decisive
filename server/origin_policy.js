// A Vite-proxied request has a rewritten Host header, but retains the browser's
// original Origin (including the public preview port). Keep that exception
// restricted to this workspace's exact development hostname.
export function isAllowedOrigin(origin, requestHost, { developmentDomain, extraOrigins = [] } = {}) {
  if (!origin) return true; // CLI, server-to-server and ordinary same-origin GETs.
  let url;
  try { url = new URL(origin); }
  catch { return false; }
  if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin) return false;
  if (extraOrigins.includes(origin)) return true;
  if (url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return true;
  // Browsers control Host and Origin. Do not trust arbitrary X-Forwarded-Host.
  // This also supports the app's own published/custom host without a wildcard.
  if (requestHost && url.host === requestHost.toLowerCase()) return true;
  if (!developmentDomain || url.protocol !== "https:") return false;
  let developmentHostname;
  try { developmentHostname = new URL(`https://${developmentDomain}`).hostname; }
  catch { return false; }
  return url.hostname === developmentHostname && ["", "5000", "5173"].includes(url.port);
}
