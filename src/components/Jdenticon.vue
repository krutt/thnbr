<script setup>
import { toSvg } from 'jdenticon'

const props = defineProps(['address'])
const identicon = computed(() => toSvg(props.address, 36))
</script>

<template>
  <div v-html="identicon" />
</template>
