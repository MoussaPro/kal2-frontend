<template>
  <div class="w-full relative">
    <div class="w-full bg-gray-200 py-[2px] text-gray-500 text-[10px] flex items-center justify-center font-semibold hover:cursor-pointer hover-transiton hover:bg-gray-300" v-if="tasks.length > 1 && containerDivHeight > 40" @click="toggleShowAll">
      <span v-if="!showAll">Daglige opgaver (Vis alle {{ tasks.length }})</span>
      <span v-else>Skjul dagelige opgaver</span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :class="showAll ? 'rotate-[-180deg]' : ''" stroke-width="1.5" stroke="currentColor" class="w-4 mt-[1px] ml-[2px]">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
    <transition name="slide">
      <div ref="containerDiv" class="w-full py-1 px-[2px] gap-1 bg-gray-50 border border-gray-200 relative h-15 grid grid-cols-7 grid-flow-dense border-b-gray-300 border-b-2 shadow hover-transition" :class="showAll ? '' : 'max-h-[45px] overflow-hidden'">
        <Calendar-Day-DailyBox v-for="task in tasks" :task="task" :day="day" @opened="$emit('opened', task)" />
      </div>
    </transition>
  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";

  const props = defineProps({
    tasks: {
      type: Object,
      required: true
    },
    day: {
      type: String,
      required: true
    }
  });

  const showAll = ref(false);
  const containerDiv = ref(null);
  const containerDivHeight = ref(0);

  const toggleShowAll = () => {
    showAll.value = !showAll.value;
  }

  onMounted(() => {
    // Get the height of the div
    containerDivHeight.value = containerDiv.value.offsetHeight;
  })
</script>
<style>
.slide-enter-from,
.slide-leave-to {
  transform: scaleY(0);
}
.estimation-category {
  transform-origin: top;
  transition: transform .4s ease-in-out;
}
</style>