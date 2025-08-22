<script setup>
/* imports */
import { Jdenticon } from '@/components'

let { address } = storeToRefs(useAlby())
let balance = ref(0)
let { fetchBalance } = useAesir()

onMounted(async () => (balance.value = await fetchBalance(address.value)))
</script>
<template>
  <dropdown-menu as-child>
    <dropdown-menu-trigger>
      <Jdenticon
        :address="address"
        class="active:ring-2 active:ring-[#619B8A] active:ring-offset-2 active:ring-offset-[#A1C181] border-2 border-current rounded-full shadow-sm"
        mode="light"
      />
    </dropdown-menu-trigger>
    <dropdown-menu-content align="end">
      <dropdown-menu-label>My Account</dropdown-menu-label>
      <dropdown-menu-separator />
      <dropdown-menu-item>
        Balance:&nbsp;
        {{ balance }}
        &nbsp;₿
      </dropdown-menu-item>
      <dropdown-menu-item
        @click.capture.native.stop="async () => (balance = await fetchBalance(address))"
      >
        Refresh balance
      </dropdown-menu-item>
      <dropdown-menu-item disabled="true"> Disconnect </dropdown-menu-item>
    </dropdown-menu-content>
  </dropdown-menu>
</template>
