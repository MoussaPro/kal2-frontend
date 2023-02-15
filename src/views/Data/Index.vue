<template>
  <div class="relative">
    <Api-Server-Loading v-if="loading && !error"/>
    <Api-Server-Error v-if="error" :error="error"/>

    <div v-if="!loading && !error" class="p-10">
      <Layout-BlockTitle title="Udregning af data" class="mb-2"/>

      <DataSearcher :containerFields="containerFields" :containerDirectories="containerDirectories" />
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";
  import axios from "axios";

  const loading = ref(false);
  const error = ref();
  const containerFields = ref();
  const containerDirectories = ref();

  onMounted(() => {
    loading.value = true;

    try {
      axios.get('/data/search/index', {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        containerFields.value = response.fields;
        containerDirectories.value = response.directories;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  });
</script>