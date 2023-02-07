<template>
  <div class="relative">
    <Api-Server-Loading v-if="loading && !error"/>
    <Api-Server-Error v-if="error" :error="error"/>

    <div v-if="!loading && !error" class="p-10">
      <Layout-BlockTitle title="Udregning af data" class="mb-2"/>
      sd
    </div>

  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";

  const directories = ref();
  const loading = ref(false);
  const error = ref();

  onMounted(() => {

  });
</script>