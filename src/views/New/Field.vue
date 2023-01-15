<template>
  <div class="auth-content pb-20">
    <Layout-Block class="mt-5">
      <div class="p-10">
        <div id="topScroller" class="h-2 w-2"></div>
        <Api-Local-Loading :loading="loading"/>
        <Api-Local-Error :error="error" :message="errorMsg" class="mb-5"/>
        <Layout-BlockTitle title="Opret ny skabelon" class="mb-5"/>
        <input type="text" id="title" name="title" v-model="title" class="input-field-non-border" placeholder="Navngiv skabelonen">

        <div class="mt-6">
          <div class="mt-5" v-for="(field, index) in fields" :key="field.id+field.type+field.value">
            <Inputs-Fields-Input :type="field.type" :index="index" :id="field.id" :title="field.title" :value="field.value" @changes="fieldObj => setFields(fieldObj, index)" @delete="deleteField(fields, index)"/>
          </div>

          <div class="text-primary-Darker1 tracking-[0.45px] mt-3 ml-[1px] font-inter font-medium text-[13px] inline-flex border-b border-primary-Darker1 items-center cursor-pointer hover-transition hover:opacity-75" @click="addField(fields)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-[1px]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
            </svg>
            Tilføj ny felt
          </div>
        </div>
      </div>

      <div class="w-full bg-gray-50 px-10 py-4 rounded-md">
        <div class="flex items-center">
          <input type="checkbox" id="primary" name="primary" v-model="primary">
          <label for="primary" class="cursor-pointer text-gray-600 mt-[1px] ml-2"> Sæt som primære</label>
        </div>
        <button class="bg-primary px-5 py-2 text-white rounded-md text-sm font-medium hover-transition mt-5 hover:bg-primary-Darker active:bg-primary-Darker1" @click="save">Gem skabelon</button>
      </div>
    </Layout-Block>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router/dist/vue-router";
  import fieldHandler from "@/composables/fieldHandler";

  const title = ref();
  const fields = ref([{
    id: Math.random(),
    type: '',
    title: 'Overskrift',
    value: ''
  }]);
  const primary = ref();
  const loading = ref();
  const error = ref();
  const errorMsg = ref();
  const router = useRouter();
  const { addField, deleteField } = fieldHandler();

  const setFields = (obj, index) => {
    fields.value[index] = obj;
  }

  const save = async () => {
    const el = document.getElementById('topScroller');
    error.value = false;

    if (!title.value) {
      error.value = true;
      errorMsg.value = 'Angiv venligst et navn til dit skabelon';
      if (el) {
        el.scrollIntoView();
      }
      return false;
    }

    fields.value.forEach(n => {
      if (!n.type) {
        error.value = true;
        errorMsg.value = 'Angiv venligst en type for felt';
        if (el) {
          el.scrollIntoView();
        }
        return false;
      }

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

      await axios.post('/fields', {
        title: title.value,
        fields: fields.value,
        primary: primary.value
      }, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        loading.value = false;
        router.push({ path: '/directory/fields' });
      }).catch((response) => {
        error.value = true;
        if (el) {
          el.scrollIntoView();
        }
        errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
        loading.value = false;
      });
    } else {
      return false;
    }
  }
</script>