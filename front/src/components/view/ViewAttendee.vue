<script setup lang="ts">
import { useSessions } from '@/stores/useSessions'
import { useSetting } from '@/stores/useSetting'
import { ref } from 'vue'
const _s = useSetting()
const _useSessions = useSessions()

const handleJoin = () => {
  _s.renderView = 'sessions'
  _s.mode = 'join'
}

const newName = ref('')
const addMember = () => {
  if (newName.value === '') return
  _useSessions.addMember(newName.value)
  newName.value = ''
}
</script>
<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra max-w-[300px] text-center">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in _useSessions.members" :key="user.id" @click="handleJoin">
          <th>{{ user.id }}</th>
          <td>{{ user.name }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 px-1 py-5">
      <input
        type="text"
        placeholder="name"
        class="input input-sm input-bordered"
        v-model="newName"
        @keydown.enter="addMember"
      />
      <button class="btn btn-success btn-sm text-white" @click="addMember">Add +</button>
    </div>
  </div>
</template>

<style scoped></style>
