<template>
  <div :class="style ? '' : 'bg-white rounded-md p-2 drop-shadow-[0_10px_10px_rgba(0,0,0,0.03)] text-sm font-inter'">
    <slot>
      Der opstod en fejl
    </slot>
  </div>
</template>
<script setup>
  const props = defineProps({
    style: {
      type: String
    },
  });
</script>