<template>
  <div class="w-full rounded-md flex flex-col justify-center items-center text-gray-700 border-2 border-dashed border-gray-300 hover-transition cursor-pointer bg-gray-50 hover:bg-gray-200 hover:border-gray-600" :class="css">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[95px] -mt-2 text-primary-Darker1">
      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
    </svg>
    <div class="text-lg mt-2 font-medium">{{ text }}</div>
    <div class="text-xs invisible cursor-none" v-if="showInvisible">.</div>
  </div>
</template>
<script setup>
  const props = defineProps({
    css: String,
    text: String,
    showInvisible: Boolean
  })
</script>