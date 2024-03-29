export type SessionType = {
  id: string
  day: number
  slot: number
  site: number
  title: string
  max_attendees: number
  speaker_id: string
  attendees: string[]
}

export type MemberType = {
  id: string
  name: string
  joined: { id: string; identifier: string; session_id: string }[]
}

export type SpeakerType = {
  id: string
  name: string
  members_id: string
  ids: { id: string }[]
}

export type AttendeeType = {
  id: string
  members_id: string
  session_id: string
  identifier: number
}
