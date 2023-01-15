<template>
  <div class="mt-2 flex items-center">
    <label class="switch">
      <input type="checkbox" v-model="isChecked" @click.stop="$emit('clicked')">
      <span class="slider round"></span>
    </label>
    <p class="ml-2 font-inter text-[12px] text-gray-700">{{ title }}</p>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const props = defineProps({
    title: String,
    checked: {
      type: Boolean,
      default: false,
    }
  });

  const isChecked = ref(false);

  if (props.checked) {
    isChecked.value = true;
  }
</script>