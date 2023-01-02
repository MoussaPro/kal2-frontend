<template>
  <Top v-if="!auth.check() && route.fullPath !== '/login' && route.fullPath !== '/register'" />
  <TopLogged v-if="auth.check()" />
  <router-view :key="route.fullPath"></router-view>
</template>
<script setup>
  import { useRoute } from "vue-router/dist/vue-router";
  import { Auth } from "@/store/auth";
  import { onErrorCaptured, ref, watch } from "vue";

  const auth = Auth();
  const error = ref(false);
  const route = useRoute()

  onErrorCaptured((e) => {
    error.value = true;
  });

  watch(route, async (from, to) => {
    error.value = false;
  });
</script>