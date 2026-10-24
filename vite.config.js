import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_PROXY_TARGET || `http://127.0.0.1:${env.PORT || 3001}`;
  const proxy = { "/api": { target, changeOrigin: true } };
  return {
    plugins: [react()],
    server: { host: "0.0.0.0", port: 5000, allowedHosts: true, watch: { ignored: ["**/output/**", "**/data/workforce/**"] }, proxy },
    preview: { proxy },
  };
});
