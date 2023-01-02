<template>
  <div class="relative">
    <button @click="toggleTimeDropdown = !toggleTimeDropdown; fillRestTime()" class="w-full rounded-md shadow py-[7px] pl-2 font-inter text-left text-[13px] font-medium flex items-center hover-transition group" :class="toggleTimeDropdown ? ( !errorTime ? 'text-white bg-primary-Darker border border-primary-Darker1' : errorClass) : ( !errorTime ? 'bg-gray-100 border border-gray-100 hover:bg-primary hover:border-primary hover:text-white' : errorClass)">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-[16px] mr-1 -mt-[2px]">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <input type="text" v-model="timeInputValue" @change="$emit('time', timeInputValue)" ref="timeInput" class="focus:outline-none w-10 bg-transparent group-hover:text-white" :class="toggleTimeDropdown ? 'text-white' : ( !errorTime ? 'text-black' : 'text-white')">
    </button>
    <div class="absolute shadow-md bg-gray-50 border border-gray-100 w-[150px] l font-inter text-sm font-medium mt-5 rounded hover-transition z-20" v-click-outside="hideTimeDropdown" v-if="toggleTimeDropdown">
      <div class="w-0 h-0 border-[15px] absolute top-0 -mt-7 ml-2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-100"></div>
      <div class="max-h-[200px] overflow-y-scroll z-[20] relative border-t-2 border-gray-100">
        <div class="border-b border-gray-200 px-2 py-[7.5px] leading-none hover-transition cursor-pointer" :class="timeInputValue === time ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white '" @click="toggleTimeDropdown = false; timeInputValue = time; $emit('time', time); $emit('error', errorTime)" v-for="time in times">{{ time }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch } from "vue";

  const toggleTimeDropdown = ref(false);
  const timeInputValue = ref('00:00');
  const errorTime = ref(false);
  const errorClass = 'bg-red-500 text-white border border-red-500 hover:bg-red-600 hover:border-red-600';
  const emit = defineEmits(['time', 'error']);

  const times = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];

  // Watch validater
  watch(timeInputValue, () => {
    validateTime();
  });

  const validateTime = () => {
    errorTime.value = false;
    let inputTime = timeInputValue.value;
    const regex = /^([0-9][0-9]:[0-9][0-9]$)/;
    const valid = regex.exec(inputTime);

    if (valid === null) {
      // Seperator checker
      inputTime = inputTime.replace('.', ':');
      inputTime = inputTime.replace(',', ':');

      // Remove all text
      inputTime = inputTime.replace(/[^0-9]/g, '0');

      // If not includes the seperator add it
      if (!inputTime.includes(':')) {
        inputTime = setCharAt(inputTime, 2, ':');
      }

      // Max length 5
      if (inputTime.includes(':')) {
        inputTime = inputTime.substring(0, 5);
      }

      // Not found set the error
      errorTime.value = true;
    }

    return timeInputValue.value = inputTime;
  }

  const fillRestTime = () => {
    if (!timeInputValue.value) {
      timeInputValue.value = '00:00';
    }

    if (timeInputValue.value) {
      switch (timeInputValue.value.length) {
        case 1:
          timeInputValue.value += '0:00'
          break;
        case 2:
          timeInputValue.value += ':00'
          break;
        case 3:
          timeInputValue.value += '00'
          break;
        case 4:
          timeInputValue.value += '0'
          break;
      }
    }

    emit('time', timeInputValue.value);
    emit('error', errorTime.value)
  }

  const hideTimeDropdown = () => {
    fillRestTime();
    toggleTimeDropdown.value = false;
    emit('time', timeInputValue.value)
  }

  const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }
</script>