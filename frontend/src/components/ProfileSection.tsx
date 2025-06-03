"use client"

import React, { useState } from "react"
import { Career, Education } from "@/types/profile"
import { v4 as uuidv4 } from "uuid"

export interface ProfileSectionProps {
  careers: Career[]
  educations: Education[]
  isLoggedIn: boolean
  onAddCareer: (career: Career) => void
  onUpdateCareer: (career: Career) => void
  onDeleteCareer: (id: string) => void
  onAddEducation: (education: Education) => void
  onUpdateEducation: (education: Education) => void
  onDeleteEducation: (id: string) => void
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ careers, educations, isLoggedIn, onAddCareer, onUpdateCareer, onDeleteCareer, onAddEducation, onUpdateEducation, onDeleteEducation }) => {
  const [isAddingCareer, setIsAddingCareer] = useState(false)
  const [isAddingEducation, setIsAddingEducation] = useState(false)
  const [editingCareer, setEditingCareer] = useState<Career | null>(null)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)

  const [careerForm, setCareerForm] = useState<Omit<Career, "id">>({
    company: "",
    position: "",
    period: "",
    description: "",
  })

  const [educationForm, setEducationForm] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    period: "",
    description: "",
  })

  const handleCareerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCareerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEducationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEducationForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCareerSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Career form data:", careerForm);

    if (editingCareer) {
      onUpdateCareer({
        id: editingCareer.id,
        ...careerForm,
      })
      setEditingCareer(null)
    } else {
      onAddCareer({
        ...careerForm,
      } as Career)
    }

    resetCareerForm()
  }

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Education form data:", educationForm);

    if (editingEducation) {
      onUpdateEducation({
        id: editingEducation.id,
        ...educationForm,
      })
      setEditingEducation(null)
    } else {
      onAddEducation({
        ...educationForm,
      } as Education)
    }

    resetEducationForm()
  }

  const startEditingCareer = (career: Career) => {
    setCareerForm({
      company: career.company,
      position: career.position,
      period: career.period,
      description: career.description,
    })
    setEditingCareer(career)
    setIsAddingCareer(true)
  }

  const startEditingEducation = (education: Education) => {
    setEducationForm({
      institution: education.institution,
      degree: education.degree || "",
      period: education.period,
      description: education.description || "",
    })
    setEditingEducation(education)
    setIsAddingEducation(true)
  }

  const resetCareerForm = () => {
    setCareerForm({
      company: "",
      position: "",
      period: "",
      description: "",
    })
    setIsAddingCareer(false)
    setEditingCareer(null)
  }

  const resetEducationForm = () => {
    setEducationForm({
      institution: "",
      degree: "",
      period: "",
      description: "",
    })
    setIsAddingEducation(false)
    setEditingEducation(null)
  }

  const generateFieldLabels = (type: "career" | "education") => {
    if (type === "career") {
      return {
        titleLabel: "Company",
        subtitleLabel: "Position",
        periodLabel: "Period",
        descriptionLabel: "Description",
      }
    } else {
      return {
        titleLabel: "Institution",
        subtitleLabel: "Degree",
        periodLabel: "Period",
        descriptionLabel: "Description",
      }
    }
  }

  const renderAddCareerForm = () => {
    const { titleLabel, subtitleLabel, periodLabel, descriptionLabel } = generateFieldLabels("career")

    return (
      <div className="terminal-card mb-6 overflow-hidden w-full max-w-2xl mx-auto">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <span className="ml-2 font-mono text-xs text-gray-400">career.{editingCareer ? 'update' : 'add'}.js</span>
        </div>
        <div className="terminal-body">
          <form onSubmit={handleCareerSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {titleLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="company" 
                  value={careerForm.company} 
                  onChange={handleCareerInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {subtitleLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="position" 
                  value={careerForm.position} 
                  onChange={handleCareerInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {periodLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="period" 
                  value={careerForm.period} 
                  onChange={handleCareerInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  placeholder="2020 - 2023" 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {descriptionLabel.toLowerCase()}
                </label>
                <textarea 
                  name="description" 
                  value={careerForm.description} 
                  onChange={handleCareerInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  rows={3} 
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              {editingCareer && (
                <button 
                  type="button" 
                  onClick={resetCareerForm} 
                  className="px-4 py-2 text-sm font-mono text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                >
                  cancel()
                </button>
              )}
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-mono text-black bg-green-600 rounded-md hover:bg-green-700"
              >
                {editingCareer ? 'update()' : 'add()'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderAddEducationForm = () => {
    const { titleLabel, subtitleLabel, periodLabel, descriptionLabel } = generateFieldLabels("education")

    return (
      <div className="terminal-card mb-6 overflow-hidden w-full max-w-2xl mx-auto">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <span className="ml-2 font-mono text-xs text-gray-400">education.{editingEducation ? 'update' : 'add'}.js</span>
        </div>
        <div className="terminal-body">
          <form onSubmit={handleEducationSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {titleLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="institution" 
                  value={educationForm.institution} 
                  onChange={handleEducationInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {subtitleLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="degree" 
                  value={educationForm.degree} 
                  onChange={handleEducationInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                />
              </div>
              <div>
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {periodLabel.toLowerCase()}
                </label>
                <input 
                  type="text" 
                  name="period" 
                  value={educationForm.period} 
                  onChange={handleEducationInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  placeholder="2018 - 2022" 
                  required 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-mono text-gray-300 mb-1">
                  <span className="text-purple-400">const</span> {descriptionLabel.toLowerCase()}
                </label>
                <textarea 
                  name="description" 
                  value={educationForm.description} 
                  onChange={handleEducationInputChange} 
                  className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 text-gray-300 font-mono" 
                  rows={3} 
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              {editingEducation && (
                <button 
                  type="button" 
                  onClick={resetEducationForm} 
                  className="px-4 py-2 text-sm font-mono text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                >
                  cancel()
                </button>
              )}
              <button 
                type="submit" 
                className="px-4 py-2 text-sm font-mono text-black bg-green-600 rounded-md hover:bg-green-700"
              >
                {editingEducation ? 'update()' : 'add()'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 max-w-4xl mx-auto">
          <h2 className="section-heading text-center mx-auto w-max">Career.getAll()</h2>

          <div className="space-y-6">
            {careers.map((career) => (
              <div key={career.id} className="terminal-card overflow-hidden">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red"></div>
                  <div className="terminal-dot terminal-dot-yellow"></div>
                  <div className="terminal-dot terminal-dot-green"></div>
                  <span className="ml-2 font-mono text-xs text-cyan-300">{career.company.toLowerCase().replace(/\s+/g, '-')}.js</span>
                  <span className="ml-auto text-xs text-gray-500 font-mono">{career.period}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-mono text-cyan-400 font-semibold">
                        <span className="text-green-400">class</span> {career.company}
                      </h3>
                      <p className="text-gray-300 font-mono">
                        <span className="text-purple-400">function</span> {career.position}() &#123;
                      </p>
                    </div>

                    {isLoggedIn && (
                      <div className="flex space-x-2">
                        <button onClick={() => startEditingCareer(career)} className="p-1 text-gray-400 hover:text-cyan-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button onClick={() => onDeleteCareer(career.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
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

                  <div className="mt-4 text-gray-300 bg-gray-800 p-4 rounded-md border-l-2 border-gray-600 whitespace-pre-line">
                    <code className="font-mono text-sm">
                      // {career.description}
                    </code>
                  </div>
                  <div className="mt-2 text-right text-gray-400 font-mono">&#125;</div>
                </div>
              </div>
            ))}
          </div>

          {isLoggedIn && (
            <div className="mt-6 text-center">
              {isAddingCareer ? (
                renderAddCareerForm()
              ) : (
                <button onClick={() => setIsAddingCareer(true)} className="flex items-center px-4 py-2 bg-gray-800 text-cyan-400 rounded-md hover:bg-gray-700 transition-colors mx-auto border border-gray-700 font-mono text-sm">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  careers.push(new Career())
                </button>
              )}
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center mx-auto w-max">Education.getAll()</h2>

          <div className="space-y-6">
            {educations.map((education) => (
              <div key={education.id} className="terminal-card overflow-hidden">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red"></div>
                  <div className="terminal-dot terminal-dot-yellow"></div>
                  <div className="terminal-dot terminal-dot-green"></div>
                  <span className="ml-2 font-mono text-xs text-purple-300">{education.institution.toLowerCase().replace(/\s+/g, '-')}.js</span>
                  <span className="ml-auto text-xs text-gray-500 font-mono">{education.period}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-mono text-purple-400 font-semibold">
                        <span className="text-yellow-400">import</span> {education.institution}
                      </h3>
                      {education.degree && (
                        <p className="text-gray-300 font-mono">
                          <span className="text-green-400">export default</span> <span className="text-amber-300">'{education.degree}'</span>
                        </p>
                      )}
                    </div>

                    {isLoggedIn && (
                      <div className="flex space-x-2">
                        <button onClick={() => startEditingEducation(education)} className="p-1 text-gray-400 hover:text-purple-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button onClick={() => onDeleteEducation(education.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
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

                  {education.description && (
                    <div className="mt-4 text-gray-300 bg-gray-800 p-4 rounded-md border-l-2 border-purple-600 whitespace-pre-line">
                      <code className="font-mono text-sm">
                        {education.description && `/* ${education.description} */`}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isLoggedIn && (
            <div className="mt-6 text-center">
              {isAddingEducation ? (
                renderAddEducationForm()
              ) : (
                <button onClick={() => setIsAddingEducation(true)} className="flex items-center px-4 py-2 bg-gray-800 text-purple-400 rounded-md hover:bg-gray-700 transition-colors mx-auto border border-gray-700 font-mono text-sm">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  educations.push(new Education())
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProfileSection
