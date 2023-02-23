<template>
  <!-- More task component -->
  <div v-if="task.moreTask" class="h-full relative z-50">
    <div class="border rounded-md h-full flex flex-col justify-between text-xs px-2 py-[2px] font-inter hover-transition hover:opacity-80 relative shadow hover:!z-[25] bg-primary-Darker text-white border-primary font-bold cursor-pointer" :class="openMoreTaskToggle ? 'opacity-75 scale-[105%]': 'hover:scale-[102%]'" @click="openMoreTask" v-click-outside="hideOpenMoreTask">
      <p>{{ task.title }}</p>
      <div class="line-clamp-1 -mx-[2px]" v-if="task.moreTask">
        <p class="inline text-[10px] mx-[2px] font-medium" v-for="(task, i) in task.tasks">
          <span v-if="i !== 0">| </span>
          <span>#{{ task.task_number }}</span>
        </p>
      </div>
    </div>
  </div>

  <div v-else class="border rounded-md text-xs px-2 py-[5px] shadow relative hover-transition hover:opacity-80 cursor-pointer hover:scale-[102%] hover:!z-[25]" :style="styling">
    <div class="overflow-y-hidden h-full">
      <p class="leading-none font-medium font-inter" :class="lineClamper">{{ task.title }}</p>
      <span class="text-[10px]" v-if="!layout">#{{ task.task_number }}</span>
    </div>
  </div>
</template>
<script setup>
  import timeHandler from "@/composables/timeHandler";
  import colorHandler from "@/composables/colorHandler";
  import { ref } from "vue";

  const props = defineProps({
    task: {
      type: Object
    },
    // Should display more task
    moreTask: {
      type: Boolean,
      default: false
    },
    // Inside a more task menu
    subTask : {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: null
    }
  });
  const emit = defineEmits(['openMoreTask'])
  const { taskHeight, diffBetweenTwoTimes } = timeHandler();
  const { getTaskColors } = colorHandler();
  const styling = ref('');
  const lineClamper = ref('line-clamp-2');
  const color = ref(getTaskColors(props.task.task_color));

  if (!props.moreTask) {
    if (!props.subTask) {
      if (props.task.task_time_end && props.task.task_time_end > props.task.task_time && !props.layout) {
        styling.value = "height: " + ((diffBetweenTwoTimes(props.task.task_time, props.task.task_time_end, 'minutes')*taskHeight.minute)-2) + "px;";
      } else if (props.layout) {
        styling.value = "height: 25px;"
      } else {
        styling.value = "height: 50px;"
      }
      if (props.layout) {
        styling.value += " margin-top: 2px;";
      } else {
        styling.value += " margin-top:" + props.task.diff * taskHeight.minute + "px;";
      }
      if (props.task.task_time) {
        if (props.task.task_time.slice(0, 2) === '00') {
          styling.value += " z-index: 1;";
        } else {
          styling.value += " z-index:" + props.task.task_time.slice(0, 2) + ";";
        }
      } else {
        styling.value += " z-index: 1;";
      }
    }
    styling.value += " background-color:" + color.value['background'] + ";";
    styling.value += " color:" + color.value['text'] + ";";
    styling.value += " border-color:" + color.value['border'] + ";";
  }

  const openMoreTaskToggle = ref(false);

  const openMoreTask = () => {
    emit('openMoreTask');

    return openMoreTaskToggle.value = !openMoreTaskToggle.value;
  }

  const hideOpenMoreTask = () => {
    openMoreTaskToggle.value = false;
  }

</script>