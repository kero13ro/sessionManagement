import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import PocketBase from 'pocketbase'
import { useSetting } from './useSetting'

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
  joined: { id: string; identifier: string; session_id: string }[]
}

type SpeakerType = {
  id: string
  name: string
  members_id: string
}

type AttendeeType = {
  id: string
  members_id: string
  session_id: string
  identifier: number
}

export const useSessions = defineStore('sessions', () => {
  const sessions = ref<SessionType[]>([])
  const members = ref<MemberType[]>([])
  const speakers = ref<SpeakerType[]>([])
  const attendeesArr = ref<AttendeeType[]>([])
  const _s = useSetting()

  const fetchSessions = async () => {
    sessions.value = await pb.collection('sessions').getFullList()
  }
  const addSession = async (params: any) => {
    const record = await pb.collection('sessions').create(params)
    sessions.value.push(record as any)
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
    const res = await pb
      .collection('speakers')
      .getFullList({ expand: 'members_id', fields: 'id,members_id,expand.members_id.name' })
    speakers.value = res.map(({ id, members_id, expand }) => ({
      id,
      members_id,
      name: expand!.members_id.name
    }))
  }

  const fetchAttendees = async () => {
    const record = await pb
      .collection('attendees')
      .getFullList({ fields: 'id,members_id,session_id,identifier' })
    attendeesArr.value = record as any
  }

  const addMember = async (name: string) => {
    const record = await pb.collection('members').create({ name })
    members.value.push(record as any)
  }

  const addSpeaker = async (id: string) => {
    await pb.collection('speakers').create({ members_id: id })
    fetchSpeakers()
  }

  const pad = (n: number, digit: number = 2) => String(n).padStart(digit, '0')

  const addAttendee = async (sessions: SessionType) => {
    const { day, range, site, id: session_id } = sessions
    const arr = attendeesArr.value
      .filter((el) => el.session_id === session_id)
      .map((el) => Number(String(el.identifier).slice(5)))
    const NewId = arr.length > 0 ? Math.max(...arr) + 1 : 1

    const identifier = Number(day + pad(range) + pad(site) + pad(NewId, 5))
    const params = {
      members_id: curtUser.value!.id,
      session_id,
      identifier
    }

    const res = await pb.collection('attendees').create(params)
    attendeesArr.value.push(res as any)
    curtUser.value?.joined.push(res as any)
  }

  const curtUser = ref<MemberType | null>(null)
  const joinedArr = computed(() => {
    if (!curtUser.value) return []
    if (!curtUser.value.joined) return []
    return curtUser.value.joined.map((el) => el.session_id)
  })

  const handleJoin = (user: MemberType) => {
    _s.renderView = 'sessions'
    _s.mode = 'join'
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
    fetchSpeakers,
    handleJoin,
    addAttendee,
    sessions,
    members,
    speakers,
    curtUser,
    joinedArr
  }
})
