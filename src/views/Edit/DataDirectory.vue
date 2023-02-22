<template>
  <div class="calendar-content pb-20">
    <Api-Server-Loading v-if="loading && !errorApiLoader" class="mt-5"/>
    <Api-Server-Error v-if="errorApiLoader" :error="errorApiLoader" class="mt-5"/>

    <div v-if="!loading">
      <Popups-DataDirectory-Create v-if="showCreateBox" @toggleCreateBox="toggleCreateBox" @save="create" :fields="apiData.fields"/>
      <Popups-DataDirectory-Edit v-if="showEditBox" @toggleEditBox="toggleEditBox" @save="edit" :fields="apiData.fields" :fieldData="activeEditData"/>

      <Teleport to="body">
        <transition>
          <div class="absolute w-full h-full bg-black/30 top-0 left-0 flex items-center justify-center transition-hover z-[500]" v-if="deleteBox">
            <div class="bg-gray-100 rounded-md drop-shadow-4xl w-[400px] border border-gray-300" v-click-outside="toggleDeleteBox">
              <div class="bg-gray-200 p-2 text-gray-500 font-medium text-sm">Bekræftelse</div>
              <div class="p-3 font-medium text-sm">Er du sikker på du vil slette data?</div>
              <div class="flex items-center p-3 mt-5">
                <button class="flex items-center bg-gray-200 py-3 px-5 rounded-lg text-sm text-gray-800 font-inter hover-transition hover:bg-primary hover:text-white" @click="toggleDeleteBox">Annuller</button>
                <button class="flex items-center text-white py-3 px-5 rounded-lg text-sm font-inter hover-transition ml-2" :disabled="deleteLoading" :class="deleteLoading ? 'bg-red-700' : 'bg-red-500 hover:bg-red-700'" @click="deleteData">
                  <span v-if="!deleteLoading">Slet data</span>
                  <span v-if="deleteLoading">Sletter...</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>

      <Layout-Block class="mt-5">
          <div id="topScroller" class="h-2 w-2"></div>
          <Api-Local-Loading :loading="loading"/>
          <Api-Local-Error :error="error" :message="errorMsg" class="mb-5"/>
          <Api-Local-Success :success="success" :message="successMsg" :hideMsg="true" class="mb-5"/>

          <div class="flex justify-between items-center p-4">
            <RouterLink :to="'/edit/directory/'+apiData.id">
              <Layout-BlockTitle :title="title" class="hover:text-gray-600 hover-transition"/>
            </RouterLink>
            <button class="bg-primary-Darker px-5 py-[10px] text-white flex items-center rounded-md text-sm font-medium hover-transition hover:bg-primary-Darker1 active:bg-primary-Darker1" v-if="apiData && apiData.data" @click="toggleCreateBox">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="w-4 mr-[5px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Opret ny data
            </button>
          </div>

          <div class="p-4 relative w-full rounded-md">
            <table class="w-full h-auto table-fixed text-[13px] shadow text-left text-gray-500" v-if="apiData && apiData.data">
              <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                <tr>
                  <th scope="col" class="px-3 py-3" v-for="field in apiData.fields">{{field.title}}</th>
                  <th scope="col" class="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b" :class="index % 2 === 1 ? 'bg-gray-50' : 'bg-white'" v-if="apiData && apiData.data" v-for="(data, index) in apiData.data">
                  <template v-for="(field, index) in apiData.fields">
                    <td class="px-3 py-4 font-normal overflow-x-scroll text-gray-800" :class="index === 0 ? 'underline hover:opacity-75 cursor-pointer' : ''">
                      <RouterLink :to="'/show/directory/data/' + route.params.id + '/' + data['id']" v-if="index === 0">{{ data[field.title] }}</RouterLink>
                      <span v-else>{{ data[field.title] }}</span>
                    </td>
                  </template>
                  <td class="px-3 py-4 text-primary-Darker1 hover-transition cursor-pointer font-medium">
                    <div @click="setDropDownIndex(index)" class="flex relative items-center justify-end">
                      Mere
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" :class="dropdownIndex === index ? 'rotate-180' : 'rotate-0'" class="w-[16px] ml-1 hover-transition">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    <MoreDropDown @delete="toggleDeleteBox(index)" @edit="toggleEditBox(data)" @show="$router.push('/show/directory/data/' + route.params.id + '/' + data['id'])" v-if="dropdownIndex === index" v-click-outside="setDropDownIndex" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <Empty :text="'Ingen '+apiData.title+' er oprettet'" class="border border-gray-200" textBtn="Opret ny data" @btnClick="toggleCreateBox" v-else/>
          </div>
      </Layout-Block>
    </div>
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
  const title = ref();
  const errorMsg = ref();
  const success = ref();
  const successMsg = ref();
  const showCreateBox = ref(false);
  const showEditBox = ref(false);
  const activeEditData = ref(null);
  const dropdownIndex = ref(null);
  const deleteBox = ref(false);
  const deleteDataId = ref();
  const deleteLoading = ref(false);

  const toggleCreateBox = () => {
    showCreateBox.value = !showCreateBox.value;
  }

  const toggleEditBox = (data) => {
    if (data) {
      activeEditData.value = data;
    } else {
      activeEditData.value = null;
    }
    showEditBox.value = !showEditBox.value;
  }

  const toggleDeleteBox = (id) => {
    // Set id to null as the first item index is 0
    if (id || id === 0) {
      deleteDataId.value = id;
    } else {
      deleteDataId.value = null;
    }
    deleteBox.value = !deleteBox.value;
  }

  const setDropDownIndex = (index) => {
    // Set index to null as the first item index is 0
    if (index || index === 0) {
      dropdownIndex.value = index;
    } else {
      dropdownIndex.value = null;
    }
  }

  const create = (fieldsObj) => {
    // Reset messages
    loading.value = true;
    error.value = false;
    success.value = false;

    // Bigger than 1 because ID is always filled
    if (Object.values(fieldsObj).length > 1) {
      // Push to existing data set or create new
      if (apiData.value.data) {
        apiData.value.data.push(fieldsObj);
      } else {
        apiData.value.data = [fieldsObj];
      }

      apiCall('Oprettet');

    } else {
      loading.value = false;
      error.value = true;
      errorMsg.value = "Udfyld venligst mindst en af felterne";
    }

    toggleCreateBox();
  }

  const edit = (fieldsObj) => {
    // Reset messages
    error.value = false;
    success.value = false;

    if (apiData.value.data) {
      // Change to the new values
      loading.value = true;
      apiData.value.data.map((field) => {
        if (field.id === fieldsObj.id) {
          field = fieldsObj;
        }
      });
      apiCall('Ændret');
    } else {
      loading.value = false;
      error.value = true;
      errorMsg.value = "Der opstod en fejl under ændringen";
    }

    toggleEditBox();
  }

  const deleteData = () => {
    if (deleteDataId.value || deleteDataId.value === 0) {
      deleteLoading.value = true;
      loading.value = true;
      apiData.value.data.splice(deleteDataId.value, 1);

      // If no fields, set to null instead of empty array
      if (Object.values(apiData.value.data).length === 0) {
        apiData.value.data = null;
      }
      apiCall('Slettet');
    } else {
      loading.value = false;
      error.value = true;
      errorMsg.value = "Der opstod en fejl under sletning";
    }

    toggleDeleteBox();
    deleteLoading.value = false;
    dropdownIndex.value = null;
  }

  onBeforeMount(() => {
    try {
      axios.get('/directory/'+route.params.id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        title.value = apiData.value.title;
        loading.value = false;
      }).catch((response) => {
        errorApiLoader.value = response;
      });
    } catch(e) {
      errorApiLoader.value = e;
    }
  });

  const apiCall = async (msg) => {
    const el = document.getElementById('topScroller');

    await axios.put('/directory/data/'+route.params.id, {
      data: apiData.value.data,
    }, {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      loading.value = false;
      success.value = true;
      successMsg.value = msg;
    }).catch((response) => {
      error.value = true;
      errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
      if (el) {
        el.scrollIntoView();
      }
      loading.value = false;
    });
  }
</script>