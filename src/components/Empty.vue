<template>
  <div class="flex flex-col items-center justify-center py-8 text-gray-600 font-inter">
    <img src="@/assets/images/empty.png" class="w-[100px]" alt="Empty icon"/>
    <div class="text-[13.5px] mt-2 font-light">{{ text }}</div>
    <button @click="$emit('btnClick')" class="bg-gray-700 text-white text-[13px] mt-3 px-5 py-2 rounded-md hover-transition hover:bg-gray-600">{{ textBtn }}</button>
  </div>
</template>
<script setup>
  const props = defineProps({
    text: String,
    textBtn: String
  });
</script>