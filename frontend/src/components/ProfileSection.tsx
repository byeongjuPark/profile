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

    if (editingCareer) {
      onUpdateCareer({
        id: editingCareer.id,
        ...careerForm,
      })
      setEditingCareer(null)
    } else {
      onAddCareer({
        id: "new",
        ...careerForm,
      } as Career)
    }

    resetCareerForm()
  }

  const handleEducationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingEducation) {
      onUpdateEducation({
        id: editingEducation.id,
        ...educationForm,
      })
      setEditingEducation(null)
    } else {
      onAddEducation({
        id: "new",
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
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{editingCareer ? "Edit Career" : "Add Career"}</h3>
        <form onSubmit={handleCareerSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{titleLabel}</label>
              <input type="text" name="company" value={careerForm.company} onChange={handleCareerInputChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{subtitleLabel}</label>
              <input type="text" name="position" value={careerForm.position} onChange={handleCareerInputChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{periodLabel}</label>
              <input type="text" name="period" value={careerForm.period} onChange={handleCareerInputChange} className="w-full p-2 border rounded-md" placeholder="2020 - 2023" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{descriptionLabel}</label>
              <textarea name="description" value={careerForm.description} onChange={handleCareerInputChange} className="w-full p-2 border rounded-md" rows={3} />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {editingCareer && (
              <button type="button" onClick={resetCareerForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingCareer ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  const renderAddEducationForm = () => {
    const { titleLabel, subtitleLabel, periodLabel, descriptionLabel } = generateFieldLabels("education")

    return (
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{editingEducation ? "Edit Education" : "Add Education"}</h3>
        <form onSubmit={handleEducationSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{titleLabel}</label>
              <input type="text" name="institution" value={educationForm.institution} onChange={handleEducationInputChange} className="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{subtitleLabel}</label>
              <input type="text" name="degree" value={educationForm.degree} onChange={handleEducationInputChange} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{periodLabel}</label>
              <input type="text" name="period" value={educationForm.period} onChange={handleEducationInputChange} className="w-full p-2 border rounded-md" placeholder="2018 - 2022" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{descriptionLabel}</label>
              <textarea name="description" value={educationForm.description} onChange={handleEducationInputChange} className="w-full p-2 border rounded-md" rows={3} />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            {editingEducation && (
              <button type="button" onClick={resetEducationForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            )}
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              {editingEducation ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Career</h2>

          <div className="space-y-6">
            {careers.map((career) => (
              <div key={career.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{career.company}</h3>
                    <p className="text-gray-600">{career.position}</p>
                    <p className="text-sm text-gray-500 mt-1">{career.period}</p>
                  </div>

                  {isLoggedIn && (
                    <div className="flex space-x-2">
                      <button onClick={() => startEditingCareer(career)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button onClick={() => onDeleteCareer(career.id)} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
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

                <p className="mt-4 text-gray-700">{career.description}</p>
              </div>
            ))}
          </div>

          {isLoggedIn && (
            <div className="mt-6">
              {isAddingCareer ? (
                renderAddCareerForm()
              ) : (
                <button onClick={() => setIsAddingCareer(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Career
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Education</h2>

          <div className="space-y-6">
            {educations.map((education) => (
              <div key={education.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{education.institution}</h3>
                    {education.degree && <p className="text-gray-600">{education.degree}</p>}
                    <p className="text-sm text-gray-500 mt-1">{education.period}</p>
                  </div>

                  {isLoggedIn && (
                    <div className="flex space-x-2">
                      <button onClick={() => startEditingEducation(education)} className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button onClick={() => onDeleteEducation(education.id)} className="p-1 text-gray-500 hover:text-red-600 transition-colors">
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

                {education.description && <p className="mt-4 text-gray-700">{education.description}</p>}
              </div>
            ))}
          </div>

          {isLoggedIn && (
            <div className="mt-6">
              {isAddingEducation ? (
                renderAddEducationForm()
              ) : (
                <button onClick={() => setIsAddingEducation(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Education
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
