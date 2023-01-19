<template>
  <transition>
    <div class="bg-primary-Darker text-xs px-5 w-full rounded-lg py-[8px] text-white font-inter font-bold flex items-center shadow-md" v-if="success && hideAfter">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ message }}
    </div>
  </transition>
</template>
<script setup>
  import { onMounted, ref } from "vue";

  const props = defineProps({
    success: Boolean,
    message: String,
    hideMsg: Boolean
  });
  const hideAfter = ref(true);

  onMounted(() => {
    if (props.hideMsg) {
      setTimeout(() => {
        hideAfter.value = false;
      }, 5000);
    }
  });
</script>
<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>