<script lang="ts" setup>
/* imports */
import { RouterView } from 'vue-router'

/* components */
import NetworkSelect from '@/components/NetworkSelect.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

/* vectors */
import Krutt from '@/assets/krutt.svg'

/* composables */
// let alby = useAlby()
// let { connectWallet }  = alby
// let userAddress = storeToRefs(alby).address
</script>
<template>
  <div class="bg-white dark:bg-gray-950 flex flex-col min-w-screen">
    <div class="fixed flex-1 space-y-4 p-8 pt-6">
      <div
        class="bg-white dark:bg-gray-950 fixed inset-x-0 top-0 z-[10] h-fit border-b border-slate-900 py-2"
      >
        <div class="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
          <a href="/thonburi" class="flex items-center">
            <Krutt />
            <span
              class="font-extrabold font-wong self-center text-xl whitespace-nowrap dark:text-white"
              >THNBR</span
            >
          </a>
          <div class="flex items-center">
            <ThemeToggle class="mr-4" />
            <!-- <Button
              @click="connectWallet"
              class="cursor-pointer float-right w-fit"
              ref="connectButton"
              v-if="!userAddress"
            >
              Connect Wallet
              <Phantom class="h-6 inline ml-2 w-auto" />
            </Button> -->
            <NetworkSelect />
          </div>
        </div>
      </div>
    </div>
    <RouterView />
    <Toaster />
  </div>
</template>
