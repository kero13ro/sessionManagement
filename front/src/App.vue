<script setup lang="ts">
import IconLoading from '@/components/icons/IconLoading.vue'
import ViewSessions from '@/components/view/ViewSessions.vue'
import ViewAttendee from '@/components/view/ViewAttendee.vue'
import ViewSpeakers from '@/components/view/ViewSpeakers.vue'
import { useSessions } from '@/stores/useSessions'
const _s = useSessions()

const gotoSession = () => {
  _s.renderView = 'sessions'
  _s.tableMode = 'create'
}
</script>

<template>
  <div class="root bg-slate-50">
    <nav class="flex flex-col gap-6 border-r border-s-cyan-100 bg-white px-6 py-12">
      <button class="text-md btn btn-block" @click="gotoSession">Sessions</button>
      <button class="text-md btn btn-block" @click="_s.renderView = 'attendee'">Attendees</button>
      <button class="text-md btn btn-block" @click="_s.renderView = 'speaker'">Speakers</button>
    </nav>
    <div class="overflow-x-auto">
      <ViewSessions v-show="_s.renderView === 'sessions'" />
      <ViewAttendee v-show="_s.renderView === 'attendee'" />
      <ViewSpeakers v-if="_s.renderView === 'speaker'" />
    </div>
    <div class="mask" v-show="_s.loading">
      <IconLoading />
    </div>
  </div>
</template>

<style scoped>
.root {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100vh;
  width: 100vw;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  /* background-color: rgba(200, 200, 200, 0.2); */
  color: #888;
  justify-content: center;
  align-items: center;
}
</style>
