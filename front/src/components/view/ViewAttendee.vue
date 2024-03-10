<script setup lang="ts">
import { useSessions } from '@/stores/useSessions'
import { ref } from 'vue'
const _useSessions = useSessions()
const newName = ref('')
const addMember = () => {
  if (newName.value === '') return
  _useSessions.addMember(newName.value)
  newName.value = ''
}
</script>
<template>
  <div class="px-6 py-12">
    <table class="table max-w-[300px] bg-white text-center">
      <thead class="bg-slate-100">
        <tr>
          <!-- <th>Id</th> -->
          <th>Name</th>
          <th>Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in _useSessions.members"
          :key="user.id"
          @click="_useSessions.handleJoin(user)"
          class="hover cursor-pointer"
        >
          <!-- <th>{{ user.id }}</th> -->
          <td>{{ user.name }}</td>
          <td>
            <div v-if="user.joined" class="flex gap-2">
              <div class="badge badge-ghost text-xs" v-for="el in user.joined" :key="el.id">
                {{ el.identifier }}
              </div>
            </div>
          </td>
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
