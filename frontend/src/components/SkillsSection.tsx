"use client"

import React, { useState } from "react"
import { Skill } from "../types/profile"
import { v4 as uuidv4 } from "uuid"

export interface SkillsSectionProps {
  skills: Skill[]
  isLoggedIn: boolean
  onAdd: (skill: Skill) => void
  onUpdate: (skill: Skill) => void
  onDelete: (id: string) => void
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, isLoggedIn, onAdd, onUpdate, onDelete }) => {
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Skill, "id">>({
    name: "",
    level: 3,
    category: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value, 10) : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      level: 3,
      category: "",
    })
    setIsAddingNew(false)
    setEditingId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Skill form data:", formData)

    if (editingId) {
      onUpdate({
        id: editingId,
        ...formData,
      })
      setEditingId(null)
    } else {
      onAdd({
        ...formData,
        id: "temp" // 임시 ID (백엔드에서 제거됨)
      } as Skill)
    }

    resetForm()
  }

  const startEditing = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category || "",
    })
    setEditingId(skill.id)
    setIsAddingNew(true)
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((groups, skill) => {
    const category = skill.category || "Other"
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(skill)
    return groups
  }, {} as Record<string, Skill[]>)

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="terminal-header w-max mx-auto mb-6 px-8 rounded-full">
            <div className="terminal-dot terminal-dot-red"></div>
            <div className="terminal-dot terminal-dot-yellow"></div>
            <div className="terminal-dot terminal-dot-green"></div>
            <code className="ml-4 text-sm text-gray-400">skills.config.js</code>
          </div>

          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-8 terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red"></div>
                <div className="terminal-dot terminal-dot-yellow"></div>
                <div className="terminal-dot terminal-dot-green"></div>
                <span className="ml-2 font-mono text-xs text-gray-400">{category.toLowerCase()}.js</span>
              </div>
              <div className="terminal-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center hover:border-cyan-700 transition-all">
                      <div>
                        <h4 className="font-medium text-gray-300 font-mono">{skill.name}</h4>
                        <div className="mt-2 flex items-center">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <svg key={index} className={`w-5 h-5 ${index < skill.level ? "text-cyan-400" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      {isLoggedIn && (
                        <div className="flex space-x-2">
                          <button onClick={() => startEditing(skill)} className="p-1 text-gray-400 hover:text-cyan-400 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button onClick={() => onDelete(skill.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
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
          ))}

          {isLoggedIn && (
            <div className="mt-8 text-center">
              {isAddingNew ? (
                <div className="terminal-card">
                  <div className="terminal-header">
                    <div className="terminal-dot terminal-dot-red"></div>
                    <div className="terminal-dot terminal-dot-yellow"></div>
                    <div className="terminal-dot terminal-dot-green"></div>
                    <span className="ml-2 font-mono text-xs text-gray-400">skill.{editingId ? 'update' : 'add'}.js</span>
                  </div>
                  <div className="terminal-body p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                            required
                            placeholder="JavaScript, React, etc."
                          />
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> category
                          </label>
                          <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                            placeholder="Frontend, Backend, etc."
                          />
                        </div>

                        <div>
                          <label htmlFor="level" className="block text-sm font-mono text-gray-300 mb-1">
                            <span className="text-purple-400">const</span> level
                          </label>
                          <select 
                            id="level" 
                            name="level" 
                            value={formData.level} 
                            onChange={handleInputChange} 
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 font-mono"
                          >
                            <option value="1">1 - 초급</option>
                            <option value="2">2 - 기초</option>
                            <option value="3">3 - 중급</option>
                            <option value="4">4 - 고급</option>
                            <option value="5">5 - 전문가</option>
                          </select>
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
                  skills.add()
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection
