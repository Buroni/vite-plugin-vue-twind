import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueTwind from "vite-plugin-vue-twind/dist";

export default defineConfig({
  plugins: [vue(), vueTwind()],
})
