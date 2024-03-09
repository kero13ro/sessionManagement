<script setup lang="ts">
import ViewSessions from './components/view/ViewSessions.vue'
import ViewAttendee from './components/view/ViewAttendee.vue'

import { ref } from 'vue'

const renderView = ref<'sessions' | 'attendee'>('sessions')
</script>

<template>
  <div class="root">
    <div class="flex flex-col gap-6 p-6">
      <div class="text-md bg btn btn-block">Sessions</div>
      <div class="text-md btn btn-block">Attendee</div>
    </div>
    <div class="p-6">
      <ViewSessions v-show="renderView === 'sessions'" />
      <ViewAttendee v-show="renderView === 'attendee'" />
    </div>
  </div>
</template>

<style scoped>
.root {
  display: grid;
  /* grid-template-columns: 300px 1fr; */
  grid-template-columns: auto 1fr;
  height: 100vh;
}
</style>
