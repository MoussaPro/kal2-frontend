<template>
  <div class="w-full border-b border-gray-800 bg-gray-700 px-2 py-4 lg:px-16 shadow-md">
    <div class="content flex items-center justify-between">
      <img src="@/assets/images/logo_white.png" alt="kal2 logo" class="w-16 mx-auto lg:mx-0" v-if="route.path !== '/'"/>
      <div v-else></div>

      <nav class="text-white font-medium" :class="route.path !== '/' ? 'hidden lg:block' : ''">
        <ul class="flex space-x-10">
          <li><RouterLink to="/login" class="p-2 hover:bg-gray-800 rounded-md hover-transition">Log ind</RouterLink></li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router/dist/vue-router";

const route = useRoute();
</script>