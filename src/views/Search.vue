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

    <div class="w-full bg-white mt-5 shadow p-3" v-if="!loading">
      <div class="font-medium text-sm mb-1 text-gray-700">Global søgning</div>
      <div class="flex items-center justify-center">
        <input type="text" class="flex-1 border h-10 pl-2 text-gray-700 rounded-l-md focus:outline-0" :class="searchError ? 'border-red-500' : 'border-gray-300'" v-model="searchModel" />
        <button @click="search" class="bg-primary-Darker1 h-10 px-6 rounded-r-md hover:opacity-75 hover-transition cursor-pointer text-white">Søg</button>
      </div>
    </div>

    <div class="w-full bg-white mt-5 shadow p-3 mb-20" v-if="apiData">
      <div v-if="apiData.tasks.length">
        <div v-if="apiData.tasks.length">
          <h2 class="text-lg font-medium mb-2">Opgaver:</h2>
          <div v-for="(task, index) in apiData.tasks">
            <div class="flex items-center mb-3 h-[50px] rounded-md hover-transition hover:scale-[100.5%] cursor-pointer group" @click="setOpenedTask(task)">
              <div class="w-[50px] h-full rounded-l-md text-white p-1 text-xs font-medium" :class="getTaskColor(task.task_color)"></div>
              <div class="flex-1 grid grid-cols-5 px-5 text-xs text-gray-700 h-full bg-gray-50 rounded-r-md border border-gray-200 group-hover:bg-gray-100 hover-transition">
                <div class="col-span-3 flex flex-col justify-center">
                  <p class="leading-tight text-sm line-clamp-1">#{{ task.task_number}} {{ task.title }}</p>
                </div>
                <div class="col-span-1 flex flex-col justify-center">
                  <b class="leading-tight font-medium">Start</b>
                  <p class="leading-tight font-light line-clamp-1">{{ getOutputDate(task.task_date) }} {{ getOutputTime(task.task_time) }}</p>
                </div>
                <div class="col-span-1 flex flex-col justify-center">
                  <b class="leading-tight font-medium">Slut</b>
                  <p class="leading-tight font-light line-clamp-1" v-if="task.task_date_end || task.task_time_end">{{ getOutputDate(task.task_date_end) }} {{ getOutputTime(task.task_time_end) }}</p>
                  <p class="font-light line-clamp-1" v-else>Ingen</p>
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

  const search = () => {
    if (searchModel.value) {
      searchError.value = false;
      apiData.value = null;
      loading.value = true;

      axios.get('search/'+searchModel.value, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        console.log(response);
        apiData.value = response;
        if (response.fields) {
          containerFields.value = response.fields;
          containerDirectories.value = response.directories ?? null;
        }
        loading.value = false;

      }).catch((response) => {
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
    if (route.query.q) {
      search();
    }
  });
</script>