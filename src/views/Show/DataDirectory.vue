<template>
  <div class="content pb-20">
    <Api-Server-Loading v-if="loading && !errorApiLoader" class="mt-5"/>
    <Api-Server-Error v-if="errorApiLoader" :error="errorApiLoader" class="mt-5"/>

    <Layout-Block class="mt-5" v-if="!errorApiLoader">
      <Layout-BlockTitle title="Tester" />
    </Layout-Block>
  </div>
</template>

<script setup>
  import { useRoute, useRouter } from "vue-router/dist/vue-router";
  import { onBeforeMount, ref } from "vue";
  import axios from "axios";

  const route = useRoute();
  const router = useRouter();
  const apiData = ref();
  const loading = ref(true);
  const errorApiLoader = ref();
  const error = ref();

  onBeforeMount(() => {
    try {
      axios.get('directory/data/'+route.params.id+'/'+route.params.data_id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        console.log(response);
        apiData.value = response;
        loading.value = false;
      }).catch((response) => {
        errorApiLoader.value = response;
      });
    } catch(e) {
      errorApiLoader.value = e;
    }
  });
</script>