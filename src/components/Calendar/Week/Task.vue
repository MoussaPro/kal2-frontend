<template>
  <div v-if="task.moreTask" class="h-full relative">
    <Calendar-Week-Box :task="task" :moreTask="task.moreTask" @openMoreTask="openMoreTask = !openMoreTask"/>

    <!-- Tasks slider -->
    <div class="absolute hover-transition z-[60] top-[50%] -translate-y-1/2 w-[200px] bg-gray-100 rounded-md px-2 drop-shadow-4xl border-2 border-gray-200" :class="sunday ? 'right-[75%]' : 'left-[75%]'" v-if="openMoreTask">
      <Calendar-Week-Box :task="task" :subTask="true" v-for="(task) in task.tasks" @click="$emit('clicked', task); openMoreTask = false;" class="my-[10px] h-10" />
    </div>
  </div>
  <div v-else>
    <Calendar-Week-Box :task="task" @click="$emit('clicked', task)" />
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  const { getDay, dateToTimestamp } = dateHandler();

  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  });

  const openMoreTask = ref(false);

  const sunday = computed(() => {
    const isSunday = getDay(dateToTimestamp(props.task.date), 'name');
    console.log(isSunday);

    return isSunday === 'søndag';
  });
</script>