import React from "react"
import Link from "next/link"
import Image from "next/image"

const Intro: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-dark">내 포트폴리오</h1>
          <p className="text-lg text-gray-600 mb-8">안녕하세요! 이 포트폴리오는 제 소개와 프로젝트를 담고 있습니다.</p>
          <div className="flex justify-center items-center space-x-4">
            <Link href="/projects" className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300">
              프로젝트 목록
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-dark">프로필</h2>
            <p className="text-gray-700">프로필 정보를 기반으로 한 소개 내용이 들어갑니다.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-dark">기술 스택</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>React</li>
              <li>TypeScript</li>
              <li>Next.js</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-dark">프로젝트</h2>
          <p className="text-gray-700 mb-6">다양한 프로젝트를 진행해왔습니다. 자세한 내용은 프로젝트 목록에서 확인하실 수 있습니다.</p>
          <div className="text-center">
            <Link href="/projects" className="inline-block bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300">
              모든 프로젝트 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
