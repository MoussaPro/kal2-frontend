<template>
  <div class="auth-content pb-20">
    <Layout-Block class="mt-5">
      <div class="p-10">
        <div id="topScroller" class="h-2 w-2"></div>
        <Api-Local-Error :error="error" :message="errorMsg" class="mb-5"/>
        <Layout-BlockTitle title="Opret ny kartotek" class="mb-5"/>
        <Api-Local-Loading :loading="loading"/>
        <input type="text" id="title" name="title" v-model="title" class="input-field-non-border" placeholder="Navngiv kartotek">

        <div class="mb-5 mt-2">
          <div class="text-gray-700 text-xs font-inter font-medium">Kartotek skabeloner:</div>
          <div class="flex flex-wrap items-center text-xs space-x-3 mt-1">
            <div :class="recommendedClass(null)" @click="setRecommended(null)">Opret egen</div>
            <div :class="recommendedClass('employees')" @click="setRecommended('employees')">Medarbejdere</div>
            <div :class="recommendedClass('product')" @click="setRecommended('product')">Varer</div>
            <div :class="recommendedClass('customer')" @click="setRecommended('customer')">Kunder</div>
          </div>
        </div>

        <div v-for="(field, index) in directory" v-if="directory && directory.length" :key="field.id">
          <div class="relative mt-5">
          <div v-if="index === 0" class="text-gray-500 text-xs font-medium mb-1">( Identifikations felt )</div>
            <div v-if="index !== 0" @click="deleteField(directory, index)" class="text-red-500 hover-transition hover:text-red-700 cursor-pointer absolute left-[-35px] top-[9px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <input type="text" class="bg-gray-50 border-gray-200 border-2 border-dashed px-2 py-1 w-[400px] h-9 rounded text-[13px] text-gray-600 focus:outline-gray-300 focus:border-gray-300 active:border-gray-300 placeholder:text-gray-500" placeholder="Angiv værdi holder" @blur="setField({ id: field.id, title: field.title }, index)" v-model="field.title"/>
          </div>
        </div>
        <div class="text-primary-Darker1 tracking-[0.45px] mt-3 ml-[1px] font-inter font-medium text-[13px] inline-flex border-b border-primary-Darker1 items-center cursor-pointer hover-transition hover:opacity-75" @click="addFieldDirectory(directory)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-[1px]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          Tilføj ny værdi holder
        </div>
      </div>

      <div class="w-full bg-gray-50 px-10 py-4 rounded-md">
        <button class="bg-primary px-5 py-2 text-white rounded-md text-sm font-medium hover-transition hover:bg-primary-Darker active:bg-primary-Darker1" @click="create">Opret kartotek</button>
      </div>
    </Layout-Block>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";
  import axios from "axios";
  import { useRouter } from "vue-router/dist/vue-router";
  const { addFieldDirectory, deleteField } = fieldHandler();

  const title = ref();
  const recommended = ref(null);
  const standard = { id: Math.random(), title: '' };
  const saved = ref([standard]); // Saved when going back from recommended
  const directory = ref([standard]);
  const loading = ref();
  const error = ref();
  const errorMsg = ref();
  const router = useRouter();

  const recommendedClass = (selected) => {
    let defaultClass = 'font-inter font-medium rounded-lg shadow hover-transition px-2 py-[2px]';
    if (recommended.value === selected) {
      defaultClass += ' bg-primary text-white';
    } else {
      defaultClass += ' bg-gray-200 text-gray-700 hover:bg-primary cursor-pointer hover:text-white hover:scale-[102%]'
    }
    return defaultClass;
  };

  const setRecommended = (r) => {
    recommended.value = r;

    switch(r) {
      case null:
        title.value = null;
        directory.value = saved.value;
        break;
      case 'employees':
        title.value = 'Medarbejdere'
        directory.value = [
          { id: Math.random(), title: 'Fornavn' },
          { id: Math.random(), title: 'Efternavn' },
          { id: Math.random(), title: 'Email' },
          { id: Math.random(), title: 'Telefon' },
          { id: Math.random(), title: 'Stilling' },
          { id: Math.random(), title: 'Afdeling' },
          { id: Math.random(), title: 'Ansat siden' },
        ];
        break;
      case 'product':
        title.value = 'Varer'
        directory.value = [
          { id: Math.random(), title: 'Varenavn' },
          { id: Math.random(), title: 'Varenummer' },
          { id: Math.random(), title: 'Pris' },
          { id: Math.random(), title: 'Omkostning' },
          { id: Math.random(), title: 'Antal på lager' },
        ];
        break;
      case 'customer':
        title.value = 'Kunder'
        directory.value = [
          { id: Math.random(), title: 'Navn' },
          { id: Math.random(), title: 'Adresse' },
          { id: Math.random(), title: 'Kunde nummer' },
          { id: Math.random(), title: 'Status' },
        ];
        break;
      default:
        title.value = null
        directory.value = [standard];
    }
  }

  const setField = (obj, index) => {
    directory.value[index] = obj;

    if (recommended.value === null) {
      saved.value[index] = obj;
    }
  }

  const create = async () => {
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

    directory.value.forEach(n => {
      if (!n.title) {
        error.value = true;
        errorMsg.value = 'Angiv venligst en overskrift for felt';
        if (el) {
          el.scrollIntoView();
        }
        return false;
      }
    });

    if (!loading.value && !error.value) {
      loading.value = true;

      await axios.post('/directory', {
        title: title.value,
        fields: directory.value,
      }, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        loading.value = false;
        if (response.directory.id) {
          router.push({ path: '/edit/directory/data/' + response.directory.id })
        } else {
          router.push({ path: '/directory' });
        }
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