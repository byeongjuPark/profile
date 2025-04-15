"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import LoginModal from "./LoginModal"

const Navbar: React.FC = () => {
  const pathname = usePathname()
  const { isLoggedIn, logout } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-dark">포트폴리오</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                홈
              </Link>
              <Link href="/projects" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/projects") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                프로젝트
              </Link>

              {isLoggedIn ? (
                <button onClick={logout} className="ml-4 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition duration-300">
                  로그아웃
                </button>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="ml-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition duration-300">
                  관리자 로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}

export default Navbar
