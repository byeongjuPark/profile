"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Project } from "@/types/project"
import { deleteProjectApi } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { getImageUrl } from "@/lib/utils"
import { DEFAULT_PROJECT_IMAGE } from "@/lib/constants"

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
        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden transition-transform duration-300 hover:shadow-cyan-900/30 hover:-translate-y-1 cursor-pointer h-full">
          <div className="relative h-48 w-full bg-black">
            <Image 
              src={getImageUrl(project.thumbnail)} 
              alt={project.title || project.name || "프로젝트"} 
              fill 
              style={{ objectFit: "cover", opacity: "0.85" }} 
            />
            <div className="absolute top-2 left-2 bg-green-500 px-2 py-1 rounded-sm text-xs font-mono text-black">
              {project.technologies[0] || "Project"}
            </div>
            {isLoggedIn && (
              <button
                onClick={handleDeleteClick}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
                aria-label="프로젝트 삭제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-mono font-bold text-cyan-400 truncate">{project.title || project.name || "프로젝트"}</h3>
              <span className="text-gray-400 text-xs font-mono">v1.0.0</span>
            </div>
            <p className="text-gray-300 mb-4 line-clamp-2 font-light">{project.summary}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span key={index} className="bg-gray-800 text-cyan-300 text-xs px-2 py-1 rounded-sm font-mono border-l-2 border-cyan-500">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-sm font-mono">+{project.technologies.length - 3}</span>}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
              <div className="text-gray-400 text-xs font-mono flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Active
              </div>
              <div className="text-gray-400 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                View Details
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-mono font-bold mb-4 text-red-500">프로젝트 삭제</h3>
            <p className="mb-6 text-gray-300 font-mono">
              <strong>{project.title || project.name || "프로젝트"}</strong> 프로젝트를 정말 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </p>
            {error && <p className="mb-4 text-red-500 font-mono">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={handleCancelDelete} className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 font-mono" disabled={isDeleting}>
                취소
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-mono" disabled={isDeleting}>
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
