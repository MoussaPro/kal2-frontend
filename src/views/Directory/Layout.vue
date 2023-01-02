<template>
  <div class="auth-content">
    <UnderTopLogged v-if="menu" :menu="menu"></UnderTopLogged>
    <Block class="mt-5">
        <router-view></router-view>
    </Block>
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