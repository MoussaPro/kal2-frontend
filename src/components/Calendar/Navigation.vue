<template>
  <div>
    <div class="w-full p-4 bg-gray-100 border border-gray-200 mt-10 rounded flex justify-between items-center">
      <div class="w-64 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.25" stroke="currentColor" class="w-7 h-7 p-1 text-gray-600 hover-transition hover:text-white hover:bg-primary rounded-full cursor-pointer" @click="$emit('previous');">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.25" stroke="currentColor" class="w-7 h-7 p-1 text-gray-600 hover-transition hover:text-white hover:bg-primary rounded-full cursor-pointer" @click="$emit('next');">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <div class="relative">
          <WeekNavigationButton :weekNumber="weekNumber" @gotoByWeekNumber="(number) => $emit('gotoByWeekNumber', number)" :year="year" v-if="active === 'week'"/>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="mx-2">
          <div class="rounded p-3 text-sm" :class="active === 'day' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Dag visning</div>
        </div>
        <div class="mx-2">
          <div class="rounded p-3 text-sm" :class="active === 'week' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Uge visning</div>
        </div>
        <div class="mx-2">
          <div class="rounded p-3 text-sm" :class="active === 'month' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer'">Måned visning</div>
        </div>
      </div>

      <div class="w-64 flex justify-end">
        <button @click="$emit('create');" class="rounded py-3 px-5 font-medium text-sm bg-gray-200 flex items-center text-gray-700 hover-transition hover:bg-primary hover:text-white cursor-pointer">
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
  const props = defineProps({
    weekNumber: {
      type: Number,
    },
    year: {
      type: Number,
    },
    active: {
      type: String
    }
  });
</script>