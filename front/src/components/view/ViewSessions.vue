<script setup lang="ts">
import { computed, ref } from 'vue'
import { titles } from '@/assets/mock'
import { slotMapping, siteMapping } from '@/common'
import { useSessions } from '@/stores/useSessions'
import { storeToRefs } from 'pinia'
import type { SessionType } from '@/stores/typing'
const _s = useSessions()
const { sessions, speakers, curtUser, isCreatedMode, loading } = storeToRefs(_s)

// 天數、場地 數量，依據業務邏輯調整
const DAY_MAX = ref(3)
const SITE_MAX = ref(2)

const defaultItem = {
  id: '0',
  title: '',
  speaker_id: '0',
  attendees: []
}
const renderList = computed(() => {
  const res: Record<number, SessionType[]> = { 1: [], 2: [] }
  // const speaker_id = speakers.value[0] ? speakers.value[0].id : '0'

  for (let day = 1; day <= DAY_MAX.value; day++) {
    for (let slot = 1; slot <= 2; slot++) {
      for (let site = 1; site <= SITE_MAX.value; site++) {
        const ta = sessions.value.find(
          (el) => el.day === day && el.slot === slot && el.site === site
        )
        res[slot].push(ta || { ...defaultItem, day, slot, site, speaker_id: '' })
      }
    }
  }

  return res
})

const CreateModal = ref()
const openModalData = ref<SessionType>()
const openModal = (item: SessionType) => {
  openModalData.value = { ...item, title: 'MySQL' }
  CreateModal.value.showModal()
}

const handleCreate = () => {
  if (!openModalData.value?.speaker_id) return
  const { day, slot, site, speaker_id, title } = openModalData.value
  const params = { day, slot, site, speaker_id, title }
  _s.addSession(params)
  CreateModal.value.close()
}

const curtUserJoinedSession = computed(() => {
  if (!curtUser.value) return []
  if (!curtUser.value.joined) return []
  const arr = curtUser.value.joined.map((el) => el.session_id)
  return sessions.value.filter((el) => arr.includes(el.id))
})

const sameSlotSession = computed(() => {
  if (!openModalData.value) return []
  return sessions.value.filter(
    (el) => el.slot === openModalData.value!.slot && el.day === openModalData.value!.day
  )
})
</script>

<template>
  <div class="px-6 py-12">
    <div class="fixed bottom-3 right-3 p-3">
      <input class="input input-sm input-bordered w-20" type="number" v-model="DAY_MAX" />
      <input class="input input-sm input-bordered w-20" type="number" v-model="SITE_MAX" />
    </div>
    <table class="table w-[auto] bg-white text-center" v-if="!loading">
      <thead class="bg-slate-100">
        <tr>
          <th></th>
          <th :colspan="SITE_MAX" v-for="day in Number(DAY_MAX)" :key="day">Day {{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(slotList, slot) in renderList" :key="slot">
          <th class="w-[90px] bg-slate-100 text-xs">{{ slotMapping(slot) }}</th>
          <td v-for="item in slotList" :key="item?.id" class="w-[90px]">
            <div v-if="item.id !== '0'" class="grid gap-1">
              <div class="text-xs">{{ item.title }}</div>
              <button
                v-if="!isCreatedMode"
                class="btn btn-outline btn-info btn-xs"
                @click="_s.addAttendee(item)"
                :disabled="
                  curtUserJoinedSession.some((el) => el.day === item.day && el.slot === item.slot)
                "
              >
                JOIN
              </button>
            </div>
            <div v-else>
              <button
                v-if="isCreatedMode"
                class="btn btn-outline btn-info btn-xs"
                @click="openModal(item)"
              >
                Create
              </button>
              <div v-else class="text-slate-600 opacity-50">N/A</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <dialog id="CreateModal" class="modal" ref="CreateModal">
      <div class="modal-box" v-if="openModalData">
        <h3 class="mb-8 text-lg font-bold">Create Session</h3>
        <div class="mb-6 grid grid-cols-2 gap-1">
          <div class="row"><span class="w-20">Day</span> {{ openModalData.day }}</div>
          <div class="row">
            <span class="w-20">Title</span>
            <select class="select select-bordered select-sm w-24" v-model="openModalData.title">
              <option v-for="title in titles" :key="title">{{ title }}</option>
            </select>
          </div>

          <div class="row">
            <span class="w-20">slot</span>
            {{ slotMapping(openModalData?.day) }}
          </div>
          <div class="row items-center">
            <span class="w-20">Speaker</span>
            <select
              class="select select-bordered select-sm w-24"
              v-model="openModalData.speaker_id"
            >
              <option
                v-for="user in speakers"
                :key="user.id"
                :value="user.id"
                :disabled="sameSlotSession.some((el) => el.speaker_id === user.id)"
              >
                {{ user.name }}
              </option>
            </select>
          </div>
          <div class="row">
            <span class="w-20">Site</span>{{ siteMapping(openModalData?.site) }}
          </div>
        </div>
        <div class="row justify-end">
          <button class="btn" @click="CreateModal.close()">Close</button>
          <button class="btn btn-success" @click="handleCreate">Confirm</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.row {
  @apply flex items-center  gap-3;
}
</style>
