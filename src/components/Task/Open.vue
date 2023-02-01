<template>
  <PopUp boxClass="w-[750px]" innerBoxClass="max-h-[95vh] relative" :overflowY="true" @close="closeOpenTask">
    <div id="topScroller" class="h-2 w-2"></div>
    <Api-Local-Error :error="error" :message="errorMsg" class="my-3" />
    <Task-View :task="taskActive" v-if="!editMode" class="p-3"/>
    <Task-Edit :task="taskActive" :containerFields="containerFields" :containerDirectories="containerDirectories" ref="editTask" v-if="editMode" class="p-3"/>

    <transition>
      <div class="absolute w-full h-full top-0 left-0 flex items-center justify-center transition-hover z-[100]" v-if="updatedMessage">
        <div class="bg-primary flex items-center justify-center px-10 py-5 rounded-md shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 mr-3 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-white font-inter font-medium text-lg">Opgave opdateret</div>
        </div>
      </div>
    </transition>

    <transition>
      <div class="absolute w-full h-full bg-black/30 top-0 left-0 flex items-center justify-center transition-hover z-[500]" v-if="deleteBox">
        <div class="bg-gray-100 rounded-md drop-shadow-4xl w-[400px] border border-gray-300">
          <div class="bg-gray-200 p-2 text-gray-500 font-medium text-sm">Bekræftelse</div>
          <div class="p-3 font-medium text-sm">Er du sikker på du vil slette denne opgave?</div>
          <div class="flex items-center p-3 mt-5">
            <button class="flex items-center bg-gray-200 py-3 px-5 rounded-lg text-sm text-gray-800 font-inter hover-transition hover:bg-primary hover:text-white" @click="toggleDeleteBox">Annuller</button>
            <button class="flex items-center text-white py-3 px-5 rounded-lg text-sm font-inter hover-transition ml-2" :disabled="deleteLoading" :class="deleteLoading ? 'bg-red-700' : 'bg-red-500 hover:bg-red-700'" @click="deleteTask">
              <span v-if="!deleteLoading">Slet opgave</span>
              <span v-if="deleteLoading">Sletter...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition>
      <Popups-TaskPublish v-if="showPublishPopup" :isPublished="isPublished" :token="publishToken" @publish="publishTask" @unpublish="unpublishTask" @close="showPublishPopup = false;" />
    </transition>

    <div class="bg-gray-50 sticky bottom-0 p-3 border-t border-gray-100 z-[200]">
      <div v-if="!editMode" class="flex items-center">
        <button class="flex items-center bg-gray-200 py-3 px-5 rounded-lg text-sm text-gray-800 font-inter hover-transition hover:bg-primary hover:text-white" @click="editMode = true;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] mr-[5px]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
          </svg>
          Rediger opgave
        </button>
        <span class="ml-6 mr-5 text-gray-300">|</span>
        <div>
          <button class="text-sm text-gray-700 font-inter underline flex items-center hover-transition hover:text-primary-Darker1" @click="showPublishPopup = true;">
            <span class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-[18px] mr-[5px]">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Send opgave
            </span>
          </button>
          <div class="text-[10px] mt-[2px] text-primary-Darker1 flex items-center" v-if="isPublished">
            <span class="w-2 h-2 rounded-full bg-primary-Darker1 mr-1"></span> Aktiv link
          </div>
        </div>
      </div>
      <div v-if="editMode" class="flex items-center justify-between">
        <button class="py-3 px-5 rounded-lg text-sm font-inter hover-transition text-white" :disabled="loading" :class="loading ? 'bg-primary-Darker1' : 'bg-primary hover:bg-primary-Darker1'" @click="saveTask()">
          <span class="flex items-center" v-if="!loading">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-[18px] mr-[5px]">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Gem ændringer
          </span>
          <span v-else>
            Gemmer...
          </span>
        </button>
        <div class="flex items-center mr-3">
          <button class="text-sm text-gray-700 font-inter underline flex items-center hover-transition hover:text-gray-900" :disabled="loading" @click="editMode = false; hideWarnings()">
            Anuller ændringer
          </button>
          <span class="ml-6 mr-5 text-gray-300">|</span>
          <button class="text-sm text-red-500 font-inter underline flex items-center hover-transition hover:text-red-800" @click="toggleDeleteBox" :disabled="loading">
            Slet opgave
          </button>
        </div>
      </div>
      <div class="text-[11px] text-gray-400 mt-2 flex items-center">
        <p class="font-light" v-if="task.created_at">Oprettet: {{ dateCalenderTime(task.created_at) }}</p>
        <div v-if="task.updated_at && dateCalenderTime(task.updated_at) !== dateCalenderTime(task.created_at)">
          <span class="mx-2">-</span>
          <b class="font-medium">Opdateret: {{ dateCalenderTime(task.updated_at) }}</b>
        </div>
      </div>
    </div>
  </PopUp>
</template>
<script setup>
  import { ref } from "vue";
  import axios from "axios";
  import dateHandler from "@/composables/dateHandler";
  const { dateCalenderTime } = dateHandler();

  const props = defineProps({
    task: {
      type: Object
    },
    containerFields: {
      type: Array || null,
    },
    containerDirectories: {
      type: Array || null,
    }
  });

  const taskActive = ref(props.task);
  const emit = defineEmits(['close', 'updated', 'deleted']);
  const editMode = ref(false);
  const editTask = ref();
  const error = ref(false);
  const errorMsg = ref();
  const loading = ref(false);
  const hasBeenUpdated = ref(false);
  const updatedMessage = ref(false);
  const deleteBox = ref();
  const deleteLoading = ref(false);
  const isPublished = ref(!!props.task.isOnline);
  const showPublishPopup = ref(false);
  const publishToken = ref(props.task && props.task.isOnline && props.task.isOnline.token ? props.task.isOnline.token : null);

  const saveTask = async () => {
    const el = document.getElementById('topScroller');

    loading.value = true;
    const task = editTask.value.getTask();

    if (task.startDate === null) {
      error.value = true;
      errorMsg.value = 'Vælg venligst en dato';
      loading.value = false;
      if (el) {
        el.scrollIntoView();
      }
      return false;
    }

    if (task.title === '' || task.title === null) {
      error.value = true;
      errorMsg.value = 'Angiv venligst en overskrift';
      loading.value = false;
      if (el) {
        el.scrollIntoView();
      }
      return false;
    }

    await axios.put('/task/'+task.taskId, {
      task: {
        title: task.title,
        startDate: task.startDate,
        startTime: task.startTime ? task.startTime : (task.allDaySwitch ? null : '00:00'),
        color: task.color.name,
        endDate: task.endDate,
        allDay: task.allDaySwitch,
        endTime: task.endTime,
        fields: task.fields,
        data: task.data
      }
    }, {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      loading.value = false;
      error.value = false;
      errorMsg.value = '';
      taskActive.value = response.task;
      showUpdatedMessage();
      editMode.value = false;
      hasBeenUpdated.value = true;
    }).catch((response) => {
      error.value = true;
      errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
      loading.value = false;
    });
  }

  const showUpdatedMessage = () => {
    updatedMessage.value = true

    setTimeout(() => {
      updatedMessage.value = false
    }, 850);
  }

  const closeOpenTask = () => {
    if (hasBeenUpdated.value) {
      emit('close');
      emit('updated', taskActive.value)
    } else {
      emit('close');
    }
  }

  const toggleDeleteBox = () => {
    deleteBox.value = !deleteBox.value;
  }

  const deleteTask = async () => {
    deleteLoading.value = true;
    const task = editTask.value.getTask();

    await axios.delete('/task/'+task.taskId, {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      toggleDeleteBox();
      loading.value = false;
      error.value = false;
      errorMsg.value = '';
      emit('deleted', task);
      deleteLoading.value = false;
      emit('close');
    }).catch((response) => {
      toggleDeleteBox();
      deleteLoading.value = false;
      error.value = true;
      errorMsg.value = 'Der opstod en fejl - fejlkode: '+response.response.status;
      loading.value = false;
    });
  }

  const hideWarnings = () => {
    loading.value = false;
    error.value = false;
  }

  const publishTask = async () => {
    showPublishPopup.value = false;

    await axios.post('/task/publish/'+props.task.id, {}, {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      if (response.token !== null) {
        publishToken.value = response.token;
        isPublished.value = true;
        showPublishPopup.value = true;
      }
    }).catch((response) => {});
  }

  const unpublishTask = async () => {
    await axios.delete('/task/publish/'+props.task.id, {
      headers: {
        'Authorization': 'Bearer '+ localStorage.getItem('token')
      }
    }).then((response) => response.data).then((response) => {
      if (response.deleted !== null) {
        publishToken.value = null;
        isPublished.value = false;
        showPublishPopup.value = false;
      }
    }).catch((response) => {});
  }
</script>
<style>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>