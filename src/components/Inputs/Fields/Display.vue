<template>
  <div>
    <span class="text-[12.5px] font-inter font-medium text-gray-700">{{ field.title }}</span>
    <!-- Rest -->
    <input type="text" v-model="field.value" v-if="field.type === 'tal' || field.type === 'tekst'" :class="error ? 'border-red-500' : 'border-gray-200'" @blur="emitChanges" class="block w-full pl-2 rounded shadow-sm mt-[2px] border border-gray-200 h-[32px] text-sm font-inter" />

    <!-- Currency -->
    <div class="w-full relative">
      <div class="absolute left-0 top-0 flex items-center justify-center w-9 h-9 bg-gray-200 rounded-l-md text-[13px] font-medium font-inter" v-if="field.type === 'valuta'">kr. </div>
      <Inputs-Fields-Currency v-if="field.type === 'valuta'" v-model="field.value" @blur="emitChanges" class="border rounded focus:outline-none w-full h-9 text-[13px] pl-10"/>
    </div>

    <!-- Description -->
    <div class="mr-2 w-full" v-if="field.type === 'beskrivelse'">
      <trumbowyg v-model="field.value" :defaultValue="field.value" :config="trumConfig" @blur="emitChanges" class="form-control" name="content"></trumbowyg>
    </div>
    <span v-if="errorMsg" class="text-[11px] font-bold text-red-600 font-inter mt-1">{{ errorMsg }}</span>
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import fieldHandler from "@/composables/fieldHandler";
  import Trumbowyg from 'vue-trumbowyg';
  import 'trumbowyg/dist/ui/trumbowyg.css';
  const { capitalizeString } = fieldHandler();

  const props = defineProps({
    field: {
      type: Object,
      required: true
    }
  });

  const field = ref(props.field ?? null);
  const emit = defineEmits(['getField']);
  const error = ref(false);
  const errorMsg = ref();

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

  // Capitalize string
  field.value.title = capitalizeString(props.field.title);

  const emitChanges = () => {
    error.value = false;
    errorMsg.value = ''

    // Format before emitting
    if (field.value.type === 'tal' && field.value.value) {
      const regex = /^[\d,]*\.?\d*$/
      if (!regex.test(field.value.value)) {
        field.value.value = '';
        error.value = true;
        errorMsg.value = 'Indtast venligst kun tal'
        return false;
      }
    }

    emit('getField', field.value);
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