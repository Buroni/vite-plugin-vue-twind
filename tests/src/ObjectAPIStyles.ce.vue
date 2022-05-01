<script>
export default {
  data() {
    return {
      count: 0
    }
  },
};
</script>

<template>
  <div data-cy="object-api-styles">
    <div class="bg-red-500 w-96" id="counter-el">Counter: {{ count }}</div>
    <button @click="count++" :class="[
      `w-96`,
      {'bg-green-200': count === 0, 'bg-yellow-200': count === 1, 'bg-red-200': count >= 2 }
    ]">Increment</button>
  </div>
</template>

<style>
div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

button {
    font-size: 24px;
}
</style>
