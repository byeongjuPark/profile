'use client';

import React from 'react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-dark mb-6">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <Link
            href="/"
            className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-300 shadow-md inline-block"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageTransition>
  );
} 