<template>
  <div>
    <span class="text-[12.5px] font-inter font-medium text-gray-700">{{ title }}</span>
    <!-- Rest -->
    <input type="text" v-model="value" v-if="type === 'tal' || type === 'tekst'" @blur="$emit('getField', {title, type, value, id})" class="block w-full pl-2 rounded shadow-sm mt-[2px] border border-gray-200 h-[32px] text-sm font-inter" />

    <!-- Currency -->
    <div class="w-full relative">
      <div class="absolute left-0 top-0 flex items-center justify-center w-9 h-9 bg-gray-200 rounded-l-md text-[13px] font-medium font-inter" v-if="type === 'valuta'">kr. </div>
      <CurrencyInput v-if="type === 'valuta'" v-model="value" @blur="$emit('getField', {title, type, value, id})" class="border rounded focus:outline-none w-full h-9 text-[13px] pl-10"/>
    </div>

    <!-- Description -->
    <div class="mr-2 w-full" v-if="type === 'beskrivelse'">
      <trumbowyg v-model="value" :config="trumConfig" @blur="$emit('getField', {title, type, value, id})" class="form-control" name="content"></trumbowyg>
    </div>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";
  import Trumbowyg from 'vue-trumbowyg';
  import 'trumbowyg/dist/ui/trumbowyg.css';

  const { capitalizeString } = fieldHandler()

  const props = defineProps({
    field: Object
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

  const id = props.field.id;
  const title = capitalizeString(props.field.title);
  const type = props.field.type;
  const value = ref(props.field.value);
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