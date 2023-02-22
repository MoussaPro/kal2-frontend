<template>
  <div class="border rounded-md text-xs px-2 py-[5px] flex justify-between my-[2px] items-center shadow relative hover-transition hover:opacity-80 cursor-pointer hover:scale-[102%] hover:!z-[25]" :style="styling" @click="$emit('opened', task)">
    <p class="line-clamp-1">#{{task.task_number}} {{ task.title }}</p>
    <p class="text-[10.5px] leading-none font-inter font-medium" v-if="showTaskEndDate">{{ dateCalender(task.task_date_end) }}</p>
  </div>
</template>
<script setup>
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  import colorHandler from "@/composables/colorHandler";
  const { dateCalender, danishToDate } = dateHandler();
  const { getTaskColors } = colorHandler();
  const emits = defineEmits(['opened']);

  const props = defineProps({
    task: {
      type: Object,
      required: true
    },
    firstDate: {
      type: Object
    },
  });

  const styling = ref('');
  const color = ref(getTaskColors(props.task.task_color));
  const firstDate = danishToDate(props.firstDate.date.toString());
  const startDate = danishToDate(dateCalender(props.task.task_date, false));
  const endDate = props.task.task_date_end ? danishToDate(dateCalender(props.task.task_date_end, false)) : null;
  const oneDay = 14.25;
  const showTaskEndDate = ref(false);

  const getDiffDays = computed(() => {
    if (endDate) {
      const diffOutsideFrame = ref(((endDate.getTime() - firstDate.getTime()) / 86400000));
      const diffFirstDate = ref(((startDate.getTime() - firstDate.getTime()) / 86400000));

      // If it ends withing the week frame
      if (diffOutsideFrame.value < 7) {
        if (diffOutsideFrame.value === 0) {
          return 1;
        }

        if (diffFirstDate.value > 0) {
          return diffOutsideFrame.value+1 - diffFirstDate.value;
        } else {
          return diffOutsideFrame.value+1
        }
      } else {
        // Ends on another week frame, so fill out whole week
        showTaskEndDate.value = true;
        return 7;
      }
    } else {
      return 1;
    }
  });

  const getDiffFirstDate = computed(() => {
    const diff = ref(((startDate.getTime() - firstDate.getTime()) / 86400000));

    // If its negative, it extend from another frame therefor it should just be at the start
    if (diff.value < 0) {
      diff.value = 0;
    }

    return diff.value + 1 ;
  });

  // Style the object
  styling.value += 'grid-column: '+getDiffFirstDate.value+' / '+(getDiffFirstDate.value+getDiffDays.value)+';'; // Width
  styling.value += " background-color:" + color.value['background'] + ";";
  styling.value += " color:" + color.value['text'] + ";";
  styling.value += " border-color:" + color.value['border'] + ";";
</script>