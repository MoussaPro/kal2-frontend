<template>
  <div>
    <div class="flex flex-wrap gap-2">
      <div v-for="data in chosenDataDirectories" :key="data.id" class="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md">
        <div class="text-xs text-gray-800"><span class="font-medium">{{ data.directory_title }}: </span>{{ getDataDirectoryIdentifier(data) }}</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" @click="deleteChoosenDataDirectories(data)" class="w-4 ml-2 cursor-pointer hover:text-red-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>

    <div class="relative">
      <Popups-DataDirectory-Dropdown :containerDirectories="containerDirectories" v-if="showDirectoriesPopup" @hide="hideDirectoriesPopup" @onChosen="updateChoosenDataDirectories"/>

      <div class="flex justify-between items-center py-2">
        <div class="rounded-md shadow py-[5px] px-3 font-inter text-left text-[12px] font-medium flex items-center hover-transition cursor-pointer" :class="showDirectoriesPopup ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-primary hover:border-primary hover:text-white'" @click="showDirectoriesPopup = true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 mr-[1px] -ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          Tilføj fra kartotek
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onBeforeMount, ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";

  const props = defineProps({
    containerDirectories: {
      type: Array || null
    },
    jsonData: {
      type: Array
    }
  });

  const showDirectoriesPopup = ref(false);
  const chosenDataDirectories = ref([]);
  const { getDataDirectoryIdentifier } = fieldHandler();
  const emits = defineEmits(['taskDataDirectories'])

  const hideDirectoriesPopup = () => {
    showDirectoriesPopup.value = false;
  }

  const updateChoosenDataDirectories = (data) => {
    let isDuplicate = false;

    // Check if the clicked data not already exists
    chosenDataDirectories.value.forEach((chosenData) => {
      if (chosenData.id === data.id) {
        isDuplicate = true;
      }
    });

    if (!isDuplicate) {
      chosenDataDirectories.value.push(data);
      emits('taskDataDirectories', chosenDataDirectories.value);
    }
  }

  const deleteChoosenDataDirectories = (removedData) => {
    chosenDataDirectories.value = chosenDataDirectories.value.filter(data => removedData !== data);
    emits('taskDataDirectories', chosenDataDirectories.value);
  }

  onBeforeMount(() => {
    if (props.jsonData && props.jsonData.length) {
      chosenDataDirectories.value = [...props.jsonData];
    }
  })
</script>