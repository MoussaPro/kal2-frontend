<template>
  <h2 class="text-xl font-inter font-medium">{{ title }}</h2>
</template>
<script setup>
  const props = defineProps({
    title: {
      type: String,
    }
  })
</script>