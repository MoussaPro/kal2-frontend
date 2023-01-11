<template>
  <input ref="inputRef" type="text" />
</template>

<script setup>
import { useCurrencyInput } from 'vue-currency-input'

const props = defineProps({
  modelValue: null,
});

const { inputRef } = useCurrencyInput({
  currency: 'DKK',
  currencyDisplay: 'hidden',
  autoDecimalDigits: true,
});
</script>