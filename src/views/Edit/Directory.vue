<template>
  <div class="auth-content pb-20">
    <Api-Server-Loading v-if="loading && !errorApiLoader" class="mt-5"/>
    <Api-Server-Error v-if="errorApiLoader" :error="errorApiLoader" class="mt-5"/>

    <div v-if="!loading">
      <Layout-Block class="mt-5">
        <div class="p-10">
          <div id="topScroller" class="h-2 w-2"></div>
          <Api-Local-Loading :loading="loading"/>
          <Api-Local-Error :error="error" :message="errorMsg" class="mb-5"/>
          <Api-Local-Success :success="success" :message="successMsg" class="mb-5"/>
          <Layout-BlockTitle title="Rediger kartotek" class="mb-5"/>
          <input type="text" id="title" name="title" v-model="title" class="input-field-non-border" placeholder="Navngiv skabelonen">


          <div v-for="(field, index) in apiData.fields" :key="field.id + ' ' + field.value">
            <div class="relative">
              <div v-if="index !== 0" @click="deleteField(apiData.fields, index)" class="text-red-500 hover-transition hover:text-red-700 cursor-pointer absolute left-[-35px] top-[27px]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <input type="search" class="bg-gray-50 border-gray-200 border-2 border-dashed mt-5 px-2 py-1 w-[400px] rounded text-[13px] text-gray-600 focus:outline-gray-300 focus:border-gray-300 active:border-gray-300" @blur="setFields({ id: field.id, title: field.title }, index)" v-model="field.title"/>
            </div>
          </div>

          <div class="text-primary-Darker1 tracking-[0.45px] mt-2 ml-[2px] font-inter font-medium text-[13px] inline-flex border-b border-primary-Darker1 items-center cursor-pointer hover-transition hover:opacity-75" @click="addFieldDirectory(apiData.fields)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-[1px]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            Tilføj ny værdi holder
          </div>
        </div>

        <div class="w-full bg-gray-50 px-10 py-4 rounded-md">
          <div class="flex items-center mt-5">
            <button class="bg-primary px-5 py-2 text-white rounded-md mr-5 text-sm font-medium hover-transition hover:bg-primary-Darker active:bg-primary-Darker1" @click="save">Gem kartotek</button>
            <div class="text-red-500 text-sm underline font-medium cursor-pointer hover-transition hover:text-red-700" @click="deleteDirectory">Slet kartotek</div>
          </div>
        </div>
      </Layout-Block>
    </div>
  </div>
</template>
<script setup>
  import { useRoute, useRouter } from "vue-router/dist/vue-router";
  import { onMounted, ref } from "vue";
  import axios from "axios";
  import fieldHandler from "@/composables/fieldHandler";
  const { addFieldDirectory, deleteField } = fieldHandler();

  const route = useRoute();
  const router = useRouter();
  const apiData = ref();
  const loading = ref(true);
  const errorApiLoader = ref();
  const error = ref();
  const title = ref();
  const errorMsg = ref();
  const success = ref();
  const successMsg = ref();

  onMounted(() => {
    try {
      axios.get('/directory/'+route.params.id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        // Parse json
        apiData.value.fields = JSON.parse(apiData.value.fields);
        // For v-model to set checked, it need to be true instead of 1
        if (apiData.value.is_primary === 1) {
          apiData.value.is_primary = true;
        }
        title.value = apiData.value.title;
        loading.value = false;
      }).catch((response) => {
        errorApiLoader.value = response;
      });
    } catch(e) {
      errorApiLoader.value = e;
    }
  });

  const setFields = (obj, index) => {
    apiData.value.fields[index] = obj;
  }

  const deleteDirectory = async() => {
    if (confirm('Er du sikker?')) {
      await axios.delete('/directory/'+route.params.id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        if (response.field === 1) {
          router.push('/directory');
        } else {
          error.value = true;
          errorMsg.value = 'Der opstod en fejl under sletning - fejlkode: '+response.response.status;
        }
      }).catch((response) => {
        error.value = true;
        errorMsg.value = 'Der opstod en fejl under sletning - fejlkode: '+response.response.status;
      });
    }
  }

  const save = async () => {
    const el = document.getElementById('topScroller');

    // Reset messages
    error.value = false;
    success.value = false;

    if (!title.value) {
      error.value = true;
      errorMsg.value = 'Angiv venligst et navn til dit kartotek';
      if (el) {
        el.scrollIntoView();
      }
      return false;
    }

    apiData.value.fields.forEach(n => {
      if (!n.title) {
        error.value = true;
        errorMsg.value = 'Angiv venligst en overskrift for felt';
        if (el) {
          el.scrollIntoView();
        }
        return false;
      }
    })

    if (!loading.value && !error.value) {
      loading.value = true;

      await axios.put('/directory/'+route.params.id, {
        title: title.value,
        fields: apiData.value.fields,
      }, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        loading.value = false;
        success.value = true;
        successMsg.value = 'Opdateret'
      }).catch((response) => {
        error.value = true;
        errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
        if (el) {
          el.scrollIntoView();
        }
        loading.value = false;
      });
    } else {
      return false;
    }
  }
</script>