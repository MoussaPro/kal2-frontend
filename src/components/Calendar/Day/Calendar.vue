<template>
  <Api-Server-Loading v-if="loading && !error" class="mt-10"/>
  <Api-Server-Error v-if="error" :error="error" class="mt-10"/>

  <div v-if="!loading && !error">
    <Calendar-Navigation
        :containerFields="containerFields"
        :day="apiData.day"
        @previous="previous"
        @next="next"
        @gotoByDayNumber="gotoByDate"
        @created="newTaskCreated"
        @updated="newTaskCreated"
        @deleted="(task) => gotoByDate(task.startDate)"
        ref="navigation" />

    <div class="w-full bg-primary-Darker mt-5 h-10 px-3 flex items-center justify-center h-10 text-white font-inter text-sm tracking-wider capitalize">{{ title }}</div>
    <Calendar-Day-DailyTasks v-if="allDayTasks.length > 0" :tasks="allDayTasks" :day="getDate(apiData.day)" @opened="(t) => navigation.setOpenedTask(t)" />

    <div class="divide-x divide-y divide-gray-100 border-r border-gray-100 relative">
      <div class="absolute text-gray-500 text-xs left-[-42px] top-0">
        <div :class="heightClass" v-for="time in timeframe">{{ time }}</div>
      </div>

      <div class="border-b relative flex border-gray-200/50 bg-white" :class="heightClass" v-for="(time, index) in timeframe" :key="index+' '+time">
        <div class="sibling absolute w-full h-full hover:bg-primary/10 hover-transition cursor-pointer" @click="navigation.toggleCreateTask({ time: time, day: getDate(apiData.day) })"></div>
        <div v-for="task in tasks(time)" class="p-[2px]" :class="!task.moreTask ? 'w-1/5' : 'w-full'" :key="task.id">
          <Calendar-Week-Task :task="task" @opened="(t) => navigation.setOpenedTask(t)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, ref } from "vue";
  import axios from "axios";
  import moment from "moment";
  import dateHandler from "@/composables/dateHandler";
  import timeHandler from "@/composables/timeHandler";

  const apiData = ref();
  const loading = ref(true);
  const error = ref();
  const heightClass = ref('h-14');
  const containerFields = ref(null);
  const { getDay, getDate, getMonth, getYear } = dateHandler();
  const title = ref();
  const { timeframe, insideTimeBox } = timeHandler();
  const navigation = ref();


/**
   * Getting data from the API
   * @param date - Determine which week
   */
  const getApi = async(date) => {
    const url = ref("/calendar/day");
    loading.value = true;

    // Date only filled when clicking, therefor we set the loader to true
    if (date) {
      url.value = "/calendar/day/"+date;
    }

    try {
      await axios.get(url.value, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        containerFields.value = response.fields ?? null;
        title.value = getDay(apiData.value.day, 'name') + ' - ' + getDate(apiData.value.day).slice(0, 2) + '. ' + getMonth(apiData.value.day, 'name') + ' ' + getYear(apiData.value.day);
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  }
  getApi();

  const day = computed(() => {
    if (apiData.value && apiData.value.day) {
      return getDate(apiData.value.day);
    }
  });

  const allDayTasks = computed(() => {
    if (apiData.value) {
      return apiData.value.tasks.filter((task) => task.task_all_day === 1);
    }
  });

  const tasks = (time) => {
    const tasks = apiData.value.tasks.filter(task => {
      const inTimeFrame = insideTimeBox(String(task.task_time), String(time+':00')); // Checks if the task is in the timeframe

      if (inTimeFrame) {
        task.diff = inTimeFrame; // Assign the difference to the task object so we can use it in the component
        return task;
      }
    });

    // Return single task objects if no more than 3, otherwise return a "more task" object
    // Take first task date so we inside the more task component knows which date we on
    return tasks.length < 5 ? tasks : [{ title: '+'+tasks.length+' Opgaver', moreTask: true, tasks: tasks, date: tasks[0].task_date }];
  };

  const next = () => {
    const date = moment(day.value, 'DD/MM/YYYY');
    getApi(date.add(1, 'days').format('DD-MM-YYYY'));
  }

  const previous = () => {
    const date = moment(day.value, 'DD/MM/YYYY');
    getApi(date.subtract(1, 'days').format('DD-MM-YYYY'));
  }

  const gotoByDate = (inputDate) => {
    const date = moment(inputDate, 'DD/MM/YYYY');
    getApi(date.format('DD-MM-YYYY'));
  }

  const newTaskCreated = (task) => {
    // @TODO error handling from backend
    if (task !== null) {
      const date = moment(task.task_date, 'YYYY-MM-DD');
      getApi(date.format('DD-MM-YYYY'));
    }
  }
</script>