<template>
  <div class="relative">
    <Api-Server-Loading v-if="loading && !error"/>
    <Api-Server-Error v-if="error" :error="error"/>

    <div v-if="!loading && !error" class="p-10">
      <Layout-BlockTitle title="Felter skabeloner"/>
      <div class="grid gap-5 grid-cols-3 mt-3">
        <div v-for="field in fields" class="w-full bg-gray-100 rounded-md text-gray-500 border-2 border-gray-300 hover-transition cursor-pointer hover:bg-gray-300 hover:border-gray-400 h-[300px]">
          <RouterLink :to="'/edit/field/'+field.id" class="h-full flex flex-col justify-center items-center">
            <div class="w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl font-inter">{{ field.title.substring(0,1) }}</div>
            <div class="text-lg mt-5 font-medium">{{ field.title }}</div>
            <div class="text-primary-Darker1 font-semibold text-xs" v-if="field.is_primary">Primære skabelon</div>
          </RouterLink>
        </div>
        <RouterLink to="/new/field">
          <CreateNewBox css="h-[300px]" text="Opret ny skabelon"/>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import axios from "axios";

  const fields = ref();
  const loading = ref(true);
  const error = ref();

  onMounted(() => {
    try {
      axios.get('/fields', {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        fields.value = response.fields;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  })
</script>