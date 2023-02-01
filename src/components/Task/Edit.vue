<template>
  <div class="h-full w-full relative flex flex-col justify-between">
    <div class="px-1 mt-2 relative">
      <Api-Local-Loading :loading="loading" />
      <div class="flex items-end">
        <ColorPicker @color="(n) => color = n" :color="color" />
        <input type="text" id="title" name="title" v-model="title" class="input-field-non-border ml-5" placeholder="Tilføj titel">
      </div>
      <div class="flex mt-4 items-center">
        <div class="h-16">
          <p class="font-inter text-[13px] text-gray-800 mb-1">Opgave start</p>
          <div class="-mx-1 flex items-center">
            <div class="w-32 px-1">
              <DateButton :setMaxDate="endDate" :prefill="startDate" @date="(n) => startDate = n"/>
            </div>
            <div class="w-24 px-1" v-if="!allDaySwitch">
              <TimeButton :prefill="startTime" @time="(n) => startTime = n" />
            </div>
          </div>
        </div>
        <div class="flex">
          <div class="mt-5 text-gray-600 flex items-center text-sm font-light" :class="allDaySwitch ? 'mx-16' : 'mx-10'">
            til
          </div>
          <div>
            <p class="font-inter text-[13px] text-gray-800 mb-1">Opgave slut</p>
            <div class="-mx-1 flex items-center">
              <transition name="slide-fade" class="h-9">
                <div v-if="allDaySwitch" class="w-32 px-1">
                  <DateButton :prefill="endDate" :setMinDate="startDate" datePickerPosition="right-[-20px]" :setToday="false" @date="(n) => endDate = n"/>
                </div>
              </transition>
              <div class="w-24 px-1" v-if="!allDaySwitch">
                <TimeButton :prefill="endTime" @time="(n) => endTime = n" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-x-5">
        <SwitchButton title="Hele dagen" :checked="allDaySwitch" @clicked="toggleAllDaySwitch" />
      </div>

      <div class="mt-5">
        <p class="text-[14px] font-medium text-gray-700">Tilknytning</p>
        <Inputs-Directories-Container :containerDirectories="containerDirectories" @taskDataDirectories="setDataDirectories" :jsonData="dataDirectories"/>
      </div>

      <div class="mt-8">
        <Inputs-Fields-Container @taskFields="setFields" :containerFields="containerFields" :jsonData="fields" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  import colorHandler from "@/composables/colorHandler";
  const { dateCalender } = dateHandler();
  const { colors } = colorHandler();

  const props = defineProps({
    task: {
      type: Object,
      required: true
    },
    containerFields: {
      type: Array || null,
    },
    containerDirectories: {
      type: Array || null,
    }
  });

  const taskId = ref(null);
  const startDate = ref(null);
  const startTime = ref(null);
  const endDate = ref(null);
  const endTime = ref(null);
  const title = ref(null);
  const fields = ref(null);
  const dataDirectories = ref(null);
  const color = ref({});
  const allDaySwitch = ref(false);
  const loading = ref(false);

  // Fill the whole task
  if (props.task) {
    loading.value = true;
    title.value = props.task.title ? props.task.title : null;
    allDaySwitch.value = !!props.task.task_date_end;
    color.value = colors.filter((color) => { return props.task.task_color === color.name })[0]; // Find color object by the name we get
    startDate.value = props.task.task_date ? dateCalender(props.task.task_date, false) : null; // Convert to date Calendar (Danish)
    endDate.value = props.task.task_date_end ? dateCalender(props.task.task_date_end, false) : null; // Convert to date Calendar (Danish)
    startTime.value = props.task.task_time ? props.task.task_time.slice(0, 5) : null; // Slice as we get the date in milliseconds
    endTime.value = props.task.task_time_end ? props.task.task_time_end.slice(0, 5) : null; // Slice as we get the date in milliseconds
    fields.value = props.task.fields ? props.task.fields : null;
    dataDirectories.value = props.task.data ? props.task.data : null;
    taskId.value = props.task.id ?? null;
    loading.value = false;
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

  const setDataDirectories = (getDataDirectories) => {
    dataDirectories.value = getDataDirectories;
  }

  const getTask = () => {
    // Return the new informations to parent
    return {
      title: title.value,
      allDaySwitch: allDaySwitch.value,
      color: color.value,
      startDate: startDate.value,
      startTime: startTime.value,
      endDate: endDate.value,
      endTime: endTime.value,
      fields: fields.value,
      data: dataDirectories.value,
      taskId: taskId.value
    };
  }

  defineExpose({
    getTask
  });
</script>