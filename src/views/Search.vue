<template>
  <div class="auth-content relative">
    <Api-Server-Loading v-if="loading && !error" class="mt-5"/>
    <Api-Server-Error v-if="error" :error="error" class="mt-5"/>

    <Task-Open
        v-if="showOpenedTask"
        :containerFields="containerFields"
        :containerDirectories="containerDirectories"
        :task="openedTask"
        @close="toggleOpenedTask"
        @updated="refreshSearch"
        @deleted="refreshSearch" />

    <div class="w-full bg-white mt-5 shadow p-3" v-if="!loading && !error">
      <div class="font-medium text-sm mb-1 text-gray-700">Global søgning</div>
      <div v-if="searchError" class="bg-red-500/90 flex items-center text-white rounded-md mb-4 mt-2 p-2 text-xs font-medium font-inter">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 mr-[5px] -mt-[3px]">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        Udfyld venligst minimum en søgekriterie
      </div>
      <div class="flex items-center justify-center">
        <input type="text" class="flex-1 border h-10 pl-2 text-gray-700 rounded-l-md focus:outline-0 border-gray-300" v-model="searchModel" />
        <button @click="search" class="bg-primary-Darker1 h-10 px-6 rounded-r-md hover:opacity-75 hover-transition cursor-pointer text-white">Søg</button>
      </div>
      <AdvancedSearch @searchcriteria="(emittedSearch) => searchcriteria = emittedSearch" :searchcriteria="searchcriteria" v-if="advanceSearch" :containerFields="containerFields" :containerDirectories="containerDirectories"/>
      <div @click="advanceSearch = !advanceSearch;" class="mt-3 bg-gray-100 px-4 inline-flex items-center rounded-md text-gray-800 font-medium py-[5px] text-sm cursor-pointer hover:bg-gray-300 active:bg-gray-400 hover-transition">
        Avanceret søgning
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 ml-1 mt-[2px]" :class="{'rotate-180': advanceSearch}">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>

    <div class="w-full bg-white mt-5 shadow p-3 mb-20" v-if="apiData && !loading && !error">
      <div v-if="apiData.tasks.length">
        <div v-if="apiData.tasks.length">
          <h2 class="text-lg font-medium mb-2">Opgaver:</h2>
          <div v-for="(task, index) in apiData.tasks">
            <div class="flex items-center mb-3 h-[50px] rounded-md hover-transition hover:scale-[100.5%] cursor-pointer group" @click="setOpenedTask(task)">
              <div class="w-[50px] h-full rounded-l-md text-white p-1 text-xs font-medium" :class="getTaskColor(task.task_color)"></div>
              <div class="flex-1 grid grid-cols-5 gap-x-10 px-5 text-xs text-gray-700 h-full bg-gray-50 rounded-r-md border border-gray-200 group-hover:bg-gray-100 hover-transition">
                <div class="col-span-3 flex flex-col justify-center">
                  <p class="leading-tight text-sm line-clamp-1">#{{ task.task_number}} {{ task.title }}</p>
                </div>
                <div class="col-span-1 flex flex-col justify-center">
                  <b class="leading-tight font-medium">Start</b>
                  <p class="leading-tight font-light line-clamp-1">{{ getOutputDate(task.task_date) }} {{ getOutputTime(task.task_time) }}</p>
                </div>
                <div class="col-span-1 flex flex-col justify-center">
                  <b class="leading-tight font-medium">Slut</b>
                  <p class="leading-tight font-light line-clamp-1">
                    <span v-if="task.task_date_end">{{ getOutputDate(task.task_date_end) }}</span>
                    <span v-if="task.task_time_end">{{ getOutputTime(task.task_time_end) }}</span>
                  </p>
                  <p class="font-light line-clamp-1" v-if="!task.task_date_end && !task.task_time_end">Ingen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <Empty text="Ingen resultater fundet" :hideButton="true"/>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onBeforeMount, ref } from "vue";
  import { useRoute } from "vue-router/dist/vue-router";
  import { useRouter } from "vue-router";
  import axios from "axios";
  import colorHandler from "@/composables/colorHandler";
  import dateHandler from "@/composables/dateHandler";

  const route = useRoute();
  const router = useRouter();
  const searchModel = ref(route.query.q ? route.query.q : '');
  const apiData = ref();
  const loading = ref(false);
  const error = ref(false);
  const searchError = ref(false);
  const { colors } = colorHandler();
  const { getDate, getMonth, getYear, dateCalender, danishToDate, dateToTimestamp } = dateHandler();
  const showOpenedTask = ref(false);
  const openedTask = ref();
  const containerFields = ref();
  const containerDirectories = ref();
  const advanceSearch = ref(false);
  const searchcriteria = ref();

  const search = () => {
    if (searchModel.value || (searchcriteria.value.included.length || searchcriteria.value.excluded.length)) {
      searchError.value = false;
      apiData.value = null;
      loading.value = true;

      axios.post('/search', {
        q: searchModel.value,
        searchcriteria: searchcriteria.value
      },{
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        console.log(response);
        apiData.value = response;
        loading.value = false;
      }).catch((response) => {
        error.value = true;
        loading.value = false;
      });
    } else {
      searchError.value = true;
    }
  }

  const getTaskColor = (task_color) => {
    return colors.filter(color => color.name === task_color)[0].css;
  }

  const getOutputDate = (task_date) => {
    const date =
        dateToTimestamp( // Converts to timestamp
          danishToDate( // Converts to date object
            dateCalender(task_date, false) // Converts to danish
          )
        );

    return getDate(date).slice(0, 2) + '. ' + getMonth(date, 'name') + ' ' + getYear(date);
  }

  const getOutputTime = (task_time) => {
    return task_time ? task_time.slice(0, 5) : null;
  }

  const setOpenedTask = (task) => {
    openedTask.value = task;
    showOpenedTask.value = true;
  }

  const toggleOpenedTask = () => {
    showOpenedTask.value = !showOpenedTask.value;
  }

  const refreshSearch = () => {
    search();
  }

  onBeforeMount(() => {
    axios.get('global/data', {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      containerFields.value = response.fields;
      containerDirectories.value = response.directories;
      loading.value = false;

    }).catch((response) => {
      error.value = true;
      loading.value = false;
    });
  });
</script>