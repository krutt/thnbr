<script lang="ts" setup>
/* components */
import Cell from '@/components/Cell.vue'

const address: Ref<string> = ref('')
const alby = useAlby()
onMounted(async () => {
  await alby.connectWallet()
  address.value = alby.address
})
</script>
<template>
  <main
    class="mt-28 mb-12 relative w-full px-6 py-12 bg-white md:max-w-3xl md:mx-auto lg:max-w-6xl lg:px-16 h-screen"
  >
    <div>
      {{ address }}
    </div>
    <Cell></Cell>
  </main>
</template>
