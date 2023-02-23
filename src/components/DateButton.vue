<template>
  <div class="relative">
    <button @click="toggleDatePicker = !toggleDatePicker" class="w-full rounded-md shadow py-[7px] pl-2 font-inter text-left text-[13px] font-medium flex items-center hover-transition hover:bg-primary hover:border-primary hover:text-white" :class="toggleDatePicker ? 'text-white bg-primary-Darker border border-primary-Darker1' : 'bg-gray-100 border border-gray-100 '">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[16px] mr-1 -mt-[2px]">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
      {{ finaleDate ? (finaleDate === today ? 'I dag' : finaleDate) : 'Vælg dato' }}
    </button>

    <div v-if="toggleDatePicker" class="absolute shadow-2xl bg-gray-50 w-[400px] mt-5 p-3 rounded hover-transition z-20" :class="datePickerPosition" v-click-outside="hideDatePicker">
      <div class="w-0 h-0 border-[15px] absolute top-0 -mt-7 border-l-transparent border-r-transparent border-t-transparent border-b-gray-100" :class="datePickerPosition.includes('right') ? 'right-10' : 'left-0'"></div>
      <DatePicker is-expanded show-iso-weeknumbers :min-date="minDate ? minDate : null" :max-date="maxDate ? maxDate : null" v-model="date" />
    </div>
  </div>
</template>
<script setup>
  import { computed, ref } from "vue";
  import { DatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  import dateHandler from "@/composables/dateHandler";

  const props = defineProps({
    setMinDate: String,
    setMaxDate: String,
    datePickerPosition: {
      type: String,
      default: 'left-0'
    },
    setToday: {
      type: Boolean,
      default: true
    },
    prefill: {
      type: String,
      required: false
    }
  });

  const { dateCalender, danishToDate } = dateHandler();
  const date = ref();
  const today =  dateCalender(new Date(), false);
  const emit = defineEmits(['date']);
  const toggleDatePicker = ref(false);

  // If setToday and there is no prefill or there is no prefill.day
  if (props.setToday && !props.prefill) {
    date.value = new Date();
  }

  // Set prefill
  if (props.prefill) {
    date.value = danishToDate(props.prefill);
  }

  const finaleDate = computed(() => {
    if (date.value) {
      hideDatePicker();
      const finalDate = dateCalender(date.value, false);
      emit('date', finalDate)
      return finalDate;
    } else {
      emit('date', null);
    }
  });

  const minDate = computed(() => {
    if (props.setMinDate) {
      return danishToDate(props.setMinDate);
    } else {
      return null;
    }
  })

  const maxDate = computed(() => {
    if (props.setMaxDate) {
      return danishToDate(props.setMaxDate);
    }
  })

  const hideDatePicker = () => {
    toggleDatePicker.value = false;
  }
</script>