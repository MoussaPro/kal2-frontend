<template>
  <div class="bg-gray-50 relative border border-gray-100 rounded-md">
    <div v-if="selectedField">
      <div class="flex justify-center">
        <div class="mx-auto relative">
          <p class="font-inter text-[14px] text-gray-700 w-[300px] justify-center bg-white border border-gray-200 px-5 py-2 leading-none inline-flex text-center items-center hover-transition cursor-pointer hover:bg-gray-200" :class="toggleTemplates ? '' : 'rounded-b-md'" @click="toggleTemplates = !toggleTemplates">
            {{ selectedField.title }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 mt-[1px] ml-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </p>
          <div v-if="toggleTemplates" v-click-outside="hideToggleTemplates" class="absolute shadow-md left-0 top-[34px] w-[300px] font-inter text-[13px] text-gray-600 z-20 rounded-b-md bg-white border border-gray-200">
            <div class="max-h-[150px] overflow-y-scroll relative" v-if="apiData.length">
              <div @click="setFieldId(field.id)" v-for="(field) in apiData" class="p-2 hover-transition hover:bg-gray-200 cursor-pointer border-b border-gray-200" :class="{'bg-gray-100 font-medium': field.id === selectedField.id}">{{ field.title }}</div>
            </div>
            <RouterLink to="/new/field" class="px-1 py-2 hover-transition bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center font-semibold justify-start rounded-b-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 text-primary-Darker1 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              Opret ny skabelon
            </RouterLink>
          </div>
        </div>
      </div>
      <div class="min-h-[220px] max-h-[50vh] relative overflow-y-scroll">
        <div class="grid grid-cols-2 bg-gray-50 gap-x-5 gap-y-4 px-2 pb-4 mt-3">
          <Inputs-Fields-Display v-for="field in selectedField.fields.filter((n) => {return n.type !== 'beskrivelse'})"
              :key="field"
              :field="field"
              @getField="updatedField => updateField(updatedField, field.id)"/>
        </div>

        <div class="px-2 pb-4 mt-3">
          <Inputs-Fields-Display v-for="field in selectedField.fields.filter((n) => {return n.type === 'beskrivelse'})"
              class="mt-4"
              :key="field"
              :field="field"
              @getField="updatedField => updateField(updatedField, field.id)"/>
        </div>
      </div>
    </div>
    <Empty text="Ingen skabeloner blev fundet" textBtn="Opret skabelon" @btnClick="$router.push('/new/field')" v-else/>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
  import axios from "axios";

  const props = defineProps({
    jsonData: {
      type: Array,
    },
    containerFields: {
      type: Array || null,
    }
  });

  const apiData = ref(props.containerFields ?? null);
  const error = ref();
  const selectedFieldId = ref(null);
  const toggleTemplates = ref();
  const emits = defineEmits(['taskFields']);
  const prefilled = props.jsonData ? { title: 'Vælg ny skabelon', fields: props.jsonData } : null;

  const selectedField = computed(() => {
    const returnedFields = ref();

    if (apiData.value) {
      // Select fields from props
      if (prefilled && selectedFieldId.value === null) {
        returnedFields.value = prefilled;
      } else {
        // If no selected field set the primary
        if (selectedFieldId.value === null) {
          const primaryField = apiData.value.filter(field => field.is_primary === 1)[0];
          // Set primary or just set the first field
          if (primaryField) {
            returnedFields.value = primaryField;
          } else {
            returnedFields.value = apiData.value[0];
          }
        } else {
          // If selected field
          returnedFields.value = apiData.value.filter(field => field.id === selectedFieldId.value)[0];
        }
      }

      if (returnedFields.value) {
        // Emits field template changes and defaults value
        emits('taskFields', returnedFields.value.fields);
        return returnedFields.value;
      }
    }
  });

  const hideToggleTemplates = () => {
    if (toggleTemplates.value) {
      toggleTemplates.value = false;
    }
  }

  const setFieldId = (field_id) => {
      selectedFieldId.value = field_id;
      toggleTemplates.value = false; // Hide dropdown after selected
  }

  const updateField = (updatedField, field_id) => {
    selectedField.value.fields.forEach(field => {
      if (field.id === field_id) {
        const regex = /^[\d,]*\.?\d*$/
        if (regex.test(updatedField.value)) {
          field.value = Number(updatedField.value)
        } else {
          field.value = updatedField.value
        }
      }
    });
    emits('taskFields', selectedField.value.fields);
  }
</script>