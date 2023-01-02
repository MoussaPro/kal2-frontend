<template>
  <div>
    Logget ud
  </div>
</template>
<script setup>
  import { Auth } from "@/store/auth";

  const auth = Auth();

  auth.logout();
</script>