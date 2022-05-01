<script setup lang="ts">
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <div data-cy="composition-api-no-styles">
    <div class="bg-red-500 w-96" id="counter-el">Counter: {{ count }}</div>
    <button @click="count++" :class="[
      `w-96`,
      {'bg-green-200': count === 0, 'bg-yellow-200': count === 1, 'bg-red-200': count >= 2 }
    ]">Increment</button>
  </div>
</template>
