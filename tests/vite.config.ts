import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueTwind from "../dist/index.js";

export default defineConfig({
  plugins: [vue(), vueTwind()],
})
