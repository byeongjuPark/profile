import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Profile, Career, Education } from '@/types/profile';

// 데이터 파일 경로
const dataFilePath = path.join(process.cwd(), 'data', 'profile.json');

// 프로필 데이터 읽기
function readProfileData(): Profile {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('프로필 데이터 읽기 오류:', error);
    throw new Error('프로필 데이터를 불러올 수 없습니다.');
  }
}

// 프로필 데이터 쓰기
function writeProfileData(data: Profile): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('프로필 데이터 쓰기 오류:', error);
    throw new Error('프로필 데이터를 저장할 수 없습니다.');
  }
}

// GET 요청 처리 - 프로필 데이터 반환
export async function GET() {
  try {
    const profileData = readProfileData();
    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json(
      { error: '프로필 데이터를 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 프로필 데이터 업데이트
export async function POST(request: Request) {
  try {
    const { type, action, data } = await request.json();
    
    // 현재 프로필 데이터 읽기
    const profileData = readProfileData();
    
    // 요청 타입에 따라 처리
    if (type === 'career') {
      // 경력 정보 처리
      if (action === 'add') {
        const newCareer = {
          ...data,
          id: `career-${Date.now()}`
        };
        profileData.careers.push(newCareer);
      } else if (action === 'update' && data.id) {
        profileData.careers = profileData.careers.map(career =>
          career.id === data.id ? data : career
        );
      } else if (action === 'delete' && data.id) {
        profileData.careers = profileData.careers.filter(career => 
          career.id !== data.id
        );
      }
    } else if (type === 'education') {
      // 교육 정보 처리
      if (action === 'add') {
        const newEducation = {
          ...data,
          id: `edu-${Date.now()}`
        };
        profileData.educations.push(newEducation);
      } else if (action === 'update' && data.id) {
        profileData.educations = profileData.educations.map(education =>
          education.id === data.id ? data : education
        );
      } else if (action === 'delete' && data.id) {
        profileData.educations = profileData.educations.filter(education => 
          education.id !== data.id
        );
      }
    } else {
      return NextResponse.json(
        { error: '지원되지 않는 요청 타입입니다.' },
        { status: 400 }
      );
    }
    
    // 업데이트된 데이터 저장
    writeProfileData(profileData);
    
    return NextResponse.json({ success: true, data: profileData });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '요청을 처리할 수 없습니다.' },
      { status: 500 }
    );
  }
} 