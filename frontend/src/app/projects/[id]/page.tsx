"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, notFound } from "next/navigation"
import { fetchProjectById } from "@/lib/api"
import { Project } from "@/types/project"
import DeleteProjectButton from "@/components/DeleteProjectButton"
import { useAuth } from "@/context/AuthContext"
import PageTransition from "@/components/PageTransition"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  // 이미지 캐러셀 관련 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 이미지 이동 함수
  const goToNextImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const goToPrevImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  useEffect(() => {
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
  }, [params.id])

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

  // 설명 텍스트를 줄바꿈 유지하며 렌더링
  const descriptionParagraphs = project.description ? project.description.split("\n\n") : []

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 이미지 경로 변환 함수 추가
  const getImageSrc = (imagePath: string | undefined) => {
    if (!imagePath) {
      console.log("Image path is empty or undefined, using placeholder")
      return "/images/project-placeholder.jpg"
    }

    console.log("Project detail - Processing image path:", imagePath)

    // 이미 완전한 URL인 경우
    if (imagePath.startsWith("http")) {
      console.log("Project detail - Already complete URL:", imagePath)
      return imagePath
    }

    // 백엔드 API 경로인 경우 (상대 경로)
    if (imagePath.startsWith("/api/images/")) {
      const fullUrl = `http://localhost:8080${imagePath}`
      console.log("Project detail - Converting API path to URL:", fullUrl)
      return fullUrl
    }

    // 파일명만 있는 경우 백엔드 API 경로로 변환 (대부분의 트러블슈팅 이미지가 이 경우)
    if (!imagePath.startsWith("/images/")) {
      const fullUrl = `http://localhost:8080/api/images/${imagePath}`
      console.log("Project detail - Converting filename to URL:", fullUrl)
      return fullUrl
    }

    // 정적 이미지 (public 폴더)
    console.log("Project detail - Using static image path:", imagePath)
    return imagePath
  }

  return (
    <PageTransition>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2 text-dark">{project.title}</h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <Link href={`/projects/${project.id}/edit`} className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 shadow-md inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    수정하기
                  </Link>
                  <DeleteProjectButton projectId={project.id} />
                </>
              )}
              <Link href="/projects" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 shadow-md inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                프로젝트 목록으로
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            {/* 프로젝트 이미지 캐러셀 */}
            {project.images && project.images.length > 0 ? (
              <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-lg">
                <Image
                  src={getImageSrc(project.images[currentImageIndex])}
                  alt={`${project.title} 이미지 ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 90vw"
                  style={{ objectFit: "cover" }}
                />

                {/* 이미지 인덱스 표시 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {project.images.length}
                </div>

                {/* 이미지 이동 버튼 */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      aria-label="이전 이미지"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      aria-label="다음 이미지"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">이미지가 없습니다</p>
              </div>
            )}

            {/* 썸네일 목록 */}
            {project.images && project.images.length > 1 && (
              <div className="mb-8 flex space-x-2 overflow-x-auto pb-2">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-20 h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden 
                      ${currentImageIndex === index ? "ring-2 ring-primary" : "opacity-70"}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image src={getImageSrc(image)} alt={`${project.title} 썸네일 ${index + 1}`} fill sizes="80px" style={{ objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* 프로젝트 정보 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-dark">프로젝트 정보</h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 text-dark">개요</h3>
                  <p className="text-gray-700 mb-4">{project.summary}</p>

                  <h3 className="text-lg font-medium mb-2 text-dark">사용 기술</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium mb-2 text-dark">프로젝트 기간</h3>
                  <p className="text-gray-700">
                    {formatDate(project.startDate)} ~ {formatDate(project.endDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* 프로젝트 설명 섹션 */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-dark">프로젝트 설명</h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <div className="prose max-w-none text-gray-700">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* 트러블 슈팅 섹션 */}
            {project.troubleshooting && project.troubleshooting.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-dark">트러블 슈팅</h2>
                <div className="w-16 h-1 bg-primary mb-6"></div>
                <div className="space-y-8">
                  {project.troubleshooting.map((item) => {
                    console.log("트러블슈팅 항목:", item.id, "이미지 경로:", item.image)
                    return (
                      <div key={item.id} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-xl font-medium mb-4 text-dark">{item.title}</h3>

                        <div className="flex flex-col md:flex-row gap-6">
                          {item.image && item.image.trim() !== "" && (
                            <div className="md:w-1/3">
                              <div className="relative h-60 w-full rounded-lg overflow-hidden">
                                <Image src={getImageSrc(item.image)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                              </div>
                            </div>
                          )}

                          <div className={item.image && item.image.trim() !== "" ? "md:w-2/3" : "w-full"}>
                            <p className="text-gray-700">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
