<template>
  <div class="relative">
    <h2 class="font-medium hover-transition hover:text-white hover:bg-primary rounded-md cursor-pointer py-1 px-2" :class="weekNumberNavigation ? 'bg-primary text-white' : 'text-gray-600'" @click="weekNumberNavigation = !weekNumberNavigation">Uge {{ weekNumber }} - {{ year }}</h2>
    <div v-if="weekNumberNavigation" class="absolute w-[300px] mt-5 hover-transition z-[200]" v-click-outside="hideWeekNumberNavigation">
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
    weekNumber: {
      type: Number,
    },
    year: {
      type: Number,
    },
  });

  const weekNumberNavigation = ref(false);
  const date = ref();
  const emit = defineEmits(['gotoByWeekNumber'])
  const { dateCalender } = dateHandler();

  const onDayClick = (day) => {
    const finalDate = dateCalender(day.date, false);
    emit('gotoByWeekNumber', finalDate);
  }


  const hideWeekNumberNavigation = () => {
    if (weekNumberNavigation.value === true) {
      weekNumberNavigation.value = false;
    }
  }

</script>