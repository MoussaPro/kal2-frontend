<template>
  <h1 class="text-xl font-inter font-medium">{{ title }}</h1>
</template>
<script setup>
  const props = defineProps({
    title: {
      type: String,
    }
  })
</script>