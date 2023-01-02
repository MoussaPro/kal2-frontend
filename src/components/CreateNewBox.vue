<template>
  <div class="w-full rounded-md flex flex-col justify-center items-center text-gray-500 border-2 border-dotted border-gray-300 hover-transition cursor-pointer hover:bg-gray-300 hover:border-gray-400" :class="css">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div class="text-lg mt-2 font-medium">{{ text }}</div>
  </div>
</template>
<script setup>
  const props = defineProps({
    css: String,
    text: String,
  })
</script>