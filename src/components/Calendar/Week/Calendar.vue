<template>
  <Api-Server-Loading v-if="loading && !error" class="mt-10"/>
  <Api-Server-Error v-if="error" :error="error" class="mt-10"/>


  <div v-if="!loading && !error">
    <Calendar-Navigation :weekNumber="apiData ? apiData.week_number : null" :year="apiData ? apiData.year : null" active="week" @previous="previous" @next="next" @gotoByWeekNumber="gotoByDate" @create="toggleCreateTask"/>
    <Task-Create v-if="showCreateTask" :containerFields="containerFields" :prefill="prefillTask" @close="toggleCreateTask" @created="newTaskCreated" />
    <Task-Open v-if="showOpenedTask" :containerFields="containerFields" :task="openedTask" @close="toggleOpenedTask" @updated="newTaskCreated" @deleted="taskDeleted" />

    <div class="grid grid-cols-7 mt-5 divide-x divide-primary-Darker">
      <div v-for="day in weekDays" class="col-span-1 px-3 flex justify-between items-center justify-center h-10 text-white font-inter text-sm tracking-wider" :class="day.isToday ? 'bg-primary-Darker font-semibold' : 'bg-primary font-normal'">
        <p class="capitalize">{{ day.day }}</p>
        <p>{{ day.date.slice(0, 5) }}</p>
      </div>
    </div>

    <Calendar-Week-DailyTasks v-if="allDayTasks.length > 0" :tasks="allDayTasks" :firstDate="weekDays[0]" @opened="setOpenedTask" />

    <div class="grid grid-cols-7 divide-x divide-y divide-gray-100 border-r border-gray-100 relative">
      <!-- Display timeframes on the calendar side -->
      <div class="absolute text-gray-500 text-xs left-[-42px] top-0">
        <div :class="heightClass" v-for="time in timeframe">{{ time }}</div>
      </div>

      <!-- Day foreach -->
      <div :id="'week_'+week.date" class="col-span-1 bg-white relative" :class="{'border-l border-t border-gray-100': index === 0}" v-for="(week, index) in weekDays" :key="week.timestamp">
        <!-- Times -->
        <div class="border-b relative flex border-gray-200/50" :class="[heightClass, week.isToday ? 'bg-green-100/40  border-gray-100' : 'bg-white']" v-for="(time, index) in timeframe" :key="index+' '+time">
          <div class="sibling absolute w-full h-full hover:bg-primary/10 hover-transition cursor-pointer" @click="toggleCreateTask({ time: time, day: week.date })"></div>
          <div v-for="task in tasks(week.timestamp, time)" class="flex-1 p-[2px]" :key="task.id">
            <Calendar-Week-Task :task="task" @clicked="setOpenedTask" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  import timeHandler from "@/composables/timeHandler";
  import axios from "axios";
  import moment from 'moment';

  const { insideTimeBox } = timeHandler();
  const { getDay, getDate, isToday, dateToTimestamp } = dateHandler();
  const apiData = ref();
  const loading = ref(true);
  const error = ref();
  const heightClass = ref('h-14');
  const timeframe = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  const weekHolder = ref([]);
  const showCreateTask = ref(false);
  const showOpenedTask = ref(false);
  const openedTask = ref();
  const prefillTask = ref({});
  const containerFields = ref(null);

  /**
   * Getting data from the API
   * @param date - Determine which week
   */
  const getApi = async(date) => {
    const url = ref("/calendar/week");
    loading.value = true;

    // Date only filled when clicking, therefor we set the loader to true
    if (date) {
      url.value = "/calendar/week/"+date;
    }

    try {
      await axios.get(url.value, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        containerFields.value = response.fields ?? null;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  }
  getApi();

  const weekDays = computed(() => {
    weekHolder.value = [];

    if (apiData.value) {
      apiData.value.week.forEach((value) => {
        weekHolder.value.push({
          'day': getDay(value, 'name'),
          'date': getDate(value, '/'),
          'isToday': isToday(value),
          'timestamp': value
        });
      });
    }

    return weekHolder.value;
  });

  const allDayTasks = computed(() => {
    if (apiData.value) {
      return apiData.value.tasks.filter((task) => task.task_all_day === 1);
    }
  });

  const tasks = (timestamp, time) => {
      const tasks = apiData.value.tasks.filter(task => {
        const inDayFrame = dateToTimestamp(task.task_date) === timestamp; // Checks if the task is in the day
        const inTimeFrame = insideTimeBox(String(task.task_time), String(time+':00')); // Checks if the task is in the timeframe

        if (inDayFrame && inTimeFrame) {
          task.diff = inTimeFrame; // Assign the difference to the task object so we can use it in the component
          return task;
        }
      });

      // Return single task objects if no more than 3, otherwise return a "more task" object
      // Take first task date so we inside the more task component knows which date we on
      return tasks.length < 3 ? tasks : [{ title: '+'+tasks.length+' Opgaver', moreTask: true, tasks: tasks, date: tasks[0].task_date }];
  };

  const next = () => {
    const date = moment(weekHolder.value[6].date, 'DD/MM/YYYY').add(1, 'd');
    getApi(date.startOf('isoWeek').format('DD-MM-YYYY'));
  }

  const previous = () => {
    const date = moment(weekHolder.value[0].date, 'DD/MM/YYYY').subtract(1, 'd');
    getApi(date.startOf('isoWeek').format('DD-MM-YYYY'));
  }

  const gotoByDate = (inputDate) => {
    const date = moment(inputDate, 'DD/MM/YYYY');
    getApi(date.startOf('isoWeek').format('DD-MM-YYYY'));
  }

  const toggleCreateTask = (prefilling = null) => {
    prefillTask.value = prefilling; // Set prefilling if whitebox is clicked
    showCreateTask.value = !showCreateTask.value;
  }

  const setOpenedTask = (task) => {
    openedTask.value = task;
    showOpenedTask.value = true; // Open task as we assign it
  }

  const toggleOpenedTask = () => {
    showOpenedTask.value = !showOpenedTask.value;
  }

  const newTaskCreated = (task) => {
    // @TODO error handling from backend
    if (task !== null) {
      const date = moment(task.task_date, 'YYYY-MM-DD');
      getApi(date.format('DD-MM-YYYY'));
    }
  }

  const taskDeleted = () => {
    getApi();
    console.log('herinde');
  }
</script>