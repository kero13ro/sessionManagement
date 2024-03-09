import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSetting = defineStore('setting', () => {
  const renderView = ref<'sessions' | 'attendee'>('sessions')

  const mode = ref<'create' | 'join'>('create')
  const isCreatedMode = computed(() => mode.value === 'create')

  return { renderView, mode, isCreatedMode }
})
