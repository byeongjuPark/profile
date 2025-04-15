'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProjectForm from '@/components/ProjectForm';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/PageTransition';
import Link from 'next/link';

export default function NewProjectPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // 로그인되지 않은 경우 프로젝트 목록 페이지로 리디렉션
    if (!isLoggedIn) {
      router.push('/projects');
    }
  }, [isLoggedIn, router]);

  // 로그인되지 않은 경우 빈 페이지 렌더링 (리디렉션 될 때까지)
  if (!isLoggedIn) {
    return null;
  }

  return (
    <PageTransition>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold mb-2 text-dark">새 프로젝트 추가</h1>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="flex justify-end mb-8">
            <Link 
              href="/projects" 
              className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 shadow-md inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              프로젝트 목록으로
            </Link>
          </div>
          
          <ProjectForm isEditing={false} />
        </div>
      </section>
    </PageTransition>
  );
} 