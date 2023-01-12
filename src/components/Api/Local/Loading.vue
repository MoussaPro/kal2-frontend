<template>
  <div class="w-full h-full z-[200] bg-gray-200 absolute left-0 top-0 flex items-center justify-center hover-transition" v-if="loading">
    <div class="text-center text-lg text-gray-600">
      <img src="@/assets/images/loader.gif" class="w-20 mb-3 mx-auto" alt="loader"/>
      Indlæser...
    </div>
  </div>
</template>

<script setup>
  const props = defineProps(['loading'])
</script>