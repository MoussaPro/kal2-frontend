<template>
  <div class="relative">
    <div v-if="index !== 0" @click="$emit('delete', index)" class="text-red-500 hover-transition hover:text-red-700 cursor-pointer absolute left-[-35px] top-[27px]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <input type="text" class="bg-gray-50 border-gray-200 border-2 border-dashed px-2 py-1 w-[200px] rounded text-[13px] text-gray-600 focus:outline-gray-300 focus:border-gray-300" v-model="fields.title" @blur="emitChanges"/>
    <div class="flex items-center mt-2">
      <input type="text" class="border-gray-200 border rounded pl-2 w-full h-9 text-[13px] mr-2" v-if="fields.type !== 'beskrivelse'" placeholder="Standard værdi" v-model="fields.value" @blur="emitChanges"/>
      <div class="mr-2 w-full" v-else>
        <trumbowyg v-model="fields.value" :config="trumConfig" @blur="emitChanges" class="form-control" placeholder="Standard værdi" name="content"></trumbowyg>
      </div>
      <div class="relative">
        <div class="bg-gray-50 border-gray-200 border-2 h-9 text-[12px] w-[200px] rounded text-sm text-gray-700 cursor-pointer hover-transition hover:bg-gray-100 relative" :class="toggleType ? 'font-semibold' : 'border-dashed'" @click="toggleType = !toggleType">
          <span class="flex items-center justify-center h-full" :class="fields.type ? 'capitalize font-medium' : 'normal-case'">
            {{ fields.type ? fields.type : 'Vælg type' }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" v-if="!fields.type" class="w-4 mt-[1px] ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </div>
        <div class="absolute left-0 top-[40px] w-[200px] bg-gray-50 z-20 rounded-md shadow-sm border border-gray-200" v-click-outside="hideType" v-if="toggleType">
          <div class="px-3 py-2 text-[12px] border-b border-gray-200 text-gray-600 tracking-[0.45px] font-medium cursor-pointer hover:bg-gray-200 hover-transition font-inter flex leading-none items-center" @click="chooseType('tekst');">
            <img src="@/assets/images/icons/text.png" class="w-[16px] mr-2" alt="text icon"/>
            Tekst
          </div>
          <div class="px-3 py-2 text-[12px] border-b border-gray-200 text-gray-600 tracking-[0.45px] font-medium cursor-pointer hover:bg-gray-200 hover-transition font-inter flex leading-none items-center" @click="chooseType('tal');">
            <img src="@/assets/images/icons/numbers.png" class="w-[16px] mr-2" alt="number icon"/>
            Tal
          </div>
          <div class="px-3 py-2 text-[12px] border-b border-gray-200 text-gray-600 tracking-[0.45px] font-medium cursor-pointer hover:bg-gray-200 hover-transition font-inter flex leading-none items-center" @click="chooseType('valuta');">
            <img src="@/assets/images/icons/currency.png" class="w-[14px] mr-2" alt="number icon"/>
            Valuta
          </div>
          <div class="px-3 py-2 text-[12px] border-b border-gray-200 text-gray-600 tracking-[0.45px] font-medium cursor-pointer hover:bg-gray-200 hover-transition font-inter flex leading-none items-center" @click="chooseType('beskrivelse');">
            <img src="@/assets/images/icons/description.png" class="w-[14px] mr-2" alt="number icon"/>
            Beskrivelse (Lang tekst)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";
  const { capitalizeString } = fieldHandler();
  import Trumbowyg from 'vue-trumbowyg';
  import 'trumbowyg/dist/ui/trumbowyg.css';

  const props = defineProps({
    type: String,
    title: String,
    value: String,
    index: Number,
    id: Number
  });

  const emit = defineEmits(['changes', 'delete'])

  const fields = ref({
    id: props.id,
    type: props.type,
    title: capitalizeString(props.title),
    value: props.value
  });

  const trumConfig = {
    autogrowOnEnter: true,
    btns: [
      ['undo', 'redo'], // Only supported in Blink browsers
      ['formatting'],
      ['strong', 'em'],
      ['link'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['unorderedList', 'orderedList'],
      ['horizontalRule'],
    ],
  };

  const toggleType = ref(false);

  const hideType = () => {
    toggleType.value = false;
  }

  const chooseType = (param) => {
    fields.value.type = param;
    emitChanges();
    hideType();
  }

  const emitChanges = () => {
    emit('changes', fields.value);
  }
</script>
<style lang="css">
.trumbowyg-box {
    min-height: 100px !important;
    max-height: 240px;
}
 .trumbowyg-editor {
    min-height: 60px !important;
    padding: 5px !important;
    max-height: 200px;
  }
</style>