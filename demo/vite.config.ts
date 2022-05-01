import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import vueTwind from "../src/index";

export default defineConfig({
  plugins: [vue(), vueTwind()],
})
