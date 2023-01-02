<template>
  <div>
    <Loading v-if="loading && !error"/>
    <Error v-if="error" :error="error"/>
  </div>
</template>
<script setup>
  const props = defineProps({
    loading: Boolean,
    error: Object,
    redirect404: Boolean
  });

  /** TODO REDIRECT 404 **/
</script>