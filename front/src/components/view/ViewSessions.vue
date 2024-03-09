<script setup lang="ts">
import { users, sessions } from '@/assets/mock'

const list = sessions.map((el) => ({
  ...el,
  attendees: el.attendees.map((id) => users.find((user) => user.id === id))
}))
</script>

<template>
  <!-- <pre>{{ list }}</pre> -->
  <div class="overflow-x-auto">
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
          <td>
            Session A
            <!-- <button class="btn btn-outline btn-info btn-sm">Edit</button> -->
          </td>
          <td><button class="btn btn-outline btn-info btn-xs">Create</button></td>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
        </tr>
        <tr>
          <th class="bg-slate-100 text-xs">Afternoon</th>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
          <td>Session A</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
