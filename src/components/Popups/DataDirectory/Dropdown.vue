<template>
  <div class="absolute left-0 top-[45px] w-auto font-inter flex items-start gap-x-2 text-[13px] text-gray-600 z-20" v-click-outside="hidePopup">
    <div class="bg-white h-auto min-w-[200px] shadow-md rounded-b-md border border-gray-200">
      <div class="max-h-[250px] overflow-y-scroll relative" v-if="containerDirectories.length">
        <div v-for="(directory) in containerDirectories" @click="setActiveDirectory(directory)" :class="activeDirectory?.id === directory.id ? 'bg-gray-200 font-medium' : ''" class="p-2 hover-transition hover:bg-gray-200 text-[12px] cursor-pointer border-b border-gray-200 flex justify-between items-center">
          {{ directory.title }}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
      <RouterLink to="/new/directory" class="pl-1 py-2 hover-transition bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center font-semibold justify-start rounded-b-md">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 text-primary-Darker1 mr-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        Opret ny kartotek
      </RouterLink>
    </div>
    <div>
      <div class="bg-white border border-gray-200 rounded z-30 shadow-md" v-if="activeDirectory">
        <div class="max-h-[250px] min-w-[150px] overflow-y-scroll relative">
          <div v-for="(data) in activeDirectory.data" :key="data.id" @click="chooseDirectoryData(data)" class="p-2 hover-transition hover:bg-gray-200 text-[12px] cursor-pointer border-b border-gray-200 flex justify-between items-center">
            {{ Object.values(data)[1] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const props = defineProps({
    containerDirectories: {
      type: Array || null
    }
  })

  const emits = defineEmits(['hide', 'onChosen']);
  const activeDirectory = ref();

  const hidePopup = () => {
    emits('hide');
  }

  const setActiveDirectory = (directory) => {
    if (!activeDirectory.value || activeDirectory.value !== directory)
      activeDirectory.value = directory;
    else
      activeDirectory.value = null;
  }

  const chooseDirectoryData = (directory) => {
    // Set directory id
    let emitDirectory = directory;
    emitDirectory['directory_id'] = activeDirectory.value.id;
    emitDirectory['directory_title'] = activeDirectory.value.title;

    emits('onChosen', emitDirectory)
    hidePopup();
  }
</script>