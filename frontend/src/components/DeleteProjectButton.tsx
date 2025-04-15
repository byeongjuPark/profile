"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProjectApi } from "@/lib/api"

interface DeleteProjectButtonProps {
  projectId: string
}

const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({ projectId }) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      // 프로젝트 삭제
      await deleteProjectApi(projectId)
      // 프로젝트 목록 페이지로 이동
      router.push("/projects")
      router.refresh()
    } catch (err) {
      console.error("프로젝트 삭제 중 오류 발생:", err)
      setError("프로젝트 삭제 중 오류가 발생했습니다.")
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300" disabled={isDeleting}>
        {isDeleting ? "삭제 중..." : "삭제하기"}
      </button>

      {/* 삭제 확인 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-500">프로젝트 삭제</h3>
            <p className="mb-6 text-gray-700">이 프로젝트를 정말 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.</p>
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setError(null)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={isDeleting}
              >
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

export default DeleteProjectButton
