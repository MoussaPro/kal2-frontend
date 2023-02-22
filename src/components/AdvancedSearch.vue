<template>
  <!-- @TODO GRID COLS 4 FOR THE NEW FIELD -->
  <div class="rounded-md grid grid-cols-3 gap-x-10 hover-transition bg-gray-100 p-3 pb-20 mt-3 -mb-5">
    <div class="relative">
      <div class="text-gray-600 font-medium text-sm ml-1">Inkluderet</div>
      <Popups-DataDirectory-Dropdown :fullWidth="true" topMargin="top-[55px]" :showCreate="false" :containerDirectories="containerDirectories" v-if="showIncluded" @hide="showIncluded = false;" :chosenDirectories="search.included" @onChosen="updateIncluded"/>

      <div :class="showIncluded ? buttonClassActive : buttonClassInactive" @click="showIncluded = true">
        Vælg fra kartotek
      </div>
      <div v-if="search.included && search.included.length" class="flex flex-wrap mt-2 gap-2">
        <div v-for="(data, index) in search.included" class="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md" :key="'included' + data.id">
          <div class="text-xs text-gray-800"><span class="font-medium">{{ data.directory_title }}: </span>{{ getDataDirectoryIdentifier(data) }}</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" @click="updateIncluded(data)" class="w-4 ml-2 cursor-pointer hover:text-red-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
    <div class="relative">
      <div class="text-gray-600 font-medium text-sm ml-1">Ekskluderet</div>
      <Popups-DataDirectory-Dropdown :fullWidth="true" topMargin="top-[55px]" :showCreate="false" :containerDirectories="containerDirectories" v-if="showExcluded" @hide="showExcluded = false;" :chosenDirectories="search.excluded" @onChosen="updateExcluded"/>

      <div :class="showExcluded ? buttonClassActive : buttonClassInactive" @click="showExcluded = true">
        Vælg fra kartotek
      </div>
      <div v-if="search.excluded && search.excluded.length" class="flex flex-wrap mt-2 gap-2">
        <div v-for="(data, index) in search.excluded" class="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md" :key="'included' + data.id">
          <div class="text-xs text-gray-800"><span class="font-medium">{{ data.directory_title }}: </span>{{ getDataDirectoryIdentifier(data) }}</div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" @click="updateExcluded(data)" class="w-4 ml-2 cursor-pointer hover:text-red-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
    <!-- @TODO FIELDS -->
    <div class="relative">
      <div class="text-gray-600 font-medium text-sm">Dato</div>
      <DatePicker is-expanded show-iso-weeknumbers is-range v-model="search.dates" class="absolute top-[45px]" v-if="showDates" v-click-outside="hideDates"/>

      <div :class="showDates ? buttonClassActive : buttonClassInactive" @click="showDates = true">
        <span v-if="!search.dates">Vælg dato</span>
        <span v-else>{{ printBetweenDates(search.dates) }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
  import { DatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  import fieldHandler from "@/composables/fieldHandler";
  import dateHandler from "@/composables/dateHandler";
  const { getDataDirectoryIdentifier } = fieldHandler();
  const { printBetweenDates } = dateHandler();

  const props = defineProps({
    containerFields: {
      type: Array
    },
    containerDirectories: {
      type: Array
    },
    searchcriteria: {
      type: Object
    }
  })

  const showIncluded = ref(false);
  const showExcluded = ref(false);
  const showFields = ref(false);
  const showDates = ref();

  const search = ref({
    included: props.searchcriteria ? props.searchcriteria.included : [],
    excluded: props.searchcriteria ? props.searchcriteria.excluded : [],
    fields: props.searchcriteria ? props.searchcriteria.fields : [],
    dates: props.searchcriteria ? props.searchcriteria.dates : null
  });

  const emit = defineEmits(['searchcriteria']);

  // Css for the buttons
  const buttonClass = 'rounded-md mt-1 shadow py-[5px] px-3 font-inter text-left text-[12px] font-medium flex items-center hover-transition w-full cursor-pointer';
  const buttonClassInactive = buttonClass + ' bg-white hover:bg-primary hover:border-primary hover:text-white';
  const buttonClassActive = buttonClass + ' bg-primary text-white';

  const updateIncluded = (data) => {
    let isDuplicate = false;

    // Check if the clicked data not already exists
    search.value.included.forEach((chosenData) => {
      if (chosenData.id === data.id) {
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      search.value.included.push(data);
    } else {
      search.value.included = search.value.included.filter(removedData => data !== removedData);
    }

    emit('searchcriteria', search.value);
  }

  const updateExcluded = (data) => {
    let isDuplicate = false;

    // Check if the clicked data not already exists
    search.value.excluded.forEach((chosenData) => {
      if (chosenData.id === data.id) {
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      search.value.excluded.push(data);
    } else {
      search.value.excluded = search.value.excluded.filter(removedData => data !== removedData);
    }

    emit('searchcriteria', search.value);
  }

  watch(() => search.value.dates, () => {
    console.log(search.value.dates);
    emit('searchcriteria', search.value);
  });

  const hideDates = () => {
    showDates.value = false;
  }
</script>