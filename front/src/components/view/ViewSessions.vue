<script setup lang="ts">
import { users, sessions } from '@/assets/mock'
import { computed, ref } from 'vue'
import { dateMapping, siteMapping } from '@/common'

// const list = sessions.map((el) => ({
//   ...el
//   // attendees: el.attendees.map((id) => users.find((user) => user.id === id))
// }))

type SessionType = {
  id: number
  date: number
  range: number
  site: number
  title: string
  speaker_id: number
  attendees: number[]
}
// 天數、場地數量
// 天數可增減、場地可增減，可擴展性
const capacity = [3, 2]

const renderList = computed(() => {
  const AMList: SessionType[] = []
  const PMList: SessionType[] = []

  const defaultItem = {
    id: 0,
    title: '',
    speaker_id: 0,
    attendees: [0]
  }

  for (let date = 1; date <= capacity[0]; date++) {
    for (let site = 1; site <= capacity[1]; site++) {
      AMList.push(
        sessions.find((el) => el.date === date && el.range === 1 && el.site === site) || {
          ...defaultItem,
          date,
          range: 1,
          site
        }
      )
      PMList.push(
        sessions.find((el) => el.date === date && el.range === 2 && el.site === site) || {
          ...defaultItem,
          date,
          range: 2,
          site
        }
      )
    }
  }
  return [AMList, PMList]
})

const CreateModal = ref()
const openModalData = ref<SessionType>()
const openModal = (item: SessionType) => {
  openModalData.value = item
  console.log(item)
  CreateModal.value.showModal()
}

const handleCreate = () => {
  console.log(123)
}
</script>

<template>
  <div class="overflow-x-auto">
    <dialog id="CreateModal" class="modal" ref="CreateModal">
      <div class="modal-box">
        <h3 class="mb-8 text-lg font-bold">Create Session</h3>
        <div class="mb-6 grid grid-cols-2 gap-1">
          <div class="flex"><span class="w-20">Day</span> {{ openModalData?.date }}</div>
          <div class="flex">
            <span class="w-20">Range</span>
            {{ dateMapping(openModalData?.date) }}
          </div>
          <div class="flex">
            <span class="w-20">Site</span>{{ siteMapping(openModalData?.site) }}
          </div>
          <div class="flex"><span class="w-20">Speaker</span>{{ openModalData?.speaker_id }}</div>
          <div class="flex"><span class="w-20">Attendee</span> {{ openModalData?.attendees }}</div>
        </div>
        <div class="flex justify-end gap-3">
          <button class="btn">Close</button>
          <button class="btn" @click="handleCreate">Confirm</button>
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
          <th colspan="2">Day 1</th>
          <th colspan="2">Day 2</th>
          <th colspan="2">Day 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="bg-slate-100 text-xs">Morning</th>
          <td v-for="item in renderList[0]" :key="item?.id">
            {{ item.title }}
            <div v-show="item.id === 0">
              <button class="btn btn-outline btn-info btn-xs" @click="openModal(item)">
                Create
              </button>
            </div>
          </td>
        </tr>
        <tr>
          <th class="bg-slate-100 text-xs">Afternoon</th>
          <td v-for="item in renderList[1]" :key="item?.id">
            {{ item?.title }}
            <div v-show="!item?.title">
              <button class="btn btn-outline btn-info btn-xs">Create</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
