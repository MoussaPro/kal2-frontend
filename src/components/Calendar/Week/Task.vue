<template>
  <div v-if="task.moreTask" class="h-full relative z-50">
    <Calendar-Week-Box :task="task" :moreTask="task.moreTask" @openMoreTask="openMoreTask = !openMoreTask"/>

    <!-- Tasks slider -->
    <div class="absolute hover-transition top-[50%] -translate-y-1/2 left-[105%] w-[200px] z-99 bg-gray-100 rounded-md px-2 drop-shadow-4xl border-2 border-gray-200" v-if="openMoreTask">
      <Calendar-Week-Box :task="task" :subTask="true" v-for="(task) in task.tasks" @click="$emit('clicked', task)" class="my-[10px] h-10" />
    </div>
  </div>
  <div v-else>
    <Calendar-Week-Box :task="task" @click="$emit('clicked', task)" />
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const props = defineProps({
    task: {
      type: Object,
      required: true
    }
  });

  const openMoreTask = ref(false);
</script>