<template>
  <div>
    <PopUp boxClass="max-h-[95vh] w-[750px]" :overflowY="true" @close="$emit('close')">
      <Api-Local-Loading :loading="loading"/>
      <Task-View :task="task" v-if="!editMode"/>
      <div class="h-full w-full relative flex flex-col justify-between" v-if="editMode">
        <!-- @TODO edit task -->
      </div>
    </PopUp>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const props = defineProps({
    task: Object
  });

  const editMode = ref(false);
  const emit = defineEmits(['close', 'created']);
  const startDate = ref(null);
  const startTime = ref(null);
  const endDate = ref(null);
  const endTime = ref(null);
  const title = ref(props.task.title);
  const fields = ref(null);
  const color = ref('green');
  const endSwitch = ref(false);
  const allDaySwitch = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const errorMsg = ref(null);

  const toggleEndSwitch = () => {
    endSwitch.value = !endSwitch.value;

    if (endSwitch.value === false) {
      endDate.value = null;
      endTime.value = null;
    }
  }

  const toggleAllDaySwitch = () => {
    allDaySwitch.value = !allDaySwitch.value;

    if (allDaySwitch.value === true) {
      startTime.value = null;
      endTime.value = null;
    }
  }

  const setFields = (getFields) => {
    fields.value = getFields;
  }
</script>