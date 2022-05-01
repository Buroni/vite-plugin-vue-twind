import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import CompositionAPIStyles from "./CompositionAPIStyles.ce.vue";
import CompositionAPINoStyles from "./CompositionAPINoStyles.ce.vue";
import ObjectAPIStyles from "./ObjectAPIStyles.ce.vue";
import ObjectAPINoStyles from "./ObjectAPINoStyles.ce.vue";

customElements.define("x-counter-styles", defineCustomElement(CompositionAPIStyles));
customElements.define("x-counter-nostyles", defineCustomElement(CompositionAPINoStyles));
customElements.define("x-counter-obj-styles", defineCustomElement(ObjectAPIStyles));
customElements.define("x-counter-obj-nostyles", defineCustomElement(ObjectAPINoStyles));

createApp(App).mount("#app");
