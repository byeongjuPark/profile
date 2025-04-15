export interface TroubleShooting {
  id: string
  title: string
  description: string
  image?: string
  imageFile?: File
}

export interface Project {
  id: string
  title: string
  name?: string
  role?: string
  summary: string
  description: string
  technologies: string[]
  thumbnail?: string
  images: string[]
  github?: string
  website?: string
  startDate: string
  endDate: string
  troubleshooting: TroubleShooting[]
}
