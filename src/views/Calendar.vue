<template>
  <div class="calendar-content pb-20">
    <Calendar-Week-Calendar v-if="activeCalendar === 'week'"></Calendar-Week-Calendar>
    <Calendar-Day-Calendar v-if="activeCalendar === 'day'"></Calendar-Day-Calendar>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { Calendar } from "@/store/calendar";

  const activeCalendar = computed(() =>{
    return Calendar().active;
  });

</script>