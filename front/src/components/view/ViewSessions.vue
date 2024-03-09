<script setup lang="ts">
import { computed, ref } from 'vue'
import { users, sessions, titles } from '@/assets/mock'
import { dateMapping, siteMapping } from '@/common'

type SessionType = {
  id: number
  date: number
  range: number
  site: number
  title: string
  speaker_id: number
  attendees: number[]
}
// 天數、場地 數量
const dateMax = 3
const siteMax = 2
const defaultItem = {
  id: 0,
  title: '',
  speaker_id: 0,
  attendees: [0]
}

const renderList = computed(() => {
  const res: Record<number, SessionType[]> = { 1: [], 2: [] }

  for (let date = 1; date <= dateMax; date++) {
    for (let range = 1; range <= 2; range++) {
      for (let site = 1; site <= siteMax; site++) {
        const ta = sessions.find((el) => el.date === date && el.range === range && el.site === site)
        res[range].push(ta || { ...defaultItem, date, range, site })
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
  console.log(openModalData.value)
  if (!openModalData.value?.speaker_id) return
  CreateModal.value.close()
}

import { useSetting } from '@/stores/setting'
const _s = useSetting()
</script>

<template>
  <div class="overflow-x-auto">
    <dialog id="CreateModal" class="modal" ref="CreateModal">
      <div class="modal-box" v-if="openModalData">
        <h3 class="mb-8 text-lg font-bold">Create Session</h3>
        <div class="mb-6 grid grid-cols-2 gap-1">
          <div class="row"><span class="w-20">Day</span> {{ openModalData.date }}</div>
          <div class="row">
            <span class="w-20">Title</span>
            <select class="select select-bordered select-sm" v-model="openModalData.title">
              <option v-for="title in titles" :key="title">{{ title }}</option>
            </select>
          </div>

          <div class="row">
            <span class="w-20">Range</span>
            {{ dateMapping(openModalData?.date) }}
          </div>
          <div class="row items-center">
            <span class="w-20">Speaker</span>
            <select class="select select-bordered select-sm" v-model="openModalData.speaker_id">
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
          <div class="row">
            <span class="w-20">Site</span>{{ siteMapping(openModalData?.site) }}
          </div>
        </div>
        <div class="row justify-end">
          <button class="btn">Close</button>
          <button class="btn btn-success" @click="handleCreate">Confirm</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <table class="table text-center">
      <thead>
        <tr>
          <th></th>
          <th :colspan="siteMax" v-for="date in dateMax" :key="date">Day {{ date }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rangeList, index) in renderList" :key="index">
          <th class="bg-slate-100 text-xs">{{ dateMapping(index) }}</th>
          <td v-for="item in rangeList" :key="item?.id">
            <div v-if="item.id !== 0" class="grid gap-1">
              <div>{{ item.title }}</div>
              <button v-if="!_s.isCreatedMode" class="btn btn-outline btn-info btn-xs">JOIN</button>
            </div>
            <div v-else>
              <button
                v-if="_s.isCreatedMode"
                class="btn btn-outline btn-info btn-xs"
                @click="openModal(item)"
              >
                Create
              </button>
              <div v-else>N/A</div>
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
