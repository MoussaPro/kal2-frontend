<template>
  <div class="bg-primary-Darker text-xs px-5 w-full rounded-lg py-[8px] text-white font-inter font-bold flex items-center shadow-md" v-if="success">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    {{ message }}
  </div>
</template>
<script setup>
const props = defineProps({
  success: Boolean,
  message: String
})
</script>