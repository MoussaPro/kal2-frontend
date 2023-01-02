<template>
  <div class="auth-content pb-20">
    <ApiLoader :error="errorApiLoader" :redirect404="true" :loading="loading" class="mt-5" />

    <div v-if="!loading">
      <Block class="mt-5">
        <div class="p-10">
          <Loader :loading="loading"/>
          <ErrorMsg :error="error" :message="errorMsg" class="mb-5"/>
          <SuccessMsg :success="success" :message="successMsg" class="mb-5"/>
          <BlockTitle title="Rediger skabelon" class="mb-5"/>
          <input type="text" id="title" name="title" v-model="title" class="input-field-non-border" placeholder="Navngiv skabelonen">

          <div class="mt-6">
            <div class="mt-5" v-for="(field, index) in apiData.fields" :key="field.id">
              <CreateField :type="field.type" :index="index" :id="field.id" :title="field.title" :value="field.value" @changes="fieldObj => setFields(fieldObj, index)" @delete="deleteField(apiData.fields, index)"/>
            </div>

            <div class="text-primary-Darker1 tracking-[0.45px] mt-2 ml-[2px] font-inter font-medium text-[13px] inline-flex border-b border-primary-Darker1 items-center cursor-pointer hover-transition hover:opacity-75" @click="addField(apiData.fields)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-[1px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Tilføj ny felt
            </div>
          </div>
        </div>

        <div class="w-full bg-gray-50 px-10 py-4 rounded-md">
          <div class="flex items-center">
            <input type="checkbox" id="primary" name="primary" v-model="apiData.is_primary">
            <label for="primary" class="cursor-pointer text-gray-600 mt-[1px] ml-2">Sæt som primære</label>
          </div>

          <div class="flex items-center mt-5">
            <button class="bg-primary px-5 py-2 text-white rounded-md mr-5 text-sm font-medium hover-transition hover:bg-primary-Darker active:bg-primary-Darker1" @click="save">Gem skabelon</button>
            <div class="text-red-500 text-sm underline font-medium cursor-pointer hover-transition hover:text-red-700" @click="deleteTemplate">Slet skabelon</div>
          </div>

        </div>
      </Block>
    </div>
  </div>
</template>
<script setup>
  import { useRoute } from "vue-router/dist/vue-router";
  import { onMounted, ref } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  import fieldHandler from "@/composables/fieldHandler";
  const { addField, deleteField } = fieldHandler();

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
  const testerData = ref(['æble', 'skorpion']);

  const setFields = (obj, index) => {
    apiData.value.fields[index] = obj;
  }

  onMounted(() => {
    try {
      axios.get('/field/'+route.params.id, {
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

  const deleteTemplate = async() => {
    if (confirm('Er du sikker?')) {
      await axios.delete('/field/'+route.params.id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        if (response.field === 1) {
          router.push('/directory/fields');
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
    error.value = false;

    if (!title.value) {
      error.value = true;
      errorMsg.value = 'Angiv venligst et navn til dit skabelon';
      return false;
    }

    apiData.value.fields.forEach(n => {
      if (!n.type) {
        error.value = true;
        errorMsg.value = 'Angiv venligst en type for felt';
        return false;
      }

      if (!n.title) {
        error.value = true;
        errorMsg.value = 'Angiv venligst en overskrift for felt';
        return false;
      }
    })

    if (!loading.value && !error.value) {
      loading.value = true;

      await axios.put('/field/'+route.params.id, {
        title: title.value,
        fields: apiData.value.fields,
        primary: apiData.value.is_primary
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
        loading.value = false;
      });
    } else {
      return false;
    }
  }
</script>