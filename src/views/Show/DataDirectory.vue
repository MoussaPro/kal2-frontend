<template>
  <div class="content pb-20">
    <Api-Server-Loading v-if="loading && !errorApiLoader" class="mt-5"/>
    <Api-Server-Error v-if="errorApiLoader" :error="errorApiLoader" class="mt-5"/>

    <Task-Open
        v-if="showOpenedTask"
        :containerFields="apiData.fields"
        :containerDirectories="apiData.directories"
        :task="openedTask"
        @close="toggleOpenedTask"
        @updated="getData"
        @deleted="getData" />

    <div v-if="!errorApiLoader && !loading">
      <Layout-Block class="mt-5">
        <div class="p-4 text-center">
          <RouterLink class="hover-transition hover:opacity-60 text-lg" :to="'/edit/directory/data/'+apiData.directory.id">{{ apiData.directory.title }}</RouterLink>
          <h2 class="text-xl font-inter font-medium">{{ getDataDirectoryIdentifier(apiData.data) }}</h2>
          <div class="w-[600px] flex flex-wrap gap-4 mt-4 items-center justify-center mx-auto">
           <template v-for="(data, placeholder) in apiData.data" :key="data.id">
             <div class="flex items-center justify-between bg-gray-200 px-2 py-1 rounded-md" v-if="placeholder !== 'id' && placeholder !== 'identification'">
                <div class="text-[13px] text-gray-800"><span class="font-medium">{{ placeholder }}: </span>{{ data }}</div>
             </div>
          </template>
          </div>
        </div>
      </Layout-Block>

      <div class="grid grid-cols-3 gap-5 mt-5">
        <Layout-Block>
          <div :class="titleClass">{{ apiData.tasks['previous_week'].length }} opgaver sidste uge</div>
          <div class="max-h-[190px] overflow-y-scroll" v-if="apiData.tasks['previous_week'].length">
            <div v-for="(task, index) in apiData.tasks['previous_week']" @click="setOpenedTask(task)" :class="[getTaskColor(task.task_color), boxClass]">
              #{{ task.task_number }} {{ task.title }}
            </div>
          </div>
          <div v-else>
            <Empty :hideButton="true" text="Ingen opgaver fundet" />
          </div>
        </Layout-Block>
        <Layout-Block>
          <div :class="titleClass">{{ apiData.tasks['current_week'].length }} opgaver denne uge</div>
          <div class="max-h-[190px] overflow-y-scroll" v-if="apiData.tasks['current_week'].length">
            <div v-for="(task, index) in apiData.tasks['current_week']" @click="setOpenedTask(task)" :class="[getTaskColor(task.task_color), boxClass]">
              #{{ task.task_number }} {{ task.title }}
            </div>
          </div>
          <div v-else>
            <Empty :hideButton="true" text="Ingen opgaver fundet" />
          </div>
        </Layout-Block>
        <Layout-Block>
          <div :class="titleClass">{{ apiData.tasks['next_week'].length }} opgaver næste uge</div>
          <div class="max-h-[190px] overflow-y-scroll" v-if="apiData.tasks['next_week'].length">
            <div v-for="(task, index) in apiData.tasks['next_week']" @click="setOpenedTask(task)" :class="[getTaskColor(task.task_color), boxClass]">
              #{{ task.task_number }} {{ task.title }}
            </div>
          </div>
          <div v-else>
            <Empty :hideButton="true" text="Ingen opgaver fundet" />
          </div>
        </Layout-Block>
      </div>

      <LayoutBlock class="mt-5">
        <div :class="titleClass">Udregn felter</div>
        <DataSearcher :containerFields="apiData.fields" class="mt-2" :directoryData="apiData.data" />
      </LayoutBlock>
    </div>
  </div>
</template>

<script setup>
  import { useRoute, useRouter } from "vue-router/dist/vue-router";
  import { computed, nextTick, onBeforeMount, ref } from "vue";
  import axios from "axios";
  import fieldHandler from "@/composables/fieldHandler";
  import colorHandler from "@/composables/colorHandler";

  const route = useRoute();
  const router = useRouter();
  const { getDataDirectoryIdentifier } = fieldHandler();
  const apiData = ref();
  const openedTask = ref();
  const showOpenedTask = ref(false);
  const loading = ref();
  const errorApiLoader = ref();
  const { colors } = colorHandler();
  const error = ref();

  const titleClass = 'text-[15px] font-inter font-medium bg-gray-200 -m-1 mb-0 p-3 rounded-t-md';
  const boxClass = 'w-full h-auto px-2 py-[5px] rounded-md shadow text-white mt-[8px] shadow text-xs font-inter hover:opacity-80 cursor-pointer';

  const getData = () => {
    loading.value = true;

    try {
      axios.get('directory/data/'+route.params.id+'/'+route.params.data_id, {
        headers: {
          'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
      }).then((response) => response.data).then((response) => {
        apiData.value = response;
        loading.value = false;
      }).catch((response) => {
        errorApiLoader.value = response;
      });
    } catch(e) {
      errorApiLoader.value = e;
    }
  }

  const getTaskColor = (task_color) => {
    return colors.filter(color => color.name === task_color)[0].css;
  }

  const setOpenedTask = (task) => {
    openedTask.value = task;
    showOpenedTask.value = true;
  }

  const toggleOpenedTask = () => {
    showOpenedTask.value = !showOpenedTask.value;
  }

  onBeforeMount(() => {
    getData();
  });
</script>