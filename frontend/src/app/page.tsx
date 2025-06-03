"use client"

import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import ProfileHeader from "../components/ProfileHeader"
import ProfileSection from "../components/ProfileSection"
import SkillsSection from "../components/SkillsSection"
import SocialSection from "../components/SocialSection"
import { Profile, Career, Education, Skill, Social } from "../types/profile"
import {
  fetchProfile,
  updateProfileInfo,
  addCareer,
  updateCareer,
  deleteCareer,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addSocial,
  updateSocial,
  deleteSocial,
  createProfile,
} from "../lib/api"
import { useAuth } from "../context/AuthContext"

// 초기 프로필 데이터 - API 데이터가 없을 때 사용할 기본값
const DEFAULT_PROFILE: Profile = {
  id: "1",
  name: "홍길동",
  title: "웹 개발자",
  bio: "안녕하세요! 저는 웹 개발자입니다. React, TypeScript, Next.js 등을 활용하여 웹 애플리케이션을 개발합니다.",
  email: "example@email.com",
  phone: "010-1234-5678",
  image: "/images/portfolio.jpg",
  careers: [
    {
      id: "new",
      company: "ABC 테크놀로지",
      position: "프론트엔드 개발자",
      period: "2021년 3월 - 현재",
      description: "React와 TypeScript를 사용한 웹 애플리케이션 개발",
    },
  ],
  educations: [
    {
      id: "new",
      institution: "한국대학교",
      degree: "컴퓨터공학 학사",
      period: "2015년 3월 - 2019년 2월",
      description: "컴퓨터 과학, 알고리즘, 소프트웨어 공학을 전공했습니다.",
    },
  ],
  skills: [
    {
      id: "new",
      name: "React",
      level: 4,
      category: "Frontend",
    },
    {
      id: "new",
      name: "TypeScript",
      level: 4,
      category: "Frontend",
    },
    {
      id: "new",
      name: "Node.js",
      level: 3,
      category: "Backend",
    },
  ],
  socials: [
    {
      id: "new",
      platform: "GitHub",
      url: "https://github.com/",
      icon: "github",
    },
    {
      id: "new",
      platform: "LinkedIn",
      url: "https://linkedin.com/",
      icon: "linkedin",
    },
  ],
}

export default function Home() {
  const { isLoggedIn } = useAuth()

  const [profile, setProfile] = useState<Profile>({
    id: "1",
    name: "Loading...",
    title: "Loading...",
    bio: "Loading profile data...",
    email: "loading@example.com",
    phone: "Loading phone...",
    image: "/images/portfolio.jpg",
    careers: [],
    educations: [],
    skills: [],
    socials: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [noProfileData, setNoProfileData] = useState(false)

  // Load profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      setError(null)
      setNoProfileData(false)

      try {
        const profileData = await fetchProfile()

        // 프로필 데이터가 없거나 필수 필드가 없는 경우 기본 데이터 사용
        if (!profileData || !profileData.id || !profileData.name) {
          console.warn("No valid profile data returned from API, using default data")
          setProfile(DEFAULT_PROFILE)
          setNoProfileData(true)
        } else {
          setProfile(profileData)
        }
      } catch (err) {
        console.error("Error loading profile:", err)
        setError("프로필을 불러오는 중 오류가 발생했습니다. 기본 데이터를 표시합니다.")
        setProfile(DEFAULT_PROFILE)
        setNoProfileData(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Profile update handlers with API connections
  const handleUpdateProfileInfo = async (updatedInfo: Partial<Profile>) => {
    if (noProfileData) {
      // 데이터가 없는 경우, 새 프로필 생성
      setIsLoading(true)
      try {
        // DEFAULT_PROFILE을 기반으로 새 프로필 생성 (배열 데이터 제외)
        const newProfileData = {
          name: DEFAULT_PROFILE.name,
          title: DEFAULT_PROFILE.title,
          bio: DEFAULT_PROFILE.bio,
          email: DEFAULT_PROFILE.email,
          phone: DEFAULT_PROFILE.phone,
          address: DEFAULT_PROFILE.address,
          ...updatedInfo,
          // 명시적으로 ID를 1로 설정
          id: "1",
        }

        // 배열 데이터를 제외한 기본 프로필 먼저 생성
        const createdProfile = await createProfile(newProfileData)

        // 생성된 프로필에 DEFAULT_PROFILE의 배열 항목들 추가
        let updatedProfile = createdProfile

        // 캐리어 항목 추가
        if (DEFAULT_PROFILE.careers && DEFAULT_PROFILE.careers.length > 0) {
          for (const career of DEFAULT_PROFILE.careers) {
            const { id, ...careerData } = career
            try {
              updatedProfile = await addCareer(createdProfile.id, careerData)
            } catch (err) {
              console.error("Error adding default career:", err)
            }
          }
        }

        // 교육 항목 추가
        if (DEFAULT_PROFILE.educations && DEFAULT_PROFILE.educations.length > 0) {
          for (const education of DEFAULT_PROFILE.educations) {
            const { id, ...educationData } = education
            try {
              updatedProfile = await addEducation(createdProfile.id, educationData)
            } catch (err) {
              console.error("Error adding default education:", err)
            }
          }
        }

        // 스킬 항목 추가
        if (DEFAULT_PROFILE.skills && DEFAULT_PROFILE.skills.length > 0) {
          for (const skill of DEFAULT_PROFILE.skills) {
            const { id, ...skillData } = skill
            try {
              updatedProfile = await addSkill(createdProfile.id, skillData)
            } catch (err) {
              console.error("Error adding default skill:", err)
            }
          }
        }

        // 소셜 항목 추가
        if (DEFAULT_PROFILE.socials && DEFAULT_PROFILE.socials.length > 0) {
          for (const social of DEFAULT_PROFILE.socials) {
            const { id, ...socialData } = social
            try {
              updatedProfile = await addSocial(createdProfile.id, socialData)
            } catch (err) {
              console.error("Error adding default social:", err)
            }
          }
        }

        setProfile(updatedProfile)
        setNoProfileData(false)
        setError("프로필이 성공적으로 생성되었습니다.")
        setTimeout(() => {
          setError(null)
          // 페이지 새로고침
          window.location.reload()
        }, 1500) // 1.5초 후 새로고침
      } catch (err) {
        console.error("Error creating profile:", err)
        setError("프로필 생성 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await updateProfileInfo(profile.id, updatedInfo)
      setProfile(updatedProfile)
      setError("프로필이 성공적으로 업데이트되었습니다.")
      setTimeout(() => {
        setError(null)
        // 페이지 새로고침
        window.location.reload()
      }, 1500) // 1.5초 후 새로고침
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("프로필 정보 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // Career handlers
  const handleAddCareer = async (career: Career) => {
    if (noProfileData) {
      setError("프로필 데이터가 없어 경력을 추가할 수 없습니다. 관리자에게 문의하세요.")
      return
    }

    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await addCareer(profile.id, career)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error adding career:", err)
      setError("경력 추가 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCareer = async (updatedCareer: Career) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await updateCareer(profile.id, updatedCareer.id, updatedCareer)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error updating career:", err)
      setError("경력 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCareer = async (id: string) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await deleteCareer(profile.id, id)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error deleting career:", err)
      setError("경력 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // Education handlers
  const handleAddEducation = async (education: Education) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await addEducation(profile.id, education)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error adding education:", err)
      setError("교육 추가 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEducation = async (updatedEducation: Education) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await updateEducation(profile.id, updatedEducation.id, updatedEducation)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error updating education:", err)
      setError("교육 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await deleteEducation(profile.id, id)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error deleting education:", err)
      setError("교육 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // Skill handlers
  const handleAddSkill = async (skill: Skill) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await addSkill(profile.id, skill)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error adding skill:", err)
      setError("기술 추가 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSkill = async (updatedSkill: Skill) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await updateSkill(profile.id, updatedSkill.id, updatedSkill)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error updating skill:", err)
      setError("기술 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await deleteSkill(profile.id, id)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error deleting skill:", err)
      setError("기술 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // Social handlers
  const handleAddSocial = async (social: Social) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await addSocial(profile.id, social)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error adding social:", err)
      setError("소셜 미디어 추가 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSocial = async (updatedSocial: Social) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await updateSocial(profile.id, updatedSocial.id, updatedSocial)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error updating social:", err)
      setError("소셜 미디어 업데이트 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSocial = async (id: string) => {
    if (!profile.id) return

    setIsLoading(true)
    try {
      const updatedProfile = await deleteSocial(profile.id, id)
      setProfile(updatedProfile)
    } catch (err) {
      console.error("Error deleting social:", err)
      setError("소셜 미디어 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* 알림 메시지 */}
        {error && error.includes("성공") && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed top-20 right-4 left-4 md:left-auto z-50">
            <p>{error}</p>
            <button className="absolute top-0 right-0 p-2" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        {error && !error.includes("성공") && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed top-20 right-4 left-4 md:left-auto z-50">
            <p>{error}</p>
            <button className="absolute top-0 right-0 p-2" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        {noProfileData && isLoggedIn && !error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded fixed top-20 right-4 left-4 md:left-auto z-50 mt-16">
            <p>기본 프로필 데이터를 표시하고 있습니다. "Edit Profile" 버튼을 클릭하여 새 프로필을 생성하세요.</p>
            <button className="absolute top-0 right-0 p-2" onClick={() => setError(null)}>
              &times;
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && !error.includes("성공") ? (
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-lg mx-auto max-w-2xl mt-8">{error}</div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <ProfileHeader
              profile={{
                id: profile.id,
                name: profile.name,
                title: profile.title,
                bio: profile.bio,
                email: profile.email,
                phone: profile.phone,
                image: typeof profile.image === 'string' ? profile.image : undefined,
                location: profile.location,
                github: profile.socials?.find(s => s.platform.toLowerCase() === 'github')?.url,
                linkedin: profile.socials?.find(s => s.platform.toLowerCase() === 'linkedin')?.url,
                website: profile.socials?.find(s => s.platform.toLowerCase() === 'website')?.url,
                skills: profile.skills?.map(skill => skill.name) || []
              }}
              isLoggedIn={isLoggedIn}
              onProfileUpdate={handleUpdateProfileInfo}
              onSkillsUpdate={(skills) => {
                // 스킬 배열을 객체 배열로 변환
                const skillObjects = skills.map(name => ({
                  id: uuidv4(),
                  name,
                  level: 3, // 기본 레벨
                  category: "Frontend" // 기본 카테고리
                }));
                
                // 기존 스킬 삭제
                profile.skills.forEach(skill => {
                  handleDeleteSkill(skill.id);
                });
                
                // 새 스킬 추가
                skillObjects.forEach(skill => {
                  handleAddSkill(skill);
                });
              }}
            />

            <ProfileSection
              careers={profile.careers}
              educations={profile.educations}
              isLoggedIn={isLoggedIn}
              onAddCareer={handleAddCareer}
              onUpdateCareer={handleUpdateCareer}
              onDeleteCareer={handleDeleteCareer}
              onAddEducation={handleAddEducation}
              onUpdateEducation={handleUpdateEducation}
              onDeleteEducation={handleDeleteEducation}
            />

            <SkillsSection skills={profile.skills} isLoggedIn={isLoggedIn} onAdd={handleAddSkill} onUpdate={handleUpdateSkill} onDelete={handleDeleteSkill} />

            <SocialSection socials={profile.socials} isLoggedIn={isLoggedIn} onAdd={handleAddSocial} onUpdate={handleUpdateSocial} onDelete={handleDeleteSocial} />
          </div>
        )}
      </main>

      <footer className="py-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="text-2xl font-bold">{profile.title || "내 포트폴리오"}</div>
            {profile.title && profile.email && (
              <p className="text-gray-400 max-w-md mx-auto">
                {profile.name} | {profile.email}
              </p>
            )}
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} - 모든 권리 보유</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
