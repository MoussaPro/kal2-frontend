<template>
  <PopUp boxClass="w-[600px] p-2" innerBoxClass="max-h-[95vh] overflow-y-scroll relative" @close="$emit('toggleEditBox')">
    <div class="text-xl font-medium bg-gray-100 text-gray-700 rounded-md p-2">Rediger data</div>
    <div class="p-2">
      <div class="w-9/12 mb-6">
        <div v-for="field in fields" class="mb-2">
          <span class="text-[12.5px] font-inter font-medium text-gray-700">{{ field.title }}</span>
          <input type="text" class="border border-gray-300 rounded-md focus:outline-none w-full h-9 text-[13px] pl-2" v-model="fieldsObj[field.title]" />
        </div>
      </div>
      <button class="bg-primary-Darker px-5 py-[10px] text-white flex items-center rounded-md text-sm font-medium hover-transition hover:bg-primary-Darker1 active:bg-primary-Darker1" @click="save">
        Opdater data
      </button>
    </div>
  </PopUp>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  fields: {
    type: Object
  },
  fieldData: {
    type: Object
  }
});

const emits = defineEmits(['toggleEditBox', 'save']);
const fieldsObj = ref(props.fieldData);

const save = () => {
  // Set empty strings till null
  emits('save', fieldsObj.value);
}
</script>