import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueTwind from "./plugin.js";

export default defineConfig({
  plugins: [vue(), vueTwind()],
})
