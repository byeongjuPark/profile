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
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <div className="terminal-header w-max mx-auto mb-2 px-8 rounded-full">
              <div className="terminal-dot terminal-dot-red"></div>
              <div className="terminal-dot terminal-dot-yellow"></div>
              <div className="terminal-dot terminal-dot-green"></div>
              <code className="ml-4 text-sm text-gray-400">cd ~/projects</code>
            </div>
            <h1 className="font-mono text-3xl font-bold mb-6 text-cyan-400">
              <span className="text-green-400">const</span> projects <span className="text-gray-400">=</span> <span className="text-purple-400">{"["}</span>
            </h1>
            <p className="text-gray-300 mx-auto font-light">
              // 백엔드 개발자로서 진행한 다양한 프로젝트 컬렉션입니다.
              <br />
              // 각 프로젝트를 선택하면 상세 정보를 확인할 수 있습니다.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {isLoggedIn && (
              <div className="flex justify-end mb-8">
                <Link href="/projects/new" className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-md transition duration-300 shadow-md inline-flex items-center font-mono">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs">new Project()</span>
                </Link>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                <span className="ml-3 font-mono text-cyan-400 animate-pulse">Loading...</span>
              </div>
            ) : error ? (
              <div className="terminal-card max-w-md mx-auto">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red"></div>
                  <div className="terminal-dot terminal-dot-yellow"></div>
                  <div className="terminal-dot terminal-dot-green"></div>
                  <span className="ml-2 font-mono text-xs text-gray-400">Error</span>
                </div>
                <div className="terminal-body">
                  <p className="text-red-500 mb-4 font-mono">throw new Error(<span className="text-green-400">"{error}"</span>);</p>
                  <button onClick={() => loadProjects()} className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded-md transition-colors font-mono text-sm border border-gray-700">
                    <span className="text-purple-400">async</span> reload();
                  </button>
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="terminal-card max-w-md mx-auto">
                <div className="terminal-header">
                  <div className="terminal-dot terminal-dot-red"></div>
                  <div className="terminal-dot terminal-dot-yellow"></div>
                  <div className="terminal-dot terminal-dot-green"></div>
                  <span className="ml-2 font-mono text-xs text-gray-400">projects.js</span>
                </div>
                <div className="terminal-body">
                  <p className="text-gray-300 mb-2 font-mono">{"projects.length === 0"} <span className="text-cyan-400">// true</span></p>
                  {isLoggedIn && (
                    <Link href="/projects/new" className="text-green-400 hover:text-green-500 font-mono underline">
                      projects.push(new Project());
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onDelete={refreshProjects} />
                  ))}
                </div>
                <div className="text-right mt-8">
                  <span className="text-purple-400 font-mono">{"]; // " + projects.length} 개의 프로젝트</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
