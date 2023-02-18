<template>
  <div class="relative">
    <Api-Server-Loading v-if="loading && !error"/>
    <Api-Server-Error v-if="error" :error="error"/>

    <div v-if="!loading && !error" class="p-10">
      <Layout-BlockTitle title="Kartotek skabeloner" class="mb-2"/>
      <RouterLink to="/new/directory" class="relative flex justify-between items-center space-x-3 bg-gray-50 rounded-lg border-2 hover-transition hover:bg-gray-200 border-gray-300 border-dashed px-6 py-5 shadow-sm hover:border-gray-600 mb-5">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-11 text-primary-Darker1">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-lg font-medium">Opret ny kartotek</div>
          </div>
        </div>
      </RouterLink>

      <Div v-for="directory in directories" :key="directory.id" class="relative flex justify-between hover-transition items-center space-x-3 mb-2 rounded-lg border border-gray-300 hover:border-gray-400 shadow-sm bg-white px-6 py-5">
        <RouterLink :to="'/edit/directory/data/'+directory.id" class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 bg-gray-500 text-gray-100 flex items-center justify-center rounded-full">{{ directory.title.substring(0,1) }}</div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ directory.title }}</p>
          </div>
        </RouterLink>
        <div class="flex items-center space-x-6 font-inter text-xs mr-2">
          <RouterLink :to="'/edit/directory/data/'+directory.id" class="hover-transition hover:underline flex items-center hover:text-gray-800">
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