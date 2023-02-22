<template>
  <Layout-Block>
    <div :class="titleClass">
      <span v-if="tasks.length === 1">{{ tasks.length }} {{ title.oneTask }}</span>
      <span v-else>{{ tasks.length }} {{ title.manyTask }}</span>
    </div>
    <div class="max-h-[190px] overflow-y-scroll" v-if="tasks.length">
      <div v-for="(task, index) in tasks" @click="$emit('selectedTask', task)" :class="[getTaskColor(task.task_color), boxClass]">
        <p class="line-clamp-1">#{{ task.task_number }} {{ task.title }}</p>
      </div>
    </div>
    <div v-else>
      <Empty :hideButton="true" text="Ingen opgaver fundet" />
    </div>
  </Layout-Block>
</template>
<script setup>
  import colorHandler from "@/composables/colorHandler";

  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    },
    title: {
      type: Object,
      default: {
        oneTask: 'opgave',
        manyTask: 'opgaver'
      }
    }
  });

  const { colors } = colorHandler();
  const titleClass = 'text-[15px] font-inter font-medium bg-gray-200 -m-1 mb-0 p-3 rounded-t-md';
  const boxClass = 'w-full h-auto px-2 py-[5px] rounded-md shadow text-white mt-[8px] shadow text-xs font-medium font-inter hover:opacity-80 cursor-pointer overflow-hidden';

  const getTaskColor = (task_color) => {
    return colors.filter(color => color.name === task_color)[0].css;
  }
</script>