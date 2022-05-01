# vite-plugin-vue-twind
Generates tailwind CSS from Vue 3 component class names, and injects them into the component or emits them. 

# Motivation

There's been [a lot of discussion](https://github.com/tailwindlabs/tailwindcss/discussions/1935) on how to use tailwind with web components that use shadow DOM.
Adding the entire tailwind library CSS into each web component instance is a common solution, but results in very bloated components. This plugin extracts the tailwind classnames from 
Vue 3 SFCs and injects into only the tailwind CSS used by the component into the component.

This method is a better alternative until [constructable stylesheets](https://web.dev/constructable-stylesheets/) are widely supported, and usable by Vue's web component API.

# Installation

`twind` is a peer dependency

```
npm install twind vite-plugin-vue-twind --save-dev
```

# Usage

By default, the plugin will only be applied to [Vue custom elements](https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue) ending in `.ce.vue`

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueTwind from "vite-plugin-vue-twind";

export default defineConfig({
  plugins: [
    vue(), 
    vueTwind(), // The plugin should appear after `vue()`
  ],
});
```

# Configuration

### `include: string[]`

Default: `["**/*.ce.vue"]`

Glob pattern matching files that the plugin should be applied to.

--------

### `exclude: string[]`

Default: `[]`

Glob pattern matching files that the plugin should be excluded from.

--------

### `mode: "inject" | "emit"`

Default: `"inject"`

If `"inject"` then extracted tailwind styles will be injected into the relevant Vue web component. 
If `"emit"` then styles will be emitted as CSS files.

--------

### `emittedFileName: string`

Default: `"[name].[ext]"`

If `mode` is `"emit"` then this format will be used to generate the CSS files.

Note that the `[name]` and `[ext]` placeholders refer to the name and extension of the relevant Vue component file. The `.css` extension is added automatically.

--------

### `twindConfig: twind.Configuration | undefined`

Default: `undefined`

`twind` configuration object to be used by the plugin when generating styles.

