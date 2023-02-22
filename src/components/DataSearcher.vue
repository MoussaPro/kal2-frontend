<template>
  <div>
    <div class="bg-gray-50">
      <div class="grid divide-x divide-border-gray-300 py-5" :class="directoryData ? 'grid-cols-2' : 'grid-cols-3'">
        <div class="px-5" v-if="!directoryData">
          <div class="font-medium">1. Søg efter</div>
          <div class="relative" v-if="!search.data">
            <Popups-DataDirectory-Dropdown :fullWidth="true" :showCreate="false" :containerDirectories="containerDirectories" v-if="showDirectoriesPopup" @hide="hideDirectoriesPopup" @onChosen="updateChoosenDataDirectories"/>

            <div class="flex justify-between items-center py-2">
              <div class="rounded-md shadow py-[5px] px-3 font-inter text-left text-[12px] font-medium flex items-center hover-transition w-full cursor-pointer" :class="showDirectoriesPopup ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-primary hover:border-primary hover:text-white'" @click="showDirectoriesPopup = true">
                Vælg fra kartotek
              </div>
            </div>
            <div class="text-red-600 text-xs font-semibold font-inter hover-transition" v-if="searchErrorData">Vælg venligst!</div>
          </div>
          <div v-if="search.data">
            <div class="flex items-center text-white font-bold justify-between bg-primary-Darker px-2 py-2 mt-2 rounded-md">
              <div class="text-xs"><span class="font-medium">{{ search.data.directory_title }}: </span> {{ getDataDirectoryIdentifier(search.data) }}</div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" @click="search.data = null" class="w-4 ml-2 cursor-pointer hover:text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        <div class="px-5">
          <div class="font-medium"><span v-if="!directoryData">2.</span><span v-else>1.</span> Hent data</div>
          <div class="relative">
            <div class="bg-white shadow-md max-h-[400px] w-[600px] overflow-scroll mt-2 rounded-md p-3 absolute top-[40px]" :class="directoryData ? 'left-0' : 'left-[-175px]'" v-if="showFieldsPopup" v-click-outside="hideFieldsPopup">
              <div v-for="(fields, index) in containerFields" :key="fields.id">
                <template v-if="fields.fields.filter((f) => f.type === 'valuta' || f.type === 'tal').length">
                  <div class="font-medium text-gray-700 mb-1">{{ fields.title }}</div>
                  <div class="flex gap-x-2 flex-wrap mb-4">
                    <div v-for="field in fields.fields.filter((f) => f.type === 'valuta' || f.type === 'tal')" @click="addOrRemoveFilter(field)" class="min-w-[60px] rounded-md px-2 py-1 cursor-pointer text-[13px] hover-transition" :class="isInFilter(field) ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'" :key="field.id">{{ field.title }}</div>
                  </div>
                </template>
              </div>
            </div>

            <div class="rounded-md shadow py-[5px] my-2 px-3 font-inter text-left text-[12px] w-full font-medium flex items-center hover-transition cursor-pointer" :class="showFieldsPopup ? (search.filter.length ? 'bg-primary-Darker1 text-white' : 'bg-primary-Darker1 text-white') : (search.filter.length ? 'bg-primary-Darker text-white hover:bg-primary-Darker1' : 'bg-gray-100 hover:bg-primary hover:border-primary hover:text-white')" @click="showFieldsPopup = true">
              <span v-if="search.filter.length === 0">Vælg data</span>
              <span v-else>{{ search.filter.length > 1 ? search.filter.length + ' Felter valgte' : '1 Felt valgt' }}</span>
            </div>
            <div class="text-red-600 text-xs font-semibold font-inter hover-transition" v-if="searchErrorFilter">Vælg venligst!</div>
          </div>
        </div>
        <div class="px-5">
          <div class="font-medium"><span v-if="!directoryData">3.</span><span v-else>2.</span> Vælg dato</div>
          <div class="relative">
            <DatePicker is-expanded show-iso-weeknumbers is-range v-model="search.dates" class="absolute top-[45px]" v-if="showDatePopup" v-click-outside="hideDatePopup"/>

            <div class="rounded-md shadow py-[5px] my-2 px-3 font-inter text-left text-[12px] w-full font-medium flex items-center hover-transition cursor-pointer" :class="showDatePopup ? (search.dates ? 'bg-primary-Darker1 text-white' : 'bg-primary-Darker1 text-white') : (search.dates ? 'bg-primary-Darker text-white hover:bg-primary-Darker1' : 'bg-gray-100 hover:bg-primary hover:border-primary hover:text-white')" @click="showDatePopup = true">
              <span v-if="!search.dates">Vælg dato</span>
              <span v-else>{{ printBetweenDates(search.dates) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-5">
        <button class="py-2 px-6 rounded-lg text-sm text-gray-800 font-inter hover-transition hover:bg-primary hover:text-white" :disabled="loading" :class="loading ? 'bg-gray-300' : 'bg-gray-200'" @click="sendSearch">
          <span v-if="!loading" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Søg
          </span>
          <span v-else>
            Søger...
          </span>
        </button>
      </div>
    </div>

    <div class="min-h-[200px] relative mt-10" v-if="loading">
      <Api-Local-Loading :loading="loading" class="bg-gray-200"/>
    </div>
    <div v-else-if="results && getTotal(results)">
      <div class="text-xl font-inter font-medium mt-5">Resultater</div>
      <template v-for="(tasks, date) in results">
        <div class="bg-gray-50 my-2 p-2" v-if="shareInDates(tasks.filter((task) => task.task_date === date))">
          <div class="text-[15px] mb-2 font-medium">{{ printDate(date) }} <span class="text-xs">({{ tasks.filter((task) => task.task_date === date).length }} opgaver)</span></div>
          <div class="grid grid-cols-5 gap-2">
            <div class="text-gray-800 text-xs bg-gray-100 py-2 flex items-center text-center justify-center flex-col" v-for="(data, index) in shareInDates(tasks.filter((task) => task.task_date === date))">
              <div>{{ data.title }}</div>
              <div class="font-medium">{{ data.value }} <span v-if="data.type === 'valuta'"> kr.</span></div>
            </div>
          </div>
        </div>
      </template>

      <div class="text-xl font-inter font-medium mt-5 mb-2">Total <span class="text-xs">({{ totalTaskCounter(results) }} opgaver ialt)</span></div>
      <div class="bg-gray-200 p-2 gap-2 grid grid-cols-5">
        <div class="text-gray-800 text-xs bg-gray-100 py-2 flex items-center text-center justify-center flex-col" v-for="(data, index) in getTotal(results)">
          <div>{{ data.title }}</div>
          <div class="font-medium">{{ data.value }} <span v-if="data.type === 'valuta'"> kr.</span></div>
        </div>
      </div>
    </div>
    <div class="mt-10" v-else-if="results">
      <Empty text="Ingne resultater fundet" :hideButton="true"/>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";
  import dateHandler from "@/composables/dateHandler";
  import { DatePicker } from 'v-calendar';
  import 'v-calendar/dist/style.css';
  import axios from "axios";

  const props = defineProps({
    containerDirectories: {
      type: Array
    },
    containerFields: {
      type: Array
    },
    directoryData: {
      type: Object,
      default: null
    }
  });

  const { getDataDirectoryIdentifier } = fieldHandler();
  const { dateToTimestamp, getDay, getMonth, getYear, printBetweenDates } = dateHandler();

  const results = ref();
  const showDirectoriesPopup = ref();
  const showFieldsPopup = ref();
  const showDatePopup = ref();
  const loading = ref(false);
  const total = ref([]);
  const error = ref();
  const searchErrorData = ref(false);
  const searchErrorFilter = ref(false);

  const search = ref({
    data: props.directoryData ? props.directoryData : null,
    filter: [],
    dates: null
  });

  const totalTaskCounter = (result) => {
    let total = 0;

    if (result) {
      Object.values(result).forEach((dates) => {
        total += dates.length;
      });
    }

    return total;
  }

  const shareInDates = (tasks) => {
    let filteredTasks = [];

    // Get all fields from the tasks where value is not null
    tasks.forEach((task) => {
      return task.fields.forEach((field) => {
        if (field.value !== null)
          filteredTasks.push(field);
      });
    });

    filteredTasks = removeNonSearchedFilter(filteredTasks, search.value.filter);

    filteredTasks = sumTotal(filteredTasks);

    return filteredTasks.length ? filteredTasks : null;
  }

  const getTotal = (result) => {
    let tasks = [];

    // Remove all object keys from result
    Object.values(result).forEach((dateTasks) => {
      dateTasks.forEach((task) => {
        tasks.push(task);
      })
    });

    return shareInDates(tasks);
  }

  const sumTotal = (array) => {
    return Object.values(array.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = { id: item.id, value: item.value, title: item.title, type: item.type };
      } else {
        acc[item.id].value += item.value;
      }
      return acc;
    }, {}));
  }

  const removeNonSearchedFilter = (array, searchedArray) => {
    return array.filter(item1 => {
      return searchedArray.some(item2 => item1.id === item2.id);
    });
  }

  const hideDirectoriesPopup = () => {
    showDirectoriesPopup.value = false;
  }

  const hideFieldsPopup = () => {
    showFieldsPopup.value = false;
  }

  const hideDatePopup = () => {
    showDatePopup.value = false;
  }

  const updateChoosenDataDirectories = (dataDirectory) => {
    searchErrorData.value = false;
    search.value.data = dataDirectory;
  }

  const addOrRemoveFilter = (field) => {
    searchErrorFilter.value = false;

    if (isInFilter(field)) {
      search.value.filter = search.value.filter.filter((f) => {
        return f !== field;
      });
    } else {
      search.value.filter.push(field);
    }
  }

  const isInFilter = (field) => {
    let isIn = false;

    search.value.filter.forEach((f) => {
      if (f.id === field.id) {
        isIn = true;
      }
    });

    return isIn;
  }

  const printDate = (date) => {
    let prettyDate =  dateToTimestamp(date);
    return getDay(prettyDate) +'. '+ getMonth(prettyDate, 'name').slice(0,3) + ' ' + getYear(prettyDate);
  }

  const sendSearch = () => {
    let error = false;
    searchErrorData.value = false;
    searchErrorFilter.value = false;

    if (search.value.data === null) {
      searchErrorData.value = true;
      error = true;
    }

    if (search.value.filter.length === 0) {
      searchErrorFilter.value = true;
      error = true;
    }

    if (!error) {
      getData();
    }
  }

  const getData = () => {
    loading.value = true;
    total.value = [];

    try {
      axios.post('/data/search', {
        data: search.value.data,
        filter: search.value.filter,
        dates: search.value.dates,
      },{
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        results.value = response.tasks;
        loading.value = false;
      }).catch((response) => {
        error.value = response;
      });
    } catch(e) {
      error.value = e;
    }
  }
</script>