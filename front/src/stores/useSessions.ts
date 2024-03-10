import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'

const url = 'https://sessions-mana.pockethost.io/'
const pb = new PocketBase(url)

export type SessionType = {
  id: string
  day: number
  range: number
  site: number
  title: string
  speaker_id: string
  attendees: string[]
}

type MemberType = {
  id: string
  name: string
}
type SpeakerType = {
  id: string
  name: string
  members_id: string
}

export const useSessions = defineStore('sessions', () => {
  const sessions = ref<SessionType[]>([])
  const members = ref<MemberType[]>([])
  const speakers = ref<SpeakerType[]>([])

  const fetchSessions = async () => {
    sessions.value = await pb.collection('sessions').getFullList()
  }
  const addSession = async (params: any) => {
    const record = await pb.collection('sessions').create(params)
    sessions.value.push(record as any)
  }

  const fetchMembers = async () => {
    members.value = await pb.collection('members').getFullList()
  }
  const fetchSpeakers = async () => {
    const res = await pb
      .collection('speakers')
      .getFullList({ expand: 'members_id', fields: 'id,members_id,expand.members_id.name' })
    speakers.value = res.map(({ id, members_id, expand }) => ({
      id,
      members_id,
      name: expand!.members_id.name
    }))
  }

  const addMember = async (name: string) => {
    const record = await pb.collection('members').create({ name })
    members.value.push(record as any)
  }

  const addSpeaker = async (id: string) => {
    await pb.collection('speakers').create({ members_id: id })
    fetchSpeakers()
  }

  onMounted(() => {
    fetchMembers()
    fetchSpeakers()
    fetchSessions()
  })

  return {
    fetchSessions,
    fetchMembers,
    addMember,
    addSpeaker,
    addSession,
    fetchSpeakers,
    sessions,
    members,
    speakers
  }
})
