<script setup lang="ts">
import { useSessions } from '@/stores/useSessions'
import { computed, ref } from 'vue'
const _s = useSessions()

const addSpeakerModal = ref()
const addSpeaker = () => {
  addSpeakerModal.value.showModal()
}

const handleAdd = (id: string) => {
  _s.addSpeaker(id)
  addSpeakerModal.value.close()
}

const notSpeaker = computed(() => {
  const ids = _s.speakers.map((sp) => sp.members_id)
  return _s.members.filter((el) => !ids.includes(el.id))
})
</script>
<template>
  <div class="px-6 py-12">
    <dialog id="addSpeakerModal" class="modal" ref="addSpeakerModal">
      <div class="modal-box">
        <h3 class="mb-8 text-lg font-bold">Add Speaker</h3>
        <div class="mb-12 flex justify-center">
          <table class="table w-[200px] bg-white text-center">
            <thead class="bg-slate-100">
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

    <table class="table max-w-[200px] bg-white text-center">
      <thead class="bg-slate-100">
        <tr>
          <th>Speaker Name</th>
          <th>Session Id</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in _s.speakers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>
            <div class="flex items-center gap-2">
              <div class="badge badge-ghost text-xs" v-for="el in user.ids" :key="el.id">
                {{ el.id }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 px-1 py-5">
      <button class="btn btn-success btn-sm text-white" @click="addSpeaker">Add +</button>
    </div>
  </div>
</template>

<style scoped></style>
