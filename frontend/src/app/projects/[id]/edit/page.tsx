"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProjectForm from "@/components/ProjectForm"
import { fetchProjectById } from "@/lib/api"
import { Project } from "@/types/project"
import { notFound } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import PageTransition from "@/components/PageTransition"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 로그인되지 않은 경우 프로젝트 목록 페이지로 리디렉션
    if (!isLoggedIn) {
      router.push("/projects")
      return
    }

    const loadProject = async () => {
      try {
        setLoading(true)
        const data = await fetchProjectById(params.id)
        setProject(data)
        setError(null)
      } catch (err) {
        console.error(`Error loading project ${params.id}:`, err)
        setError("프로젝트를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [isLoggedIn, router, params.id])

  // 로그인되지 않은 경우 빈 페이지 렌더링 (리디렉션 될 때까지)
  if (!isLoggedIn) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex space-x-4">
          <button onClick={() => router.push("/projects")} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300">
            프로젝트 목록으로
          </button>
          <button onClick={() => window.location.reload()} className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300">
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-dark mb-8">프로젝트 수정</h1>
        <ProjectForm initialData={project} isEditing />
      </div>
    </PageTransition>
  )
}
