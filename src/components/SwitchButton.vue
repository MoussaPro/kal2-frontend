<template>
  <div class="mt-2 flex items-center">
    <label class="switch">
      <input type="checkbox" @click.stop="$emit('clicked')">
      <span class="slider round"></span>
    </label>
    <p class="ml-2 font-inter text-[12px] text-gray-700">{{ title }}</p>
  </div>
</template>
<script setup>
  const props = defineProps({
    title: String
  });
</script>