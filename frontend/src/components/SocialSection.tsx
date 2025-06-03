"use client"

import React, { useState } from "react"
import { Social } from "../types/profile"
import { v4 as uuidv4 } from "uuid"

export interface SocialSectionProps {
  socials: Social[]
  isLoggedIn: boolean
  onAdd: (social: Social) => void
  onUpdate: (social: Social) => void
  onDelete: (id: string) => void
}

const SocialSection: React.FC<SocialSectionProps> = ({ socials, isLoggedIn, onAdd, onUpdate, onDelete }) => {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Social, "id">>({
    platform: "",
    url: "",
    icon: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      platform: "",
      url: "",
      icon: "",
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log('소셜 링크 폼 데이터:', formData);

    if (editingId) {
      onUpdate({
        id: editingId,
        ...formData,
      })
      setEditingId(null)
    } else {
      onAdd({
        id: "temp",
        ...formData,
      } as Social)
    }

    resetForm()
  }

  const startEditing = (social: Social) => {
    setFormData({
      platform: social.platform,
      url: social.url,
      icon: social.icon,
    })
    setEditingId(social.id)
    setIsAddingNew(true)
  }

  const socialIcons: Record<string, React.ReactNode> = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
  }

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="terminal-header w-max mx-auto mb-6 px-8 rounded-full">
            <div className="terminal-dot terminal-dot-red"></div>
            <div className="terminal-dot terminal-dot-yellow"></div>
            <div className="terminal-dot terminal-dot-green"></div>
            <code className="ml-4 text-sm text-gray-400">socials.config.js</code>
          </div>

          {socials && socials.length > 0 ? (
            <div className="terminal-card mb-6">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red"></div>
                <div className="terminal-dot terminal-dot-yellow"></div>
                <div className="terminal-dot terminal-dot-green"></div>
                <span className="ml-2 font-mono text-xs text-gray-400">social.links.js</span>
              </div>
              <div className="terminal-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {socials.map((social) => (
                    <div key={social.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-700 transition-all">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gray-700 text-cyan-400 rounded-full">
                          {social.platform && socialIcons[social.platform.toLowerCase()] ? (
                            socialIcons[social.platform.toLowerCase()]
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4 min-w-0 flex-1 overflow-hidden">
                          <h3 className="font-medium text-gray-300 font-mono truncate">{social.platform || "Social Link"}</h3>
                          <a href={social.url || "#"} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline block truncate">
                            {social.url ? social.url.replace(/^https?:\/\//, "") : "No URL provided"}
                          </a>
                        </div>
                      </div>

                      {isLoggedIn && (
                        <div className="flex space-x-2 flex-shrink-0 ml-2">
                          <button onClick={() => startEditing(social)} className="p-1 text-gray-400 hover:text-cyan-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button onClick={() => onDelete(social.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="terminal-card mb-6">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red"></div>
                <div className="terminal-dot terminal-dot-yellow"></div>
                <div className="terminal-dot terminal-dot-green"></div>
                <span className="ml-2 font-mono text-xs text-gray-400">empty.js</span>
              </div>
              <div className="terminal-body p-6">
                <p className="text-gray-400 font-mono text-center">
                  <span className="text-purple-400">const</span> socials = [];
                  <span className="block mt-2 text-gray-500">// 소셜 링크가 아직 없습니다.</span>
                </p>
              </div>
            </div>
          )}

          {isLoggedIn && (
            <div className="mt-8 text-center">
              {isAddingNew ? (
                <div className="terminal-card">
                  <div className="terminal-header">
                    <div className="terminal-dot terminal-dot-red"></div>
                    <div className="terminal-dot terminal-dot-yellow"></div>
                    <div className="terminal-dot terminal-dot-green"></div>
                    <span className="ml-2 font-mono text-xs text-gray-400">social.{editingId ? 'update' : 'add'}.js</span>
                  </div>
                  <div className="terminal-body p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="platform" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> platform
                          </label>
                          <input
                            type="text"
                            id="platform"
                            name="platform"
                            value={formData.platform}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                            required
                            placeholder="Github, LinkedIn, etc."
                          />
                        </div>

                        <div>
                          <label htmlFor="url" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> url
                          </label>
                          <input
                            type="url"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                            required
                            placeholder="https://..."
                          />
                        </div>

                        <div>
                          <label htmlFor="icon" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> icon
                          </label>
                          <input
                            type="text"
                            id="icon"
                            name="icon"
                            value={formData.icon}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                            placeholder="아이콘 코드 또는 비워두세요"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-3 justify-center">
                        <button 
                          type="submit" 
                          className="px-4 py-2 font-mono text-sm text-black bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                        >
                          {editingId ? "update()" : "add()"}
                        </button>
                        <button 
                          type="button" 
                          onClick={resetForm} 
                          className="px-4 py-2 font-mono text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
                        >
                          cancel()
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingNew(true)} 
                  className="inline-flex items-center px-4 py-2 font-mono text-sm bg-gray-800 text-green-400 rounded-md hover:bg-gray-700 border border-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  social.add()
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SocialSection
