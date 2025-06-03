// Profile related types for frontend
export interface Profile {
  id: string // Frontend uses string IDs
  name: string
  title: string
  bio?: string
  email?: string
  image?: string | File // Support both string URL and File object
  phone?: string
  address?: string
  careers: Career[]
  educations: Education[]
  skills: Skill[]
  socials: Social[]
  location?: string
  github?: string
  linkedin?: string
  website?: string
}

export interface Career {
  id: string // Frontend uses string IDs
  company: string
  position: string
  period: string
  description?: string
}

export interface Education {
  id: string // Frontend uses string IDs
  institution: string
  degree?: string
  period: string
  description?: string
}

export interface Skill {
  id: string // Frontend uses string IDs
  name: string
  level: number
  category?: string
}

export interface Social {
  id: string // Frontend uses string IDs
  platform: string
  url?: string
  icon?: string
}

// Backend DTO types for reference (not used directly in components)
export interface BackendProfile {
  id: number // Backend uses number IDs
  name: string
  title: string
  bio?: string
  email?: string
  image?: string
  phone?: string
  address?: string
  careers: BackendCareer[]
  educations: BackendEducation[]
  skills: BackendSkill[]
  socials: BackendSocial[]
}

export interface BackendCareer {
  id: number // Backend uses number IDs
  company: string
  position: string
  period: string
  description?: string
}

export interface BackendEducation {
  id: number // Backend uses number IDs
  institution: string
  degree?: string
  period: string
  description?: string
}

export interface BackendSkill {
  id: number // Backend uses number IDs
  name: string
  level: number
  category?: string
}

export interface BackendSocial {
  id: number // Backend uses number IDs
  platform: string
  url?: string
  icon?: string
}
