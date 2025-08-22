<script setup>
/* components */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
/* vectors */
import Aesir from '@/assets/aesir.svg'
import Bitcoin from '@/assets/bitcoin.svg'
import MutinyNet from '@/assets/mutiny-net.svg'

let emit = defineEmits(['select-network'])
let selectedNetwork = ref('regtest')

// funcs
let selectNetwork = network => {
  selectedNetwork.value = network
  toast('Network changed', { description: `Currently using ${selectedNetwork.value}` })
  emit('select-network', selectedNetwork.value)
}

// lifecycle hooks
onMounted(async () => (!!selectedNetwork.value ? selectNetwork(selectedNetwork.value) : void 0))
</script>
<template>
  <div class="h-10 w-10 mr-5">
    <DropdownMenu as-child>
      <DropdownMenuTrigger
        class="active:ring-2 active:ring-[#619B8A] active:ring-offset-2 active:ring-offset-[#A1C181] border-2 border-current min-h-full min-w-full mr-4 overflow-hidden rounded-full shadow-sm"
      >
        <Aesir class="h-full w-full fill-current" v-if="selectedNetwork == 'regtest'" />
        <Bitcoin class="h-full w-full fill-current" v-if="selectedNetwork == 'mainnet'" />
        <MutinyNet class="h-full w-full fill-current" v-if="selectedNetwork == 'signet'" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click.prevent="selectNetwork('mainnet')" :disabled="true">
          <Bitcoin class="h-8 w-8 mr-2" />
          Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem @click.prevent="selectNetwork('signet')" :disabled="true">
          <MutinyNet class="h-8 w-8 mr-2" />
          Signet
        </DropdownMenuItem>
        <DropdownMenuItem @click.prevent="selectNetwork('regtest')">
          <Aesir class="h-8 w-8 mr-2" />
          Regtest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
