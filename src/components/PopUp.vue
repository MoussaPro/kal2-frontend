<template>
  <div class="w-[100vw] h-[100vh] bg-black/60 fixed left-0 top-0 z-[99999] flex items-center justify-center hover-transition">
    <div class="w-[600px] bg-white shadow-2xl border border-gray-200 relative" :class="boxClass" v-click-outside="clickedOutside">
      <div class="absolute right-[-40px] top-[-1px] w-[40px] h-[40px] rounded-r-2xl bg-gray-200 flex items-center z-[201] justify-center shadow-xl hover-transition hover:bg-gray-300 cursor-pointer" v-if="!loading" @click="$emit('close')">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="text-gray-700 w-6 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div v-if="title" class="text-black text-xl font-medium font-inter pl-2">{{ title }}</div>
      <div class="relative w-full" :class="[{'overflow-y-scroll': overflowY}, innerBoxClass]">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
  const props = defineProps({
    title: String,
    outside: {
      type: Boolean,
      default: false
    },
    boxClass: String,
    innerBoxClass: String,
    overflowY: Boolean,
    loading: {
      type: Boolean,
      default: false
    }
  });
  const emit = defineEmits(['close'])

  const clickedOutside = () => {
    if (props.outside) {
      emit('close');
    }
  }
</script>