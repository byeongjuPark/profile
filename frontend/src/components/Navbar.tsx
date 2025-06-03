"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { usePathname } from "next/navigation"
import LoginModal from "@/components/LoginModal"

const Navbar = () => {
  const { isLoggedIn, logout, showLoginModal, setShowLoginModal } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // 스크롤 시 네비게이션 바 스타일 변경
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout()
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-30 transition-all duration-300 ${
          scrolled ? "bg-gray-900 shadow-lg py-2" : "bg-gray-900 bg-opacity-80 backdrop-blur-md py-3"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="font-mono font-bold text-xl text-cyan-400 flex items-center">
                <span className="text-green-400 text-sm">&lt;</span>
                <span>ParkDev</span>
                <span className="text-green-400 text-sm">/&gt;</span>
              </div>
            </Link>

            {/* 데스크탑 메뉴 */}
            <div className="hidden md:flex space-x-1">
              <NavLink href="/" isActive={pathname === "/"}>
                <span className="text-green-400">~/</span>home
              </NavLink>
              <NavLink href="/projects" isActive={pathname === "/projects" || pathname.startsWith("/projects/")}>
                <span className="text-green-400">~/</span>projects
              </NavLink>
              <button 
                onClick={handleAuthClick} 
                className="font-mono text-sm px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors flex items-center"
              >
                {isLoggedIn ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-400">sudo</span> logout
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    <span className="text-purple-400">sudo</span> login
                  </>
                )}
              </button>
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button 
              className="md:hidden text-gray-300 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 모바일 메뉴 */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMenuOpen ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-3 py-2 font-mono text-sm">
              <NavLink href="/" isActive={pathname === "/"} onClick={() => setIsMenuOpen(false)}>
                <span className="text-green-400">~/</span>home
              </NavLink>
              <NavLink href="/projects" isActive={pathname === "/projects" || pathname.startsWith("/projects/")} onClick={() => setIsMenuOpen(false)}>
                <span className="text-green-400">~/</span>projects
              </NavLink>
              <button 
                onClick={() => {
                  handleAuthClick()
                  setIsMenuOpen(false)
                }} 
                className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors flex items-center"
              >
                {isLoggedIn ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-400">sudo</span> logout
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                    <span className="text-purple-400">sudo</span> login
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}

const NavLink = ({ 
  href, 
  children, 
  isActive,
  onClick
}: { 
  href: string
  children: React.ReactNode
  isActive: boolean
  onClick?: () => void
}) => {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`font-mono text-sm px-3 py-2 rounded-md transition-colors ${
        isActive 
          ? "bg-gray-800 text-cyan-400" 
          : "text-gray-300 hover:bg-gray-800 hover:text-cyan-400"
      }`}
    >
      {children}
    </Link>
  )
}

export default Navbar
