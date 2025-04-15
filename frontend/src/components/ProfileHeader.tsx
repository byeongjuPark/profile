"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface ProfileHeaderProps {
  name: string
  title: string
  bio: string
  email: string
  image?: string | File
  isLoggedIn: boolean
  onUpdate: (data: { name?: string; title?: string; bio?: string; email?: string; image?: string | File }) => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, title, bio, email, image = "/images/portfolio.jpg", isLoggedIn, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name,
    title,
    bio,
    email,
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [updatedImageUrl, setUpdatedImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 프로필 데이터가 변경될 때 폼 데이터 업데이트
  useEffect(() => {
    setFormData({
      name,
      title,
      bio,
      email,
    })
  }, [name, title, bio, email])

  // 편집 모드로 진입할 때 데이터 초기화
  useEffect(() => {
    if (isEditing) {
      setFormData({
        name,
        title,
        bio,
        email,
      })
      setSelectedImage(null)
      setPreviewUrl("")
      setUpdatedImageUrl(null)
    }
  }, [isEditing, name, title, bio, email])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  // Generate preview URL when selected image changes
  useEffect(() => {
    // Clean up previous preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (!selectedImage) {
      setPreviewUrl("")
      return
    }

    const objectUrl = URL.createObjectURL(selectedImage)
    setPreviewUrl(objectUrl)

    // Clean up when component unmounts
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [selectedImage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 이미지는 이미 자동으로 업로드되었으므로 나머지 데이터만 업데이트
    onUpdate({
      ...formData,
      // 새로 업로드된 이미지 URL이 있으면 그것을 사용하고, 아니면 기존 이미지 유지
      image: updatedImageUrl || image,
    })
    setIsEditing(false)
    setSelectedImage(null)
    setPreviewUrl("")
    setUpdatedImageUrl(null)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const file = e.target.files[0]
    setSelectedImage(file)

    // 이미지 즉시 업로드
    try {
      setIsImageUploading(true)
      console.log("이미지 업로드 시작:", file.name)

      // 프로필 ID 확인 - 실제 구현에서는 현재 프로필 ID를 사용해야 함
      // 현재 예제에서는 "1"로 하드코딩
      const profileId = "1"

      // FormData 생성
      const formData = new FormData()
      formData.append("imageFile", file)

      // 기존 프로필 데이터 추가 (이름, 제목 등)
      formData.append("name", name)
      formData.append("title", title)
      if (bio) formData.append("bio", bio)
      if (email) formData.append("email", email)

      // 백엔드 서버 URL
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

      // API 요청
      const response = await fetch(`${backendUrl}/api/profiles/${profileId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`이미지 업로드 실패: ${response.status}`)
      }

      const result = await response.json()
      console.log("이미지 업로드 성공:", result)

      // 업로드된 이미지 URL 저장 (백엔드 URL 포함하여 저장)
      if (result.image) {
        // 이미지 경로가 상대 경로인 경우 절대 URL로 변환
        if (result.image.startsWith("/api/")) {
          setUpdatedImageUrl(`${backendUrl}${result.image}`)
        } else {
          setUpdatedImageUrl(result.image)
        }
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error)
      alert("이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setIsImageUploading(false)
    }
  }

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current && !isImageUploading) {
      fileInputRef.current.click()
    }
  }

  // Format image path for API
  const getImageSrc = (imagePath: string) => {
    if (!imagePath) {
      console.warn("빈 이미지 경로가 제공되었습니다. 기본 이미지를 사용합니다.")
      return "/images/portfolio.jpg"
    }

    console.log("ProfileHeader - Original image path:", imagePath)

    // 이미 완전한 URL인 경우
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // 백엔드 API 경로인 경우 (상대 경로)
    if (imagePath.startsWith("/api/images/")) {
      // 백엔드 서버 URL로 변환 (항상 8080 포트 사용)
      const fullUrl = `http://localhost:8080${imagePath}`
      console.log("ProfileHeader - Converting API path to URL:", fullUrl)
      return fullUrl
    }

    // 파일명만 있는 경우 백엔드 API 경로로 변환
    if (!imagePath.startsWith("/images/")) {
      const fullUrl = `http://localhost:8080/api/images/${imagePath}`
      console.log("ProfileHeader - Converting filename to URL:", fullUrl)
      return fullUrl
    }

    // 정적 이미지 (public 폴더)
    console.log("ProfileHeader - Using static image path:", imagePath)
    return imagePath
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-800 py-10 relative h-auto min-h-[24rem]">
      <div className="container mx-auto px-4 md:px-0 flex flex-col md:flex-row gap-8 items-start h-full py-6">
        <div className="md:sticky md:top-6 flex flex-col items-center">
          <div
            className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg ${isEditing ? "cursor-pointer hover:opacity-80" : ""}`}
            onClick={handleImageClick}
          >
            {/* Show preview if available */}
            {previewUrl && <Image src={previewUrl} alt="미리보기" fill className="object-cover" />}
            {/* Show existing image if no preview */}
            {!previewUrl && typeof image === "string" && <Image src={getImageSrc(image)} alt={name} fill className="object-cover" priority />}
            {isEditing && <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-medium">{isImageUploading ? "업로드 중..." : "이미지 변경"}</div>}
          </div>
          {isEditing && <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1 w-full md:max-w-xl bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/20">프로필 수정</h2>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-md shadow-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-white text-sm font-medium mb-2">
                  직함
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-md shadow-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-md shadow-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-white text-sm font-medium mb-2">
                  자기소개
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/90 border border-white/20 rounded-md shadow-sm text-gray-800 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                  disabled={isImageUploading}
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-transparent border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition"
                  disabled={isImageUploading}
                >
                  취소
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex-1 text-white md:text-left text-center">
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="text-xl mt-1 text-white/90">{title}</p>
            <p className="mt-4 text-sm md:text-base leading-relaxed max-w-2xl text-white/80">{bio}</p>
            <p className="mt-2 text-sm text-white/70">{email}</p>

            {isLoggedIn && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-md font-medium transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                프로필 편집
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileHeader
