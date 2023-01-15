<template>
  <div class="w-full" v-if="task">
    <div class="max-w-full rounded-md shadow-md p-2" :class="color.css">
      <div class="font-semibold font-inter text-[16px] overflow-x-scroll relative whitespace-nowrap" :class="task.task_color === 'yellow' ? 'text-black' : 'text-white'">#{{ task.task_number }} {{ task.title }}</div>
    </div>
    <div class="py-2">
      <div class="grid grid-cols-2 gap-x-5 text-gray-700 h-full">
        <div class="rounded-md p-2" :class="[{'col-span-full': !task_ends}, color.boxCss]">
          <p class="font-inter text-[15px] leading-none font-medium mb-1" :class="color.text">Opgave start</p>
          <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date">Dato: {{ dateCalender(task.task_date, false) }}</p>
          <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time">Tidspunkt: {{ task.task_time.slice(0, 5) }}</p>
          <p class="text-[13.5px] tracking-[0.3px] font-medium" v-if="task.task_all_day && !task.task_date_end">Hele dagen</p>
        </div>

        <div class="rounded-md p-2 h-full flex flex-col justify-center" :class="color.boxCss" v-if="task_ends">
          <p class="font-inter text-[15px] leading-none font-medium mb-1" :class="color.text">Opgave slut</p>
          <div class="text-gray-700">
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date_end">Dato: {{ dateCalender(task.task_date_end, false) }}</p>
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time_end">Tidspunkt: {{ task.task_time_end.slice(0, 5) }}</p>
          </div>
        </div>
      </div>

      <div class="mt-5" v-if="fields">
        <h3 class="font-bold text-lg font-inter mb-1">Om opgaven</h3>
        <div v-if="fieldsNoDescription.length > 0" class="flex flex-wrap w-full mx-[-5px]">
          <div v-for="field in fieldsNoDescription" class="text-gray-700 bg-gray-50 rounded-md flex-grow px-1 py-2 m-[5px] border border-gray-100 min-w-[20%] flex">
            <div class="text-[12px] tracking-[0.3px] font-medium">{{ field.title }}:</div>
            <div class="text-[12px] text-gray-800 font-light tracking-[0.3px] ml-1">{{ fieldValue(field.value, field.type) }}</div>
          </div>
        </div>

        <div class="mt-5" v-if="fieldsDescription.length > 0">
          <div class="w-full" v-for="field in fieldsDescription">
            <div class="text-[14px] tracking-[0.3px]">{{ field.title }}</div>
            <div class="w-full bg-gray-50 rounded-md p-2 mb-3">
              <div class="text-[12px] text-gray-800 font-medium tracking-[0.3px]" v-html="field.value"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import colorHandler from "@/composables/colorHandler";
  import { computed, ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  const { colors } = colorHandler();
  const { dateCalender } = dateHandler();

  const props = defineProps({
    task: Object
  });

  const task_ends = props.task.task_date_end || props.task.task_time_end;
  const fields = ref(JSON.parse(props.task.fields));

  const color = computed(() => {
    return colors.filter(color => color.name === props.task.task_color)[0];
  })

  const fieldsDescription = computed(() => {
    return fields.value.filter((field) => field.type === 'beskrivelse')
  });

  const fieldsNoDescription = computed(() => {
    return fields.value.filter((field) => field.type !== 'beskrivelse')
  });

  const fieldValue = (value, type) => {
    // @TODO TYPE (stk, liter, etc...)
    switch(type) {
      case 'valuta':
        return value ? value + ' kr' : '';
      default:
        return value;
    }
  }
</script>