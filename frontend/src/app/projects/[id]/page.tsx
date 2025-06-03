"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Project } from "@/types/project"
import { fetchProjectById } from "@/lib/api"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { getImageUrl } from "@/lib/utils"
import { DEFAULT_PROJECT_IMAGE } from "@/lib/constants"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 프로젝트 데이터 로드
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projectData = await fetchProjectById(id)
        setProject(projectData)
      } catch (err) {
        console.error('프로젝트를 불러오는 중 오류 발생:', err)
        setError('프로젝트를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  // 이미지 이동 처리
  const handleNextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const handlePrevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  // 이미지 배열 가져오기 (썸네일 + 추가 이미지들)
  const getAllImages = (project: Project | null) => {
    if (!project) return []
    
    const images = []
    
    // 썸네일이 있으면 첫 번째 이미지로 추가
    if (project.thumbnail) {
      images.push(project.thumbnail)
    }
    
    // 나머지 이미지들 추가 (썸네일과 중복되지 않는 이미지만)
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        // 이미 추가된 썸네일과 같은 이미지가 아닌 경우에만 추가
        if (img !== project.thumbnail) {
          images.push(img)
        }
      })
    }
    
    // 이미지가 하나도 없으면 기본 이미지 사용
    if (images.length === 0) {
      images.push(DEFAULT_PROJECT_IMAGE)
    }
    
    return images
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <span className="ml-3 font-mono text-cyan-400 animate-pulse">Loading Project...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="terminal-card max-w-md mx-auto my-12">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <span className="ml-2 font-mono text-xs text-gray-400">Error</span>
        </div>
        <div className="terminal-body">
          <p className="text-red-500 mb-4 font-mono">throw new Error(<span className="text-green-400">"{error}"</span>);</p>
          <Link href="/projects" className="text-cyan-400 hover:text-cyan-300 font-mono">
            return projects.getAll();
          </Link>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="terminal-card max-w-md mx-auto my-12">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red"></div>
          <div className="terminal-dot terminal-dot-yellow"></div>
          <div className="terminal-dot terminal-dot-green"></div>
          <span className="ml-2 font-mono text-xs text-gray-400">404</span>
        </div>
        <div className="terminal-body">
          <p className="text-gray-300 mb-4 font-mono">Project not found: <span className="text-red-400">null</span> reference exception</p>
          <Link href="/projects" className="text-cyan-400 hover:text-cyan-300 font-mono">
            return projects.getAll();
          </Link>
        </div>
      </div>
    )
  }

  const allImages = getAllImages(project)

  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="terminal-card mb-6 overflow-hidden">
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red"></div>
            <div className="terminal-dot terminal-dot-yellow"></div>
            <div className="terminal-dot terminal-dot-green"></div>
            <span className="ml-2 font-mono text-xs text-gray-400">project.view.js</span>
            <span className="ml-auto text-xs text-gray-500 font-mono">ID: {project.id}</span>
          </div>
          
          {/* 이미지 캐러셀 */}
          <div className="relative h-96 w-full bg-black border-b border-gray-700">
            {allImages.length > 0 && (
              <>
                <Image 
                  src={getImageUrl(allImages[currentImageIndex])} 
                  alt={project.title || project.name || "프로젝트"}
                  fill
                  style={{ objectFit: "contain" }}
                  className="bg-black opacity-90"
                />
                
                {/* 이미지 네비게이션 버튼 */}
                {allImages.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-cyan-300 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-cyan-300 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* 이미지 인디케이터 */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {allImages.map((_, index) => (
                        <span 
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-cyan-400' : 'bg-gray-600'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* 프로젝트 상세 정보 */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-mono font-bold text-cyan-400 flex items-center">
                <span className="text-green-400">class</span> {project.title || project.name || "Project"} 
                <span className="text-xs ml-3 bg-gray-800 px-2 py-1 rounded-sm text-gray-400 font-normal">v1.0.0</span>
              </h1>
              <div className="text-green-400 text-xs font-mono flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Running
              </div>
            </div>
            
            <div className="mb-6 bg-gray-800 p-4 rounded-md border-l-2 border-cyan-500">
              <p className="text-gray-300 whitespace-pre-line">
                <span className="text-purple-400">/**</span><br/>
                <span className="text-purple-400"> * {project.summary}</span><br/>
                <span className="text-purple-400"> */</span>
              </p>
            </div>
            
            <div className="mb-6">
              <h2 className="section-heading">
                Description
              </h2>
              <div className="bg-gray-800 p-4 rounded-md font-mono text-gray-300 whitespace-pre-line">
                {project.description}
              </div>
            </div>
            
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h2 className="section-heading">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2 bg-gray-800 p-4 rounded-md">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="code-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="section-heading">
                Timeline
              </h2>
              <div className="bg-gray-800 p-4 rounded-md font-mono">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <span className="text-gray-400 text-sm">Start:</span>
                    <p className="text-cyan-300">{formatDate(project.startDate)}</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-400 text-sm">End:</span>
                    <p className="text-cyan-300">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {project.troubleshooting && project.troubleshooting.length > 0 && (
              <div className="mt-8">
                <h2 className="section-heading">
                  Troubleshooting
                </h2>
                <div className="space-y-6">
                  {project.troubleshooting.map((item) => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded-md border-l-2 border-red-500">
                      <h3 className="text-lg font-mono font-medium mb-3 text-red-400">
                        <span className="text-gray-400">try {"{"}</span> {item.title} <span className="text-gray-400">{"}"} catch (e) {"{"}</span>
                      </h3>
                      <div className="flex flex-col md:flex-row gap-4">
                        {item.image && (
                          <div className="md:w-1/3">
                            <div className="relative h-48 w-full rounded-sm overflow-hidden border border-gray-700">
                              <Image 
                                src={getImageUrl(item.image)} 
                                alt={item.title} 
                                fill 
                                style={{ objectFit: "cover" }} 
                              />
                            </div>
                          </div>
                        )}
                        <div className={item.image ? "md:w-2/3" : "w-full"}>
                          <p className="text-gray-300 whitespace-pre-line">{item.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-right text-gray-400">{"}"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* 프로젝트 액션 버튼 */}
        <div className="font-mono flex justify-between text-sm">
          <Link 
            href="/projects"
            className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded-md transition-colors border border-gray-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            return projects.getAll();
          </Link>
          
          {isLoggedIn && (
            <Link 
              href={`/projects/${project.id}/edit`}
              className="bg-gray-800 hover:bg-gray-700 text-green-400 px-4 py-2 rounded-md transition-colors border border-gray-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              project.update();
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
