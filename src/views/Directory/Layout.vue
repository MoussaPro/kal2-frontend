<template>
  <div class="auth-content">
    <Layout-UnderTopLogged v-if="menu" :menu="menu"></Layout-UnderTopLogged>
    <Layout-Block class="mt-5">
        <router-view></router-view>
    </Layout-Block>
  </div>
</template>
<script setup>

  const menu = [
    {
      title: 'Kartotek',
      slug: '/directory'
    },
    {
      title: 'Felter',
      slug: '/directory/fields'
    },
  ];
</script>