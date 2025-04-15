"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Project } from "@/types/project"
import { deleteProjectApi } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface ProjectCardProps {
  project: Project
  onDelete?: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 이미지 경로 변환 함수
  const getImageSrc = (imagePath: string | undefined) => {
    if (!imagePath) {
      return "/images/project-placeholder.jpg"
    }

    console.log("ProjectCard - Original image path:", imagePath)

    // 이미 완전한 URL인 경우
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // 백엔드 API 경로인 경우 (상대 경로)
    if (imagePath.startsWith("/api/images/")) {
      const fullUrl = `http://localhost:8080${imagePath}`
      console.log("ProjectCard - Converting API path to URL:", fullUrl)
      return fullUrl
    }

    // 파일명만 있는 경우 백엔드 API 경로로 변환
    if (!imagePath.startsWith("/images/")) {
      const fullUrl = `http://localhost:8080/api/images/${imagePath}`
      console.log("ProjectCard - Converting filename to URL:", fullUrl)
      return fullUrl
    }

    // 정적 이미지 (public 폴더)
    console.log("ProjectCard - Using static image path:", imagePath)
    return imagePath
  }

  // 삭제 이벤트가 카드 클릭으로 전파되는 것을 방지
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleting(true)
    setError(null)

    try {
      await deleteProjectApi(project.id)
      router.refresh() // 목록 페이지 새로고침
      setShowDeleteModal(false)

      // 삭제 완료 후 부모 컴포넌트에게 알림
      if (onDelete) {
        onDelete()
      }
    } catch (err) {
      setError("프로젝트 삭제 중 오류가 발생했습니다.")
      console.error("Error deleting project:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteModal(false)
    setError(null)
  }

  return (
    <>
      <Link href={`/projects/${project.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full">
          <div className="relative h-48 w-full">
            <Image src={getImageSrc(project.thumbnail)} alt={project.title} fill style={{ objectFit: "cover" }} />
            {isLoggedIn && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                aria-label="프로젝트 삭제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-dark mb-2">{project.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{project.summary}</p>
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md">+{project.technologies.length - 3}</span>}
            </div>
          </div>
        </div>
      </Link>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4 text-red-500">프로젝트 삭제</h3>
            <p className="mb-6 text-gray-700">
              <strong>{project.title}</strong> 프로젝트를 정말 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </p>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={handleCancelDelete} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100" disabled={isDeleting}>
                취소
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" disabled={isDeleting}>
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProjectCard
