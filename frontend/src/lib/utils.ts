import { API_URL } from "./constants";

/**
 * 이미지 경로를 완전한 URL로 변환하는 유틸리티 함수
 */
export const getImageUrl = (imagePath: string | undefined): string => {
  // 이미지 경로가 없으면 기본 이미지 반환
  if (!imagePath || imagePath === "") {
    return "/images/project-placeholder.jpg";
  }

  // 이미 완전한 URL인 경우 그대로 반환
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // 정적 이미지 (public 폴더 내 이미지)인 경우 그대로 반환
  if (imagePath.startsWith("/images/")) {
    return imagePath;
  }

  // 백엔드 API 경로 (/api/images/로 시작하는 경우)
  if (imagePath.startsWith("/api/images/")) {
    return `${API_URL}${imagePath}`;
  }

  // 파일명만 있는 경우 백엔드 API 경로로 변환
  return `${API_URL}/api/images/${imagePath}`;
};

/**
 * 첫 글자를 대문자로 변환
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
} 