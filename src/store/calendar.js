import { defineStore } from 'pinia';
import { ref } from "vue";

export const Calendar = defineStore('calendar', () => {
  const active = ref('day');

  const timeframe = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const switchCalendar = (calendar) => {
    active.value = calendar;
  }

  return { active, switchCalendar, timeframe }
});