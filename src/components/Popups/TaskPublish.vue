<template>
  <div class="absolute w-full h-full bg-black/30 top-0 left-0 flex items-center justify-center transition-hover z-[500]">
    <div class="bg-gray-100 rounded-md drop-shadow-4xl w-[600px] border border-gray-300">
      <div class="bg-gray-200 p-2 text-gray-500 font-medium text-sm">Send opgave via link</div>
      <div class="p-3 my-5" v-if="token">
        <div class="text-xs text-gray-600 flex items-center" :class="copied ? 'mb-2' : 'mb-1'">
          Link til din opgave
          <span class="text-white text-xs bg-primary rounded-md px-2 py-[2px] ml-2" v-if="copied">Link kopiret!</span>
        </div>
        <input class="overflow-hidden border border-gray-300 h-8 w-10/12 flex items-center pl-2 cursor-normal focus:outline-0" readonly @click="copyLink" v-model="linkPlaceholder">
      </div>
      <div class="font-medium text-sm p-3" v-else>
        Aktiver linket så du kan dele denne opgave.
      </div>
      <div class="flex items-center py-3">
        <button class="flex items-center text-black py-[10px] px-7 rounded-md text-sm font-inter hover-transition ml-2 bg-gray-200 hover:bg-primary hover:text-white" v-if="token" @click="copyLink">Kopier link</button>
        <button class="flex items-center text-black py-[10px] px-7 rounded-md text-sm font-inter hover-transition ml-2 bg-gray-200 hover:bg-primary hover:text-white" v-if="!token" @click="$emit('publish')">Aktiver link</button>
        <span v-if="isPublished" class="text-sm text-red-600 ml-4 font-inter underline flex items-center hover-transition hover:text-red-800 cursor-pointer" @click="$emit('unpublish')">Deaktiver link</span>
        <span class="mx-4 text-gray-700">|</span>
        <span class="text-sm text-gray-700 font-inter underline flex items-center hover-transition hover:text-gray-500 cursor-pointer" @click="$emit('close')">Annuller</span>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const props = defineProps({
    token: String,
    isPublished: Boolean
  });

  const emit = defineEmits(['close', 'publish', 'unpublish']);
  const linkPlaceholder = ref(process.env.VUE_APP_URL+'opgave/'+props.token);
  const copied = ref(false);

  const copyLink = () => {
    navigator.clipboard.writeText(linkPlaceholder.value);
    copied.value = true;
    setTimeout(() => {
      emit('close');
      copied.value = false;
    }, 3000);
  }
</script>