"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Project, TroubleShooting } from "@/types/project"
import { updateProjectApi, createProject } from "@/lib/api"
import Image from "next/image"

interface ProjectFormProps {
  initialData?: Project
  isEditing: boolean
}

const emptyProject: Project = {
  id: "new",
  title: "",
  summary: "",
  description: "",
  technologies: [],
  thumbnail: "",
  images: [],
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  troubleshooting: [],
}

const emptyTroubleshooting: TroubleShooting = {
  id: "new",
  title: "",
  description: "",
  image: "",
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, isEditing }) => {
  const router = useRouter()
  const [formData, setFormData] = useState<Project>(emptyProject)
  const [techInput, setTechInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 이미지 관련 state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null)
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 트러블 슈팅 관련 state
  const [currentTroubleshooting, setCurrentTroubleshooting] = useState<TroubleShooting>(emptyTroubleshooting)
  const [editingTroubleIndex, setEditingTroubleIndex] = useState<number | null>(null)
  const [showTroubleForm, setShowTroubleForm] = useState(false)
  const [troubleImageFile, setTroubleImageFile] = useState<File | null>(null)
  const [troubleImagePreview, setTroubleImagePreview] = useState<string>("")
  const troubleFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      // 기존 이미지 URL을 미리보기로 설정
      if (initialData.images && initialData.images.length > 0) {
        // 수정 모드일 때는 새 미리보기 배열을 만들고, 기존 파일은 초기화
        setSelectedFiles([]) // 기존 선택 파일 초기화
        setPreviewUrls(initialData.images)
        // 썸네일 인덱스 찾기
        const thumbIndex = initialData.images.findIndex((img) => img === initialData.thumbnail)
        setThumbnailIndex(thumbIndex >= 0 ? thumbIndex : 0)
      }
    } else {
      // 새 프로젝트의 경우
      setFormData(emptyProject)
      setSelectedFiles([])
      setPreviewUrls([])
      setThumbnailIndex(null)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }))
      setTechInput("")
    }
  }

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }))
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const newFiles = [...selectedFiles, ...files]
      setSelectedFiles(newFiles)

      // 미리보기 URL 생성
      const newPreviewUrls = [...previewUrls]
      files.forEach((file) => {
        const url = URL.createObjectURL(file)
        newPreviewUrls.push(url)
      })
      setPreviewUrls(newPreviewUrls)

      // 첫 번째 이미지가 추가되고 썸네일이 없으면 자동으로 썸네일로 설정
      if (thumbnailIndex === null && newPreviewUrls.length > 0) {
        setThumbnailIndex(0)
        setFormData((prev) => ({ ...prev, thumbnail: newPreviewUrls[0] }))
      }
      
      // 파일 입력 필드 초기화 (같은 파일 다시 선택할 수 있도록)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    // 삭제된 이미지 URL 추적 (파일이 아닌 URL인 경우만)
    const removedUrl = previewUrls[index];
    // 이미 업로드된 이미지인지 확인 (URL이 http나 /api로 시작하는 경우)
    if (removedUrl && 
        (removedUrl.startsWith('http') || 
         removedUrl.startsWith('/api'))) {
      setDeletedImages(prev => [...prev, removedUrl]);
      console.log(`이미지 ${removedUrl}가 삭제 목록에 추가됨`);
    }
    
    // 파일 및 미리보기 URL 제거
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)

    const newPreviewUrls = [...previewUrls]
    URL.revokeObjectURL(newPreviewUrls[index]) // 메모리 누수 방지
    newPreviewUrls.splice(index, 1)
    setPreviewUrls(newPreviewUrls)

    // 썸네일 관련 처리
    if (thumbnailIndex !== null) {
      if (index === thumbnailIndex) {
        // 삭제된 이미지가 썸네일이었을 경우
        if (newPreviewUrls.length > 0) {
          setThumbnailIndex(0)
          setFormData((prev) => ({ ...prev, thumbnail: newPreviewUrls[0] }))
        } else {
          setThumbnailIndex(null)
          setFormData((prev) => ({ ...prev, thumbnail: "" }))
        }
      } else if (index < thumbnailIndex) {
        // 썸네일 이전 이미지가 삭제된 경우, 인덱스 조정
        setThumbnailIndex(thumbnailIndex - 1)
      }
    }
  }

  const handleSetThumbnail = (index: number) => {
    if (index >= 0 && index < previewUrls.length) {
      setThumbnailIndex(index)
      setFormData((prev) => ({ ...prev, thumbnail: previewUrls[index] }))
    } else {
      console.error("Invalid thumbnail index:", index, "Preview URLs length:", previewUrls.length)
    }
  }

  // 트러블슈팅 이미지 처리
  const handleTroubleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setTroubleImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setTroubleImagePreview(previewUrl)
      setCurrentTroubleshooting((prev) => ({ ...prev, image: previewUrl }))
      
      // 파일 입력 필드 초기화 (같은 파일 다시 선택할 수 있도록)
      if (troubleFileInputRef.current) {
        troubleFileInputRef.current.value = ''
      }
    }
  }

  // 트러블 슈팅 핸들러
  const handleTroubleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentTroubleshooting((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTroubleshooting = () => {
    if (currentTroubleshooting.title && currentTroubleshooting.description) {
      const newTrouble: TroubleShooting = {
        ...currentTroubleshooting,
        id: editingTroubleIndex !== null ? currentTroubleshooting.id : `ts-${Date.now()}`,
        imageFile: troubleImageFile || undefined, // null인 경우 undefined로 변환
      }

      if (editingTroubleIndex !== null) {
        // 기존 트러블 슈팅 수정
        const updatedTroubles = [...formData.troubleshooting]
        updatedTroubles[editingTroubleIndex] = newTrouble

        setFormData((prev) => ({
          ...prev,
          troubleshooting: updatedTroubles,
        }))
        setEditingTroubleIndex(null)
      } else {
        // 새 트러블 슈팅 추가
        setFormData((prev) => ({
          ...prev,
          troubleshooting: [...prev.troubleshooting, newTrouble],
        }))
      }

      // 폼 초기화
      setCurrentTroubleshooting(emptyTroubleshooting)
      setShowTroubleForm(false)
      setTroubleImageFile(null)
      setTroubleImagePreview("")
    }
  }

  const handleEditTroubleshooting = (index: number) => {
    setCurrentTroubleshooting(formData.troubleshooting[index])
    setEditingTroubleIndex(index)
    setShowTroubleForm(true)
    setTroubleImagePreview(formData.troubleshooting[index].image || "")
  }

  const handleRemoveTroubleshooting = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      troubleshooting: prev.troubleshooting.filter((_, i) => i !== index),
    }))
  }

  const handleCancelTroubleForm = () => {
    setCurrentTroubleshooting(emptyTroubleshooting)
    setEditingTroubleIndex(null)
    setShowTroubleForm(false)
    setTroubleImageFile(null)
    setTroubleImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // FormData 객체 생성
      const formDataObj = new FormData()

      // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
      const today = new Date().toISOString().split("T")[0]

      // 필수 필드 기본값 설정
      const title = formData.title || "새 프로젝트" 
      const summary = formData.summary || `${title} 프로젝트`
      const description = formData.description || `${title}에 대한 상세 설명입니다.`

      // 모든 프로젝트 정보를 하나의 JSON 객체로 변환
      const projectData = {
        id: formData.id !== "new" ? formData.id : null,
        name: title,
        title: title,
        summary: summary,
        description: description,
        role: formData.role || "",
        github: formData.github || "",
        website: formData.website || "",
        startDate: formData.startDate || today,
        endDate: formData.endDate || today,
        technologies: formData.technologies || [],
        // 이미지 관련 필드는 비워두고 FormData로 별도 처리
        images: [], 
        thumbnail: "",
        troubleshooting: formData.troubleshooting.map((item) => {
          // imageFile 필드는 별도로 처리하므로 제외
          const { imageFile, ...rest } = item
          return {
            id: item.id !== "new" ? item.id : null,
            title: item.title || "문제 해결",
            description: item.description || "문제 해결 방법에 대한 설명입니다.",
            image: "", // 이미지는 별도로 처리
          }
        }),
      }

      // JSON 문자열로 변환한 후 project 키에 추가
      const projectJson = JSON.stringify(projectData)
      formDataObj.append("project", projectJson)

      // 콘솔에 projectJson 출력하여 디버깅
      console.log("Project JSON:", projectJson)

      // 썸네일 인덱스 추가
      if (thumbnailIndex !== null && thumbnailIndex !== undefined) {
        formDataObj.append("thumbnailIndex", thumbnailIndex.toString())
      }

      // 이미지 파일 추가 (새로 추가된 파일만)
      if (selectedFiles.length > 0) {
        console.log("Adding image files:", selectedFiles.length)
        selectedFiles.forEach((file, index) => {
          console.log(`Adding image file ${index}: ${file.name} (${file.size} bytes)`)
          formDataObj.append("images", file)
        })
      }

      // 삭제된 이미지 URL 추가
      if (deletedImages.length > 0) {
        console.log("Adding deleted image URLs:", deletedImages)
        // 삭제된 이미지 목록을 JSON 문자열로 변환하여 전송
        formDataObj.append("deletedImages", JSON.stringify(deletedImages))
      }

      // 이미지가 없는데 썸네일 인덱스가 있으면 오류 방지
      if (previewUrls.length === 0 && thumbnailIndex !== null) {
        console.log("Warning: No images but thumbnail index is set. Resetting thumbnail index.")
      }

      // 트러블슈팅 이미지 처리
      const troubleImageIndices: string[] = []
      formData.troubleshooting.forEach((item, index) => {
        if (item.imageFile) {
          console.log(`Adding troubleshooting image for index ${index}: ${item.imageFile.name}`)
          formDataObj.append("troubleshootingImages", item.imageFile)
          troubleImageIndices.push(index.toString())
        }
      })

      // 트러블슈팅 이미지 인덱스를 한 번에 추가
      if (troubleImageIndices.length > 0) {
        console.log("Adding troubleshooting image indices:", troubleImageIndices)
        troubleImageIndices.forEach((index) => {
          formDataObj.append("troubleshootingImageIndices", index)
        })
      }

      // FormData 내용 로깅
      console.log("FormData 내용:")
      formDataObj.forEach((value, key) => {
        if ((value as any) instanceof File) {
          console.log(`${key}: File - ${(value as File).name} (${(value as File).size} bytes)`)
        } else if ((value as any) instanceof Blob) {
          console.log(`${key}: Blob - ${(value as Blob).size} bytes, type: ${(value as Blob).type}`)
        } else {
          console.log(`${key}: ${value}`)
        }
      })

      let result
      if (isEditing && formData.id !== "new") {
        // 기존 프로젝트 업데이트
        console.log("프로젝트 업데이트:", formData.id)
        result = await updateProjectApi(formData.id, formDataObj)
      } else {
        // 새 프로젝트 생성
        console.log("새 프로젝트 생성")
        result = await createProject(formDataObj)
      }

      // 성공 시 상세 페이지나 목록으로 이동
      if (result) {
        console.log("프로젝트 저장 성공:", result)
        router.push(isEditing ? `/projects/${formData.id}` : "/projects")
      }
    } catch (err) {
      console.error("프로젝트 폼 제출 오류:", err)
      setError(`프로젝트 저장 중 오류가 발생했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            프로젝트 제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="summary" className="block text-gray-700 font-medium mb-2">
            요약
          </label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-sm text-gray-500 mt-1">단락을 구분하려면 빈 줄을 두 번 사용하세요.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
              시작일
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
              종료일
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">사용 기술</label>
          <div className="flex">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="기술 이름 (예: React)"
            />
            <button type="button" onClick={handleAddTech} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-r-md">
              추가
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <span className="mr-2">{tech}</span>
                <button type="button" onClick={() => handleRemoveTech(index)} className="text-red-500 hover:text-red-700">
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">이미지</label>
          <div className="mb-4">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" multiple />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              이미지 파일 선택
            </button>
            <span className="ml-2 text-sm text-gray-500">{selectedFiles.length > 0 ? `${selectedFiles.length}개의 이미지가 선택됨` : "프로젝트 이미지를 선택하세요"}</span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewUrls.map((previewUrl, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded-md">
                <div className="relative h-40 w-full mb-2 rounded overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt={`프로젝트 이미지 ${index + 1}`} className="object-cover w-full h-full" />
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(index)}
                    className={`px-2 py-1 rounded text-sm ${index === thumbnailIndex ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                  >
                    {index === thumbnailIndex ? "대표 이미지" : "대표 이미지로 설정"}
                  </button>
                  <button type="button" onClick={() => handleRemoveImage(index)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 트러블 슈팅 섹션 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-gray-700 font-medium">트러블 슈팅</label>
            {!showTroubleForm && (
              <button type="button" onClick={() => setShowTroubleForm(true)} className="bg-secondary hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                추가하기
              </button>
            )}
          </div>

          {/* 트러블 슈팅 목록 */}
          {formData.troubleshooting.length > 0 ? (
            <div className="space-y-4 mb-6">
              {formData.troubleshooting.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => handleEditTroubleshooting(index)} className="text-primary hover:text-blue-700 text-sm">
                        수정
                      </button>
                      <button type="button" onClick={() => handleRemoveTroubleshooting(index)} className="text-red-500 hover:text-red-700 text-sm">
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}</p>
                  {item.image && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded overflow-hidden mr-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-gray-500 truncate max-w-xs">{item.image}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">트러블 슈팅 항목이 없습니다. 추가 버튼을 클릭하여 새로운 항목을 추가하세요.</p>
          )}

          {/* 트러블 슈팅 입력 폼 */}
          {showTroubleForm && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <label htmlFor="troubleTitle" className="block text-gray-700 font-medium mb-2">
                  제목
                </label>
                <input
                  type="text"
                  id="troubleTitle"
                  name="title"
                  value={currentTroubleshooting.title}
                  onChange={handleTroubleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="문제 제목"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="troubleDescription" className="block text-gray-700 font-medium mb-2">
                  설명
                </label>
                <textarea
                  id="troubleDescription"
                  name="description"
                  value={currentTroubleshooting.description}
                  onChange={handleTroubleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="문제 상황과 해결 방법을 설명해주세요"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="troubleImage" className="block text-gray-700 font-medium mb-2">
                  이미지 (선택사항)
                </label>
                <input
                  type="file"
                  id="troubleImage"
                  accept="image/*"
                  onChange={handleTroubleImageUpload}
                  ref={troubleFileInputRef}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {troubleImagePreview && (
                  <div className="mt-2">
                    <div className="w-full h-32 rounded overflow-hidden bg-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={troubleImagePreview} alt="트러블슈팅 이미지 미리보기" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCancelTroubleForm} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                  취소
                </button>
                <button type="button" onClick={handleAddTroubleshooting} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600">
                  {editingTroubleIndex !== null ? "수정 완료" : "추가하기"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button type="button" onClick={() => router.push("/projects")} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md transition duration-300">
            취소
          </button>

          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            className={`bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-md transition duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : isEditing ? "수정하기" : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
