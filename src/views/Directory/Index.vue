<template>
  <div class="relative">
    <Api-Server-Loading v-if="loading && !error"/>
    <Api-Server-Error v-if="error" :error="error"/>

    <div v-if="!loading && !error" class="p-10">
      <Layout-BlockTitle title="Kartotek"/>
      <RouterLink to="/new/directory" class="w-full flex items-center p-2 mb-5 relative bg-gray-100 rounded-md text-gray-600 border-2 border-dotted border-gray-300 hover-transition hover:bg-gray-300 hover:border-gray-400 my-2">
        <div class="h-full flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-10 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-lg font-medium">Opret ny kartotek</div>
        </div>
      </RouterLink>

      <div v-for="directory in directories" class="w-full flex justify-between items-center p-2 relative bg-gray-100 rounded-md text-gray-600 border border-gray-300 hover-transition my-2">
        <div class="h-full flex justify-center items-center">
          <div class="w-10 h-10 rounded-full bg-gray-500 mr-3 flex items-center justify-center text-white text-xl font-inter">{{ directory.title.substring(0,1) }}</div>
          <div class="text-lg font-medium">{{ directory.title }}</div>
        </div>
        <div class="flex items-center space-x-6 font-inter text-xs mr-2">
          <RouterLink to="#" class="hover-transition hover:underline flex items-center hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Vis data
          </RouterLink>
          <RouterLink :to="'/edit/directory/'+directory.id" class="hover-transition hover:underline flex items-center hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[15px] mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
            Rediger
          </RouterLink>
        </div>
      </div>
      </div>
  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";
  import axios from "axios";

  const directories = ref();
  const loading = ref(true);
  const error = ref();

  onMounted(() => {
    try {
      axios.get('/directories', {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        directories.value = response.directories;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  });
</script>