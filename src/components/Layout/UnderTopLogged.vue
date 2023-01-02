<template>
  <div class="bg-gray-800 w-full rounded-b -mt-[2px] font-inter font-light tracking-wide text-[14px] text-white flex items-center justify-center relative shadow-md">
    <RouterLink :key="$route.fullPath" exact-active-class="bg-gray-900 font-medium" :to="menu.slug" v-for="menu in menu" class="hover-transition hover:bg-gray-900 px-6 py-3">{{ menu.title }}</RouterLink>
  </div>
</template>
<script setup>
  const props = defineProps({
    menu: {
      type: Object
    }
  });
</script>