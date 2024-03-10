<script setup lang="ts">
import ViewSessions from '@/components/view/ViewSessions.vue'
import ViewAttendee from '@/components/view/ViewAttendee.vue'
import { useSetting } from '@/stores/useSetting'
import { onMounted } from 'vue'
import ViewSpeakers from './components/view/ViewSpeakers.vue'
const _s = useSetting()

const gotoSession = () => {
  _s.renderView = 'sessions'
  _s.mode = 'create'
}
</script>

<template>
  <div class="root">
    <div class="flex flex-col gap-6 p-6">
      <div class="text-md bg btn btn-block" @click="gotoSession">Sessions</div>
      <div class="text-md btn btn-block" @click="_s.renderView = 'attendee'">Attendees</div>
      <div class="text-md btn btn-block" @click="_s.renderView = 'speaker'">Speakers</div>
    </div>
    <div class="p-6">
      <ViewSessions v-show="_s.renderView === 'sessions'" />
      <ViewAttendee v-show="_s.renderView === 'attendee'" />
      <ViewSpeakers v-show="_s.renderView === 'speaker'" />
    </div>
  </div>
</template>

<style scoped>
.root {
  display: grid;
  /* max-width: 800px; */
  /* grid-template-columns: 300px 1fr; */
  grid-template-columns: auto 1fr;
  height: 100vh;
}
</style>
