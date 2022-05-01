<template>
  <div class="comment">With Composition API and `style` tag included:</div>
  <x-counter-styles></x-counter-styles>
 <div class="comment">With Composition API and no `style` tag:</div>
  <x-counter-nostyles></x-counter-nostyles>
 <div class="comment">With Object API `style` tag included:</div>
  <x-counter-obj-styles></x-counter-obj-styles>
 <div class="comment">With Object API and no `style` tag:</div>
  <x-counter-obj-nostyles></x-counter-obj-nostyles>
</template>

<style>
.comment {
    padding-top: 2rem;
}
</style>