"use client"

import React, { useState, useEffect, useCallback } from "react"
import ProjectCard from "@/components/ProjectCard"
import { fetchProjects } from "@/lib/api"
import { Project } from "@/types/project"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import PageTransition from "@/components/PageTransition"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isLoggedIn } = useAuth()

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchProjects()
      setProjects(data)
      setError(null)
    } catch (err) {
      console.error("Error loading projects:", err)
      setError("프로젝트를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  // 삭제 후 프로젝트 목록 갱신하는 함수
  const refreshProjects = useCallback(() => {
    loadProjects()
  }, [loadProjects])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <PageTransition>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2 text-dark">프로젝트</h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">제가 진행한 다양한 프로젝트들을 소개합니다. 각 프로젝트를 클릭하면 상세 내용을 확인할 수 있습니다.</p>
          </div>

          {isLoggedIn && (
            <div className="flex justify-end mb-8">
              <Link href="/projects/new" className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 shadow-md inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                새 프로젝트 추가
              </Link>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => loadProjects()} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300">
                새로고침
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">등록된 프로젝트가 없습니다.</p>
              {isLoggedIn && (
                <Link href="/projects/new" className="text-primary hover:text-blue-600 underline">
                  새 프로젝트 추가하기
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onDelete={refreshProjects} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
