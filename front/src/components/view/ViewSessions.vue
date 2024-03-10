<script setup lang="ts">
import { computed, ref } from 'vue'
import { titles } from '@/assets/mock'
import { rangeMapping, siteMapping } from '@/common'
import { useSetting } from '@/stores/useSetting'
import { useSessions, type SessionType } from '@/stores/useSessions'
import { storeToRefs } from 'pinia'
const _s = useSetting()
const _useSessions = useSessions()
const addAttendee = _useSessions.addAttendee
const { sessions, speakers, joinedArr } = storeToRefs(_useSessions)

// 天數、場地 數量，依據業務邏輯調整
const DAY_MAX = 3
const SITE_MAX = 2

const defaultItem = {
  id: '0',
  title: '',
  speaker_id: '0',
  attendees: ['0']
}

const renderList = computed(() => {
  if (sessions.value.length === 0) return { 1: [], 2: [] }
  const res: Record<number, SessionType[]> = { 1: [], 2: [] }

  for (let day = 1; day <= DAY_MAX; day++) {
    for (let range = 1; range <= 2; range++) {
      for (let site = 1; site <= SITE_MAX; site++) {
        const ta = sessions.value.find(
          (el) => el.day === day && el.range === range && el.site === site
        )
        res[range].push(ta || { ...defaultItem, day, range, site })
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
  const { day, range, site, speaker_id, title } = openModalData.value
  const params = { day, range, site, speaker_id, title }
  _useSessions.addSession(params)
  CreateModal.value.close()
}
</script>

<template>
  <div class="overflow-x-auto">
    <dialog id="CreateModal" class="modal" ref="CreateModal">
      <div class="modal-box" v-if="openModalData">
        <h3 class="mb-8 text-lg font-bold">Create Session</h3>
        <div class="mb-6 grid grid-cols-2 gap-1">
          <div class="row"><span class="w-20">Day</span> {{ openModalData.day }}</div>
          <div class="row">
            <span class="w-20">Title</span>
            <select class="select select-bordered select-sm" v-model="openModalData.title">
              <option v-for="title in titles" :key="title">{{ title }}</option>
            </select>
          </div>

          <div class="row">
            <span class="w-20">Range</span>
            {{ rangeMapping(openModalData?.day) }}
          </div>
          <div class="row items-center">
            <span class="w-20">Speaker</span>
            <select class="select select-bordered select-sm" v-model="openModalData.speaker_id">
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

    <table class="table w-[auto] text-center">
      <thead>
        <tr>
          <th></th>
          <th :colspan="SITE_MAX" v-for="day in DAY_MAX" :key="day">Day {{ day }}</th>
        </tr>
        <!-- <tr class="subtitle border-b-slate-400">
          <th>range \ site</th>
          <th>site A</th>
          <th>site B</th>
          <th>site A</th>
          <th>site B</th>
          <th>site A</th>
          <th>site B</th>
        </tr> -->
      </thead>
      <tbody>
        <tr v-for="(rangeList, index) in renderList" :key="index">
          <th class="w-[100px] bg-slate-100 text-xs">{{ rangeMapping(index) }}</th>
          <td v-for="item in rangeList" :key="item?.id" >
            <div v-if="item.id !== '0'" class="grid gap-1">
              <div>{{ item.title }}</div>
              <button
                v-if="!_s.isCreatedMode"
                class="btn btn-outline btn-info btn-xs"
                @click="addAttendee(item)"
                :disabled="joinedArr.includes(item.id)"
              >
                JOIN
              </button>
            </div>
            <div v-else>
              <button
                v-if="_s.isCreatedMode"
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
  </div>
</template>

<style scoped>
.row {
  @apply flex items-center  gap-3;
}
</style>
