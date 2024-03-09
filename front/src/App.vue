<script setup lang="ts">
import ViewSessions from '@/components/view/ViewSessions.vue'
import ViewAttendee from '@/components/view/ViewAttendee.vue'
import { useSetting } from '@/stores/setting'
const _s = useSetting()
</script>

<template>
  <div class="root">
    <div class="flex flex-col gap-6 p-6">
      <div class="text-md bg btn btn-block" @click="_s.renderView = 'sessions'">Sessions</div>
      <div class="text-md btn btn-block" @click="_s.renderView = 'attendee'">Attendee</div>
    </div>
    <div class="p-6">
      <ViewSessions v-show="_s.renderView === 'sessions'" />
      <ViewAttendee v-show="_s.renderView === 'attendee'" />
    </div>
  </div>
</template>

<style scoped>
.root {
  display: grid;
  max-width: 800px;
  /* grid-template-columns: 300px 1fr; */
  grid-template-columns: auto 1fr;
  height: 100vh;
}
</style>
