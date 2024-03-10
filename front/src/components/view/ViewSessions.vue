<script setup lang="ts">
import { computed, ref } from 'vue'
import { titles } from '@/assets/mock'
import { slotMapping, siteMapping } from '@/common'
import { useSessions } from '@/stores/useSessions'
import { storeToRefs } from 'pinia'
import type { SessionType } from '@/stores/typing'
const _s = useSessions()
const { sessions, speakers, curtUser, isCreatedMode } = storeToRefs(_s)

// 天數、場地 數量，依據業務邏輯調整
const DAY_MAX = 3
const SITE_MAX = 2

const defaultItem = {
  id: '0',
  title: '',
  speaker_id: '0',
  attendees: []
}
const renderList = computed(() => {
  const res: Record<number, SessionType[]> = { 1: [], 2: [] }
  const speaker_id = speakers.value[0] ? speakers.value[0].id : '0'

  for (let day = 1; day <= DAY_MAX; day++) {
    for (let slot = 1; slot <= 2; slot++) {
      for (let site = 1; site <= SITE_MAX; site++) {
        const ta = sessions.value.find(
          (el) => el.day === day && el.slot === slot && el.site === site
        )
        res[slot].push(ta || { ...defaultItem, day, slot, site, speaker_id })
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

const curtUserJoinedArr = computed(() => {
  if (!curtUser.value) return []
  if (!curtUser.value.joined) return []
  return curtUser.value.joined.map((el) => el.session_id)
})
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table w-[auto] bg-white text-center">
      <thead class="bg-slate-100">
        <tr>
          <th></th>
          <th :colspan="SITE_MAX" v-for="day in DAY_MAX" :key="day">Day {{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(slotList, index) in renderList" :key="index">
          <th class="w-[90px] bg-slate-100 text-xs">{{ slotMapping(index) }}</th>
          <td v-for="item in slotList" :key="item?.id" class="w-[90px]">
            <div v-if="item.id !== '0'" class="grid gap-1">
              <div>{{ item.title }}</div>
              <button
                v-if="!isCreatedMode"
                class="btn btn-outline btn-info btn-xs"
                @click="_s.addAttendee(item)"
                :disabled="curtUserJoinedArr.includes(item.id)"
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
              <option v-for="user in speakers" :key="user.id" :value="user.id">
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
