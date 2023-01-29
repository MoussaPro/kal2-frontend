<template>
  <div class="relative">
    <h2 class="font-medium hover-transition hover:text-white hover:bg-primary rounded-md cursor-pointer py-1 px-2 capitalize" :class="dayNumberNavigation ? 'bg-primary text-white' : 'text-gray-600'" @click="dayNumberNavigation = !dayNumberNavigation">{{ title }}</h2>
    <div v-if="dayNumberNavigation" class="absolute w-[300px] mt-5 hover-transition z-[200]" v-click-outside="hideDayNumberNavigation">
      <div class="w-0 h-0 border-[15px] absolute top-0 left-[20px] mt-[-30px] border-l-transparent border-r-transparent border-t-transparent border-b-gray-300"></div>
      <DatePicker is-expanded show-iso-weeknumbers is_range v-model="date" @dayclick="onDayClick"/>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import { DatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  import dateHandler from "@/composables/dateHandler";

  const props = defineProps({
    day: {
      type: Number,
    },
  });
  const { dateCalender, getDay, getDate, getMonth, getYear } = dateHandler();

  const dayNumberNavigation = ref(false);
  const date = ref();
  const emit = defineEmits(['gotoByDayNumber']);
  const title = getDay(props.day, 'name') + ' - ' + getDate(props.day).slice(0, 2) + '. ' + getMonth(props.day, 'name') + ' ' + getYear(props.day);

  const onDayClick = (day) => {
    const finalDate = dateCalender(day.date, false);
    emit('gotoByDayNumber', finalDate);
  }

  const hideDayNumberNavigation = () => {
    if (dayNumberNavigation.value === true) {
      dayNumberNavigation.value = false;
    }
  }
</script>