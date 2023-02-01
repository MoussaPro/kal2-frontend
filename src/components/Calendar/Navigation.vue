<template>
  <div>
    <Task-Create
        v-if="showCreateTask"
        :containerFields="containerFields"
        :prefill="prefill"
        @close="toggleCreateTask"
        @created="(task) => $emit('created', task)" />

    <Task-Open
        v-if="showOpenedTask"
        :containerFields="containerFields"
        :task="openedTask"
        @close="toggleOpenedTask"
        @updated="(task) => $emit('updated', task)"
        @deleted="(task) => $emit('deleted', task)" />

    <div class="w-full p-4 bg-gray-100 border border-gray-200 mt-10 rounded flex justify-between items-center">
      <div class="w-1/3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.25" stroke="currentColor" class="w-7 h-7 p-1 text-gray-600 hover-transition hover:text-white hover:bg-primary rounded-full cursor-pointer" @click="$emit('previous');">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.25" stroke="currentColor" class="w-7 h-7 p-1 text-gray-600 hover-transition hover:text-white hover:bg-primary rounded-full cursor-pointer" @click="$emit('next');">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <div class="relative">
          <Calendar-Week-Navigation :weekDays="weekDays" :weekNumber="weekNumber" @gotoByWeekNumber="(number) => $emit('gotoByWeekNumber', number)" :year="year" v-if="calendar.active === 'week'"/>
          <Calendar-Day-Navigation :day="day" @gotoByDayNumber="(number) => $emit('gotoByDayNumber', number)" v-if="calendar.active === 'day'"/>
        </div>
      </div>

      <div class="w-1/3 flex items-center justify-center">
        <div class="mx-2">
          <div @click="calendar.switchCalendar('day')" class="rounded p-3 text-sm" :class="calendar.active === 'day' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Dag visning</div>
        </div>
        <div class="mx-2">
          <div @click="calendar.switchCalendar('week')" class="rounded p-3 text-sm" :class="calendar.active === 'week' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Uge visning</div>
        </div>
        <div class="mx-2">
          <div class="rounded p-3 text-sm" :class="calendar.active === 'month' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Måned visning</div>
        </div>
      </div>

      <div class="w-1/3 flex justify-end">
        <button @click="toggleCreateTask" class="rounded py-3 px-5 font-medium text-sm bg-gray-200 flex items-center text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="5" stroke="currentColor" class="w-4 mr-[5px]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Opret opgave
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import { Calendar } from "@/store/calendar";
  import dateHandler from "@/composables/dateHandler";
  import moment from "moment";

  const { getDate } = dateHandler();
  const calendar = Calendar();

  const props = defineProps({
    weekDays: {
      type: Array,
    },
    day: {
      type: Number,
    },
    weekNumber: {
      type: Number,
    },
    year: {
      type: Number,
    },
    containerFields: {
      type: Array || null,
    },
  });

  const showCreateTask = ref(false);
  const showOpenedTask = ref(false);
  const openedTask = ref();
  const prefill = ref();

  const toggleCreateTask = (prefilling = null) => {
    prefill.value = prefilling; // Set prefilling if whitebox is clicked

    // If the calendar is on day view, set the create button automaticly on that date
    if (calendar.active === 'day' && (prefilling && !prefilling.hasOwnProperty('time'))) {
      prefill.value = { day: getDate(props.day) }
    }

    showCreateTask.value = !showCreateTask.value;
  }

  const setOpenedTask = (task) => {
    openedTask.value = task;
    showOpenedTask.value = true; // Open task as we assign it
  }

  const toggleOpenedTask = () => {
    showOpenedTask.value = !showOpenedTask.value;
  }

  const next = (momentDate) => {
    const date = moment(momentDate, 'DD/MM/YYYY').add(1, 'd');
    getApi(date.startOf('isoWeek').format('DD-MM-YYYY'));
  }

  const previous = (momentDate) => {
    const date = moment(momentDate, 'DD/MM/YYYY').subtract(1, 'd');
    getApi(date.startOf('isoWeek').format('DD-MM-YYYY'));
  }

  defineExpose({
    toggleCreateTask,
    setOpenedTask,
  });
</script>