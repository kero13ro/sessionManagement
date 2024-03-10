import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import type { AttendeeType, MemberType, SessionType, SpeakerType } from './typing'

const url = 'https://sessions-mana.pockethost.io/'
const pb = new PocketBase(url)

export const useSessions = defineStore('sessions', () => {
  const renderView = ref<'sessions' | 'attendee' | 'speaker'>('sessions')
  const tableMode = ref<'create' | 'join'>('create')
  const isCreatedMode = computed(() => tableMode.value === 'create')

  const loading = ref(true)
  const sessions = ref<SessionType[]>([])
  const members = ref<MemberType[]>([])
  const speakers = ref<SpeakerType[]>([])
  const attendeesArr = ref<AttendeeType[]>([])

  const fetchSessions = async () => {
    sessions.value = await pb
      .collection('sessions')
      .getFullList({ fields: 'id,day,slot,site,title,speaker_id' })
    loading.value = false
  }

  const addSession = async (params: any) => {
    loading.value = true
    const record = await pb.collection('sessions').create(params)
    sessions.value.push(record as any)
    loading.value = false
  }

  const removeSession = async (id: string) => {
    loading.value = true
    await pb.collection('sessions').delete(id)
    sessions.value = sessions.value.filter((el) => el.id !== id)
    loading.value = false
  }

  const fetchMembers = async () => {
    const res = await pb.collection('members').getFullList({ expand: 'attendees_via_members_id' })
    members.value = res.map(({ id, name, expand = {} }) => ({
      id,
      name,
      joined: expand.attendees_via_members_id
    }))
  }

  const fetchSpeakers = async () => {
    const res = await pb.collection('speakers').getFullList({
      expand: 'members_id, sessions_via_speaker_id',
      fields: 'id,members_id,expand.members_id.name,expand.sessions_via_speaker_id.id'
    })

    console.log(res)
    speakers.value = res.map(({ id, members_id, expand }) => ({
      id,
      members_id,
      name: expand!.members_id.name,
      ids: expand!.sessions_via_speaker_id
    }))
  }

  const fetchAttendees = async () => {
    const record = await pb
      .collection('attendees')
      .getFullList({ fields: 'id,members_id,session_id,identifier' })
    attendeesArr.value = record as any
  }

  const addMember = async (name: string) => {
    loading.value = true
    const record = await pb.collection('members').create({ name })
    members.value.push(record as any)
    loading.value = false
  }

  const addSpeaker = async (id: string) => {
    loading.value = true
    await pb.collection('speakers').create({ members_id: id })
    fetchSpeakers()
    loading.value = false
  }

  const pad = (n: number, digit: number = 2) => String(n).padStart(digit, '0')

  const addAttendee = async (sessions: SessionType) => {
    loading.value = true
    const { day, slot, site, id: session_id } = sessions
    const arr = attendeesArr.value
      .filter((el) => el.session_id === session_id)
      .map((el) => Number(String(el.identifier).slice(5)))
    const NewId = arr.length > 0 ? Math.max(...arr) + 1 : 1

    const identifier = Number(day + pad(slot) + pad(site) + pad(NewId, 5))
    const params = {
      members_id: curtUser.value!.id,
      session_id,
      identifier
    }
    const res = await pb.collection('attendees').create(params)
    attendeesArr.value.push(res as any)
    if (!curtUser.value?.joined) {
      curtUser.value!.joined = [res as any]
    } else {
      curtUser.value?.joined.push(res as any)
    }
    loading.value = false
  }

  const curtUser = ref<MemberType | null>(null)

  const handleJoin = (user: MemberType) => {
    renderView.value = 'sessions'
    tableMode.value = 'join'
    curtUser.value = user
  }

  onMounted(() => {
    fetchMembers()
    fetchSpeakers()
    fetchSessions()
    fetchAttendees()
  })

  return {
    fetchSessions,
    fetchMembers,
    addMember,
    addSpeaker,
    addSession,
    removeSession,
    fetchSpeakers,
    handleJoin,
    addAttendee,
    renderView,
    tableMode,
    isCreatedMode,
    loading,

    sessions,
    members,
    speakers,
    curtUser
  }
})
