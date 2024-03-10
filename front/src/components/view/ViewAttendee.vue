<script setup lang="ts">
import { users } from '@/assets/mock'
import { useSetting } from '@/stores/useSetting'
const _s = useSetting()

const handleJoin = () => {
  _s.renderView = 'sessions'
  _s.mode = 'join'
}
</script>
<template>
  <div class="max-w-[300px] overflow-x-auto">
    <table class="table table-zebra text-center">
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" @click="handleJoin">
          <th>{{ user.id }}</th>
          <td>{{ user.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
@/stores/useSetting
