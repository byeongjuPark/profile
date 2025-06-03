"use client"

import React, { useState, useRef, ChangeEvent } from "react"
import Link from "next/link"
import Image from "next/image"

export interface ProfileHeaderProps {
  profile: {
    id?: string
    name?: string
    title?: string
    bio?: string
    email?: string
    image?: string
    location?: string
    github?: string
    linkedin?: string
    website?: string
    skills?: string[]
    phone?: string
  } | null
  isLoggedIn: boolean
  onProfileUpdate: (profile: any) => void
  onSkillsUpdate: (skills: string[]) => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isLoggedIn, onProfileUpdate, onSkillsUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(profile?.name || "")
  const [title, setTitle] = useState(profile?.title || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [location, setLocation] = useState(profile?.location || "")
  const [email, setEmail] = useState(profile?.email || "")
  const [github, setGithub] = useState(profile?.github || "")
  const [linkedin, setLinkedin] = useState(profile?.linkedin || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [skillsInput, setSkillsInput] = useState((profile?.skills || []).join(", "))
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    if (isLoggedIn && isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0].name)
      setImageFile(e.target.files[0])
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "")

    onProfileUpdate({
      name,
      title,
      bio,
      location,
      email,
      github,
      linkedin,
      website,
      phone,
      image: imageFile,
    })

    onSkillsUpdate(skills)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setName(profile?.name || "")
    setTitle(profile?.title || "")
    setBio(profile?.bio || "")
    setLocation(profile?.location || "")
    setEmail(profile?.email || "")
    setGithub(profile?.github || "")
    setLinkedin(profile?.linkedin || "")
    setWebsite(profile?.website || "")
    setPhone(profile?.phone || "")
    setSkillsInput((profile?.skills || []).join(", "))
    setImageFile(null)
    setIsEditing(false)
  }

  // 이미지 URL 가져오기
  const getImageUrl = (path?: string) => {
    if (!path) return "/default-avatar.png"
    
    // 이미 완전한 URL이면 그대로 반환
    if (path.startsWith("http")) return path
    
    // 백엔드 URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin
    
    // API 경로로 시작하면 백엔드 URL과 조합
    if (path.startsWith("/api/")) {
      return `${backendUrl}${path}`
    }
    
    // 그 외의 경우 이미지 API로 요청 형식 구성
    return `${backendUrl}/api/images/${path}`
  }

  return (
    <section className="relative bg-gray-900 pb-10">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="container mx-auto px-4 md:px-6 pt-12 relative z-10">
        <div className="terminal-header w-max mx-auto mb-6 px-8 rounded-full">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <code className="ml-4 text-sm text-gray-400">developer.profile</code>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div 
              className={`w-32 h-32 md:w-40 md:h-40 border-4 ${isEditing ? 'border-green-500 cursor-pointer' : 'border-gray-800'} rounded-lg overflow-hidden terminal-box`}
              onClick={handleAvatarClick}
            >
              {isImageUploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-400"></div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Image 
                    src={imageFile ? URL.createObjectURL(imageFile) : getImageUrl(profile?.image)}
                    alt={profile?.name || "User"} 
                    fill
                    style={{ objectFit: "cover" }}
                    className="opacity-90"
                  />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {isLoggedIn && !isEditing && (
              <button 
                onClick={handleEdit} 
                className="mt-4 inline-flex items-center px-4 py-2 font-mono text-sm bg-gray-800 text-green-400 rounded-md hover:bg-gray-700 border border-gray-700"
              >
                profile.edit()
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full max-w-2xl mt-6 terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red"></div>
                <div className="terminal-dot terminal-dot-yellow"></div>
                <div className="terminal-dot terminal-dot-green"></div>
                <span className="ml-2 font-mono text-xs text-gray-400">profile.edit.js</span>
              </div>
              <div className="terminal-body p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> title
                    </label>
                    <input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> location
                    </label>
                    <input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> email
                    </label>
                    <input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> phone
                    </label>
                    <input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                      placeholder="01012345678"
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> github
                    </label>
                    <input
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> linkedin
                    </label>
                    <input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> website
                    </label>
                    <input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="skills" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> skills = []
                    </label>
                    <input
                      id="skills"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="JavaScript, React, Node.js, ..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-gray-300 font-mono mb-2">
                      <span className="text-purple-400">const</span> bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono resize-none h-32"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 font-mono rounded-md"
                  >
                    cancel()
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-black font-mono rounded-md"
                  >
                    save()
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h1 className="text-3xl md:text-4xl font-bold font-mono text-white mb-2">
                <span className="text-green-400">user</span>.{name || "Guest"}
              </h1>
              {title && (
                <p className="text-xl text-gray-300 font-mono mb-4">
                  <span className="text-yellow-400">function</span> {title}()
                </p>
              )}
              
              <div className="text-sm text-white/70 font-mono mb-4">
                <div className="flex flex-wrap justify-center gap-6">
                  {location && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-300">location: "<span className="text-yellow-300">{location}</span>"</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-300">email: "<span className="text-yellow-300">{email}</span>"</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-300">phone: "<span className="text-yellow-300">{phone}</span>"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                {github && (
                  <Link
                    href={github.startsWith("http") ? github : `https://github.com/${github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.266.098-2.635 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.369.202 2.382.1 2.635.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                  </Link>
                )}
                {linkedin && (
                  <Link
                    href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </Link>
                )}
                {website && (
                  <Link
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </Link>
                )}
              </div>
              
              {bio && (
                <div className="mb-6 max-w-2xl mx-auto">
                  <div className="terminal-card overflow-hidden">
                    <div className="terminal-header">
                      <div className="terminal-dot terminal-dot-red"></div>
                      <div className="terminal-dot terminal-dot-yellow"></div>
                      <div className="terminal-dot terminal-dot-green"></div>
                      <span className="ml-2 font-mono text-xs text-gray-400">bio.md</span>
                    </div>
                    <div className="terminal-body p-4">
                      <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                        /**
                        <br /> * {bio.split('\n').join('\n * ')}
                        <br /> */
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {profile?.skills && profile.skills.length > 0 && (
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-medium mb-3 font-mono text-center text-gray-300">
                    <span className="text-purple-400">const</span> skills = [
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-md text-sm border border-gray-700 font-mono"
                      >
                        "{skill}"
                      </span>
                    ))}
                  </div>
                  <div className="text-center font-mono text-gray-300">]</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProfileHeader
