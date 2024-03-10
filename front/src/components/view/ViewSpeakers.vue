<script setup lang="ts">
import { members } from '@/assets/mock'
import { useSessions } from '@/stores/useSessions'
import { useSetting } from '@/stores/useSetting'
import { computed, ref } from 'vue'
const _s = useSetting()
const _useSessions = useSessions()

const addSpeakerModal = ref()
const addSpeaker = () => {
  addSpeakerModal.value.showModal()
}

const handleAdd = (id: string) => {
  console.log(id)
  _useSessions.addSpeaker(id)
  addSpeakerModal.value.close()
}

const notSpeaker = computed(() => {
  const ids = _useSessions.speakers.map((sp) => sp.members_id)
  return _useSessions.members.filter((el) => !ids.includes(el.id))
})
</script>
<template>
  <div class="overflow-x-auto">
    <dialog id="addSpeakerModal" class="modal" ref="addSpeakerModal">
      <div class="modal-box">
        <h3 class="mb-8 text-lg font-bold">Add Speaker</h3>
        <div class="mb-12 flex justify-center">
          <table class="table table-zebra w-[200px] text-center">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in notSpeaker" :key="user.id" @click="handleAdd(user.id)">
                <td>{{ user.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end">
          <button class="btn" @click="addSpeakerModal.close()">Cancel</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <table class="table table-zebra max-w-[200px] text-center">
      <thead>
        <tr>
          <th>Speaker Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in _useSessions.speakers" :key="user.id">
          <td>{{ user.name }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 px-1 py-5">
      <button class="btn btn-success btn-sm text-white" @click="addSpeaker">Add +</button>
    </div>
  </div>
</template>

<style scoped></style>
