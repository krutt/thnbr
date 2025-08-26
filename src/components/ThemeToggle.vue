<script setup>
/* vectors */
import { Moon, Sun } from 'lucide-vue-next'

/* components */
import { Button } from '@/components/ui/button'

/* composables */
const theme = useColorMode({ disableTransition: false })

/* functions */
const toggleTheme = () => (theme.value = theme.value !== 'light' ? 'light' : 'dark')
</script>
<template>
  <div>
    <Button @click="toggleTheme" variant="outline" size="icon">
      <div v-if="theme == 'light'">
        <Moon />
      </div>
      <div v-else>
        <Sun class="dark:text-white" />
      </div>
      <span class="sr-only">Toggle theme</span>
    </Button>
  </div>
</template>
