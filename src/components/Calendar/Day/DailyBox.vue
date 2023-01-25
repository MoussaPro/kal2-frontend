<template>
  <div class="border rounded-md text-xs px-2 py-[5px] flex justify-between items-center shadow relative hover-transition hover:opacity-80 cursor-pointer hover:scale-[102%] hover:!z-[25]" :style="styling" @click="$emit('opened', task)">
    <p>#{{task.task_number}} {{ task.title }}</p>
    <p class="text-[10.5px] leading-none font-inter font-medium" v-if="showTaskEndDate">{{ dateCalender(task.task_date_end) }}</p>
  </div>
</template>
<script setup>
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  import colorHandler from "@/composables/colorHandler";
  const { dateCalender, getDate } = dateHandler();
  const { getTaskColors } = colorHandler();
  const emits = defineEmits(['opened']);

  const props = defineProps({
    task: {
      type: Object,
      required: true
    },
    day: {
      type: String,
      required: true
    }
  });

  const styling = ref('');
  const color = ref(getTaskColors(props.task.task_color));
  const day = ref(props.day);
  const showTaskEndDate = ref(props.task.task_date_end !== props.task.task_date && dateCalender(props.task.task_date_end, false) !== day.value && props.task.task_date_end !== null);

  // Style the object
  styling.value += " background-color:" + color.value['background'] + ";";
  styling.value += " color:" + color.value['text'] + ";";
  styling.value += " border-color:" + color.value['border'] + ";";
</script>