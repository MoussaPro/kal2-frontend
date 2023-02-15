<template>
  <div>
    <Api-Server-Loading v-if="loading" class="mt-10"/>
    <div v-if="!loading && task" class="bg-gray-100 max-w-[900px] p-2 lg:mb-10 lg:border border-gray-200 lg:mx-auto lg:mt-10">
      <div class="max-w-full rounded-md shadow-md p-2" :class="color.css">
        <div class="font-semibold font-inter text-[16px] overflow-x-scroll relative whitespace-nowrap" :class="task.task_color === 'yellow' ? 'text-black' : 'text-white'">#{{ task.task_number }} {{ task.title }}</div>
      </div>

      <div class="py-2">
        <div class="grid lg:grid-cols-2 gap-x-5 text-gray-700 h-full">
          <div class="rounded-md p-2" :class="[{'col-span-full': !task_ends}, color.boxCss]">
            <p class="font-inter text-[15px] leading-none font-medium mb-1" :class="color.text">Opgave start</p>
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date">Dato: {{ dateCalender(task.task_date, false) }}</p>
            <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time">Tidspunkt: {{ task.task_time.slice(0, 5) }}</p>
            <p class="text-[13.5px] tracking-[0.3px] font-medium" v-if="task.task_all_day && !task.task_date_end">Hele dagen</p>
          </div>

          <div class="rounded-md p-2 h-full mt-2 lg:mt-0 flex flex-col justify-center" :class="color.boxCss" v-if="task_ends">
            <p class="font-inter text-[15px] leading-none font-medium mb-1" :class="color.text">Opgave slut</p>
            <div class="text-gray-700">
              <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_date_end">Dato: {{ dateCalender(task.task_date_end, false) }}</p>
              <p class="text-[13.5px] tracking-[0.3px]" v-if="task.task_time_end">Tidspunkt: {{ task.task_time_end.slice(0, 5) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-5" v-if="task.data && task.data.length > 0">
          <h3 class="font-bold text-lg font-inter mb-1">Tilknytninger</h3>
          <div class="flex flex-wrap gap-2">
            <div v-for="data in task.data" :key="data.id" class="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md">
              <div class="text-xs text-gray-800"><span class="font-medium">{{ data.directory_title }}: </span> {{ getDataDirectoryIdentifier(data) }}</div>
            </div>
          </div>
        </div>

        <div class="mt-5" v-if="task.fields">
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
  </div>
</template>
<script setup>
  import { useRoute } from "vue-router/dist/vue-router";
  import { computed, onBeforeMount, ref } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  import colorHandler from "@/composables/colorHandler";
  import dateHandler from "@/composables/dateHandler";
  import fieldHandler from "@/composables/fieldHandler";

  const { colors } = colorHandler();
  const { dateCalender } = dateHandler();
  const { getDataDirectoryIdentifier } = fieldHandler();

  const route = useRoute();
  const Router = useRouter();
  const token = route.params.token;
  const task = ref();
  const loading = ref(false);

  const task_ends = computed(() => {
    return task.value.task_date_end || task.value.task_time_end;
  });

  const color = computed(() => {
    return colors.filter(color => color.name === task.value.task_color)[0];
  });

  const fieldsDescription = computed(() => {
    return task.value.fields.filter((field) => field.type === 'beskrivelse')
  });

  const fieldsNoDescription = computed(() => {
    return task.value.fields.filter((field) => field.type !== 'beskrivelse')
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
  onBeforeMount(() => {
    loading.value = true;

    axios.get('/opgave/'+token).then((response) => response.data).then((response) => {
      task.value = response.task;
      loading.value = false;
    }).catch((error) => {
      if (error && error.response && error.response.status === 404) {
        Router.push('/');
        loading.value = false;
      }
    });
  })
</script>