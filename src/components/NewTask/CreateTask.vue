<template>
  <div>
    <PopUp boxClass="max-h-[80vh] min-h-[470px] flex" :overflowY="true" @close="$emit('close')">
      <Api-Local-Loading :loading="loading"/>
      <div class="h-full w-full relative flex flex-col justify-between">
        <div class="px-1 mt-2 relative">
          <Api-Local-Error :error="error" :message="errorMsg" class="my-5" />
          <div class="flex items-end">
            <NewTask-ColorPicker @color="(n) => color = n" />
            <input type="text" id="title" name="title" v-model="title" class="input-field-non-border ml-5" placeholder="Tilføj titel">
          </div>
          <div class="flex mt-4 items-center">
            <div class="h-16">
              <p class="font-inter text-[13px] text-gray-800 mb-1">Opgave start</p>
              <div class="-mx-1 flex items-center">
                <div class="w-32 px-1">
                  <NewTask-DateButton :setMaxDate="endDate" @date="(n) => startDate = n"/>
                </div>
                <div class="w-24 px-1" v-if="!allDaySwitch">
                  <NewTask-TimeButton @time="(n) => startTime = n" />
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
                      <NewTask-DateButton :setMinDate="startDate" datePickerPosition="right-[-20px]" :setToday="false" @date="(n) => endDate = n"/>
                    </div>
                  </transition>
                  <div class="w-24 px-1" v-if="!allDaySwitch">
                    <NewTask-TimeButton @time="(n) => endTime = n" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-x-5">
            <SwitchButton title="Hele dagen" @clicked="toggleAllDaySwitch" />
          </div>

          <div class="mt-8">
            <NewTask-Fields-FieldsContainer @taskFields="setFields" />
          </div>
        </div>

        <div class="mt-5">
          <button @click="createTask" class="text-sm font-inter text-gray-700 font-medium py-3 px-5 rounded-md hover-transition" :class="!loading ? 'bg-gray-200 hover:bg-primary hover:text-white' : 'bg-gray-400'">
          <span v-if="!loading" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="4" stroke="currentColor" class="w-4 mr-[5px]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Opret opgave
          </span>
            <span v-else class="flex items-center text-white">
            <img src="@/assets/images/loader.gif" class="w-5 mr-2" alt="loader"/>
            Indlæser...
          </span>
          </button>
        </div>
      </div>
    </PopUp>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import axios from "axios";

  const emit = defineEmits(['close', 'created']);
  const startDate = ref(null);
  const startTime = ref(null);
  const endDate = ref(null);
  const endTime = ref(null);
  const title = ref(null);
  const fields = ref(null);
  const color = ref('green');
  const allDaySwitch = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const errorMsg = ref(null);

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

  const createTask = async () => {
    error.value = false;

    if (startDate.value === null) {
      error.value = true;
      errorMsg.value = 'Vælg venligst en dato';
    }

    if (title.value === null) {
      error.value = true;
      errorMsg.value = 'Angiv venligst en overskrift';
    }

    if (!loading.value && !error.value) {
      loading.value = true;

      await axios.post('/task', {
        task: {
          title: title.value,
          startDate: startDate.value,
          startTime: startTime.value ? startTime.value : (allDaySwitch.value ? null : '00:00'),
          color: color.value,
          endDate: endDate.value,
          allDay: allDaySwitch.value,
          endTime: endTime.value,
          fields: fields.value
        }
      }, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        loading.value = false;
        emit('created', response.task);
        emit('close');
      }).catch((response) => {
        error.value = true;
        errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
        loading.value = false;
      });
    } else {
      return false;
    }
  }
</script>
<style lang="css">
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }
</style>