<template>
  <Api-Server-Loading v-if="loading && !error" class="mt-10"/>
  <Api-Server-Error v-if="error" :error="error" class="mt-10"/>

  <div v-if="!loading && !error">
    <Calendar-Navigation
        :containerFields="containerFields"
        :containerDirectories="containerDirectories"
        :month="apiData.month[0]"
        :year="apiData.year"
        @previous="previous"
        @next="next"
        @gotoByMonthNumber="gotoByDate"
        @created="newTaskCreated"
        @updated="newTaskCreated"
        @deleted="(task) => gotoByDate(task.startDate)"
        ref="navigation" />

    <div class="grid grid-cols-7 mt-5 divide-x divide-primary-Darker">
      <div class="col-span-1 px-3 flex justify-between items-center justify-center h-10 text-white font-inter text-sm tracking-wider bg-primary font-normal" v-for="name in dayNames">{{ name }}</div>
    </div>

    <div class="grid grid-cols-7">
      <div class="col-span-1 p-[5px] h-[150px] bg-white border border-gray-100 relative" :style="index === 0 ? pushFirstDate : ''" v-for="(month, index) in apiData.month">
        <div class="sibling absolute w-full h-full -m-[5px] hover:bg-primary/10 hover-transition cursor-pointer" @click="navigation.toggleCreateTask({ day: getDate(month) })"></div>
        <div class="text-normal rounded-full w-6 h-6 flex items-center font-inter justify-center relative cursor-pointer hover-transition" :class="isToday(month) ? 'text-white bg-primary-Darker1 hover:bg-primary' : 'text-gray-600 hover:bg-gray-200'" @click="goToDailyCalendar(getDate(month))">{{ getDay(month) }}</div>
        <div v-for="(task, index) in tasks(month)" v-if="true">
          <Calendar-Task :task="task" @opened="(t) => navigation.setOpenedTask(t)" layout="month" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  import axios from "axios";
  import moment from 'moment';
  import { useRouter } from "vue-router";
  import { Calendar } from "@/store/calendar";

  const { getMonth, getDate, isToday, getDay, danishToDate, dateToBackendString, dayNames } = dateHandler();
  const apiData = ref();
  const loading = ref(true);
  const error = ref();
  const title = ref();
  const containerFields = ref(null);
  const containerDirectories = ref(null);
  const navigation = ref();
  const Router = useRouter();
  const calendar = Calendar();

  /**
   * Getting data from the API
   * @param date - Determine which week
   */
  const getApi = async(date) => {
    const url = ref("/calendar/month");
    loading.value = true;

    if (date) {
      url.value = "/calendar/month/"+date;
    }

    try {
      await axios.get(url.value, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        title.value = getMonth(response.month[0], 'name');
        containerFields.value = response.fields ?? null;
        containerDirectories.value = response.directories ?? null;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  }
  getApi();

  const tasksByDate = (date) => {
    return dateToBackendString(danishToDate(getDate(date)))
  }

  const tasks = (date) => {
    const tasks = apiData.value.tasks[tasksByDate(date)];

    if (tasks) {
      if (tasks.length < 5) {
        return tasks;
      } else {
        return [{ title: '+'+apiData.value.tasks[tasksByDate(date)].length+' Opgaver', moreTask: true, tasks: apiData.value.tasks[tasksByDate(date)], date: apiData.value.tasks[tasksByDate(date)][0].task_date }];
      }
    }
  }

  const pushFirstDate = computed(() => {
    const firstDate = ref(danishToDate(getDate(apiData.value.month[0])));
    const day = firstDate.value.getDay();
    const difference = day === 0 ? 7 : day;

    return 'grid-column-start: '+difference+';';
  });

  const next = () => {
    const date = moment(getDate(apiData.value.month[15]), 'DD/MM/YYYY');
    getApi(date.add(1, 'months').format('DD-MM-YYYY'));
  }

  const previous = () => {
    const date = moment(getDate(apiData.value.month[15]), 'DD/MM/YYYY');
    getApi(date.subtract(1, 'months').format('DD-MM-YYYY'));
  }

  const gotoByDate = (inputDate) => {
    const date = moment(inputDate, 'DD/MM/YYYY');
    // Add one day as sometimes day 1 goes on previous month
    getApi(date.add(1, 'days').format('DD-MM-YYYY'));
  }

  const newTaskCreated = (task) => {
    // @TODO error handling from backend
    if (task !== null) {
      const date = moment(task.task_date, 'YYYY-MM-DD');
      getApi(date.format('DD-MM-YYYY'));
    }
  }

  const goToDailyCalendar = (date) => {
    calendar.switchCalendar('day');
    Router.push('?day='+date.replaceAll('/', '-'));
  }
</script>