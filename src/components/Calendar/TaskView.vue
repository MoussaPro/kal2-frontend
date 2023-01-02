<template>
  <div class="w-full" v-if="task">
    <div class="max-w-full rounded-md shadow-md p-2" :class="color[0].css">
      <div class="font-semibold font-inter text-[16px] overflow-x-scroll relative whitespace-nowrap" :class="task.task_color === 'yellow' ? 'text-black' : 'text-white'">{{ task.title }}</div>
    </div>

    <div class="py-5">
      <div class="grid grid-cols-2 gap-x-5 text-gray-700 h-full">
        <div class="text-center bg-gray-50 rounded-md p-2" :class="!task_ends ? 'col-span-full' : ''">
          <p class="font-inter text-[15px] leading-none font-medium mb-1">Opgave start</p>
          <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date">Dato: {{ dateCalender(task.task_date, false) }}</p>
          <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time">Tidspunkt: {{ task.task_time.slice(0, 5) }}</p>
          <p class="text-[13.5px] tracking-[0.3px] font-medium" v-if="task.task_all_day && !task.task_date_end">Hele dagen</p>
        </div>

        <div class="text-center bg-gray-50 rounded-md p-2 text-gray-700 h-full flex flex-col items-center justify-center" v-if="task_ends">
          <p class="font-inter text-[15px] leading-none font-medium mb-1">Opgave slut</p>
          <div>
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date_end">Dato: {{ dateCalender(task.task_date_end, false) }}</p>
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time_end">Tidspunkt: {{ task.task_time_end.slice(0, 5) }}</p>
          </div>
        </div>
      </div>

      <!-- @TODO table and styling new type "description" -->
      <div class="grid grid-cols-3 gap-5 p-5" v-if="fields">
        <div v-for="field in fields" class="text-gray-700">
          <div class="text-[14px] tracking-[0.3px]">{{ field.title }}:</div>
          <div class="text-[13px] text-gray-800 font-medium tracking-[0.3px]">{{ fieldValue(field.value, field.type) }}</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
  import colorHandler from "@/composables/colorHandler";
  import { ref } from "vue";
  import dateHandler from "@/composables/dateHandler";
  const { colors } = colorHandler();
  const { dateCalender } = dateHandler();

  const props = defineProps({
    task: Object
  });

  const color = ref();
  const task_ends = props.task.task_date_end || props.task.task_time_end;

  color.value = colors.filter(color => {
    return color.name === props.task.task_color
  });

  const fields = ref(JSON.parse(props.task.fields));

  const fieldValue = (value, type) => {
    // @TODO TYPE (stk, liter, etc...)
    switch(type) {
      case 'valuta':
        return value + ' kr';
      default:
        return value;
    }
  }
</script>