<template>
  <div class="relative">
    <div class="w-10 h-8 rounded-sm shadow-sm hover-transition cursor-pointer flex items-center justify-center text-sm font-inter font-medium" :class="[activeColor.css, {'hover:scale-[103%]': !toggleColors}]" @click="toggleColors = !toggleColors"></div>
    <div v-if="toggleColors" class="absolute mt-4 gap-x-2 flex ml-5 bg-gray-50 p-3 shadow-xl p-3 rounded hover-transition z-20" v-click-outside="hideColor">
      <div class="w-0 h-0 border-[15px] absolute top-0 -mt-7 border-l-transparent border-r-transparent border-t-transparent border-b-gray-100"></div>
      <div v-for="color in colors" :class="color.css" class="w-10 h-10 rounded shadow-md hover-transition cursor-pointer hover:scale-[103%] hover:shadow-xl" v-show="activeColor.name !== color.name" @click="setActiveColor(color); $emit('color', activeColor)"></div>
    </div>
  </div>
</template>
<script setup>
  import colorHandler from "@/composables/colorHandler";
  import { ref } from "vue";

  const props = defineProps({
    color: {
      type: Object,
      default: {
        name: 'green',
        display: 'Grøn',
        css: 'bg-primary text-white'
      }
    }
  });

  const { colors } = colorHandler();
  const activeColor = ref(props.color);

  const toggleColors = ref(false);

  const hideColor = () => {
    toggleColors.value = false;
  }

  const setActiveColor = (color) => {
    activeColor.value = color;
    hideColor();
  }
</script>