import axios from 'axios';

// API URL 결정 함수
const getApiUrl = () => {
  // 서버 사이드 렌더링 중이면 환경변수만 사용
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }
  
  // 클라이언트 사이드에서는 환경변수가 없으면 현재 도메인 사용
  return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
};

// 환경 변수에서 API URL을 가져오거나 기본값 사용
const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 에러 인터셉터 추가
api.interceptors.request.use(
  config => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    return config;
  },
  error => {
    console.error('API 요청 오류:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log(`API 응답: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('API 오류:', 
      error.response?.status,
      error.response?.config?.method?.toUpperCase(),
      error.response?.config?.url,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// 이미지 업로드 API
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// 프로젝트 관련 API
export const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects');
    const projectsData = response.data;
    
    // 각 프로젝트 항목에 대해 title과 name 필드 확인 및 처리
    if (Array.isArray(projectsData)) {
      projectsData.forEach(project => {
        // title 필드가 비어있고 name 필드가 있으면 name 값을 title에 복사
        if ((!project.title || project.title === '') && project.name) {
          project.title = project.name;
          console.log(`Project ${project.id}: title is empty, using name instead:`, project.name);
        }
        
        // name 필드가 비어있고 title 필드가 있으면 title 값을 name에 복사
        if ((!project.name || project.name === '') && project.title) {
          project.name = project.title;
          console.log(`Project ${project.id}: name is empty, using title instead:`, project.title);
        }
      });
    }
    
    return projectsData;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchProjectById = async (id: string) => {
  try {
    const response = await api.get(`/api/projects/${id}`);
    const projectData = response.data;
    
    // title 필드가 비어있고 name 필드가 있으면 name 값을 title에 복사
    if ((!projectData.title || projectData.title === '') && projectData.name) {
      projectData.title = projectData.name;
      console.log('Project title is empty, using name instead:', projectData.name);
    }
    
    // name 필드가 비어있고 title 필드가 있으면 title 값을 name에 복사
    if ((!projectData.name || projectData.name === '') && projectData.title) {
      projectData.name = projectData.title;
      console.log('Project name is empty, using title instead:', projectData.title);
    }
    
    return projectData;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
};

export const createProject = async (data: any) => {
  try {
    // FormData 객체가 이미 만들어져 있는 경우
    if (data instanceof FormData) {
      // FormData 내용 로깅
      console.log("Creating project with existing FormData");
      
      // 'project' 필드가 있는지 확인
      let projectData = null;
      data.forEach((value, key) => {
        if (key === 'project') {
          try {
            projectData = JSON.parse(value as string);
            console.log("Project data parsed:", projectData);
            // 제목이 name으로 복사되는지 확인
            if (projectData.title && (!projectData.name || projectData.name !== projectData.title)) {
              projectData.name = projectData.title;
              // 수정된 데이터를 다시 FormData에 넣기
              data.set('project', JSON.stringify(projectData));
              console.log("Fixed project name to match title:", projectData.title);
            }
          } catch (e) {
            console.error("Error parsing project data:", e);
          }
        }
      });
      
      const response = await api.post('/api/projects', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // 기존 방식 (FormData를 여기서 만드는 경우)
    const formData = new FormData();
    
    // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
    const today = new Date().toISOString().split("T")[0]
    
    // 제목과 요약 기본값 설정
    const title = data.title || "새 프로젝트";
    const summary = data.summary || `${title} 프로젝트`;
    
    // 프로젝트 데이터를 JSON 문자열로 변환하여 추가
    formData.append('project', JSON.stringify({
      title: title,
      name: title, // 제목을 name 필드에도 동일하게 설정
      summary: summary,
      description: data.description || "",
      technologies: data.technologies || [],
      github: data.github || "",       // github URL
      website: data.website || "",     // 데모 사이트 URL
      startDate: data.startDate || today,
      endDate: data.endDate || today,
      // 트러블슈팅 데이터는 소문자로 시작하도록 수정 (백엔드 DTO와 일치)
      troubleshooting: (data.troubleShooting || data.troubleshooting || []).map((item: any) => ({
        id: item.id !== "new" ? item.id : null,
        title: item.title,
        description: item.description,
        image: ""  // 이미지는 별도 처리
      }))
    }));

    // 이미지 파일들 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    // 썸네일 인덱스 추가
    if (data.thumbnailIndex !== undefined) {
      formData.append('thumbnailIndex', data.thumbnailIndex.toString());
    }

    // 트러블슈팅 이미지 추가
    if (data.troubleshootingImages && data.troubleshootingImages.length > 0) {
      data.troubleshootingImages.forEach((file: File) => {
        formData.append('troubleshootingImages', file);
      });
    }

    // 트러블슈팅 이미지 인덱스 추가
    if (data.troubleshootingImageIndices && data.troubleshootingImageIndices.length > 0) {
      data.troubleshootingImageIndices.forEach((index: number) => {
        formData.append('troubleshootingImageIndices', index.toString());
      });
    }

    const response = await api.post('/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProjectApi = async (id: string, data: any) => {
  try {
    // FormData 객체가 이미 만들어져 있는 경우
    if (data instanceof FormData) {
      // FormData 내용 로깅
      console.log("Updating project with existing FormData");
      
      // 'project' 필드가 있는지 확인
      let projectData = null;
      data.forEach((value, key) => {
        if (key === 'project') {
          try {
            projectData = JSON.parse(value as string);
            console.log("Project data parsed:", projectData);
            // 제목이 name으로 복사되는지 확인
            if (projectData.title && (!projectData.name || projectData.name !== projectData.title)) {
              projectData.name = projectData.title;
              // 수정된 데이터를 다시 FormData에 넣기
              data.set('project', JSON.stringify(projectData));
              console.log("Fixed project name to match title:", projectData.title);
            }
          } catch (e) {
            console.error("Error parsing project data:", e);
          }
        }
      });
      
      const response = await api.put(`/api/projects/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    
    // 기존 방식 (FormData를 여기서 만드는 경우)
    const formData = new FormData();
    
    // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
    const today = new Date().toISOString().split("T")[0]
    
    // 제목과 요약 기본값 설정
    const title = data.title || "새 프로젝트";
    const summary = data.summary || `${title} 프로젝트`;
    
    // 프로젝트 데이터를 JSON 문자열로 변환하여 추가
    formData.append('project', JSON.stringify({
      title: title,
      name: title, // 제목을 name 필드에도 동일하게 설정
      summary: summary,
      description: data.description || "",
      technologies: data.technologies || [],
      github: data.github || "",       // github URL
      website: data.website || "",     // 데모 사이트 URL
      startDate: data.startDate || today,
      endDate: data.endDate || today,
      // 트러블슈팅 데이터는 소문자로 시작하도록 수정 (백엔드 DTO와 일치)
      troubleshooting: (data.troubleShooting || data.troubleshooting || []).map((item: any) => ({
        id: item.id !== "new" ? item.id : null,
        title: item.title,
        description: item.description,
        image: ""  // 이미지는 별도 처리
      }))
    }));

    // 이미지 파일들 추가
    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File) => {
        formData.append('images', file);
      });
    }

    // 썸네일 인덱스 추가
    if (data.thumbnailIndex !== undefined) {
      formData.append('thumbnailIndex', data.thumbnailIndex.toString());
    }

    // 트러블슈팅 이미지 추가
    if (data.troubleshootingImages && data.troubleshootingImages.length > 0) {
      data.troubleshootingImages.forEach((file: File) => {
        formData.append('troubleshootingImages', file);
      });
    }

    // 트러블슈팅 이미지 인덱스 추가
    if (data.troubleshootingImageIndices && data.troubleshootingImageIndices.length > 0) {
      data.troubleshootingImageIndices.forEach((index: number) => {
        formData.append('troubleshootingImageIndices', index.toString());
      });
    }

    const response = await api.put(`/api/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProjectApi = async (id: string) => {
  try {
    const response = await api.delete(`/api/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// 프로필 관련 API
export const fetchProfile = async () => {
  try {
    const response = await api.get('/api/profiles');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const createProfile = async (data: any) => {
  try {
    const response = await api.post('/api/profiles', data);
    return response.data;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
};

export const updateProfileInfo = async (id: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('Invalid profile ID');
    }
    
    // 이미지 파일이 있는 경우 이미지 업로드 함수 사용
    if (data.image instanceof File) {
      return updateProfileWithImage(id, data);
    }
    
    const response = await api.put(`/api/profiles/${numericId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// 이미지를 포함한 프로필 업데이트 함수
export const updateProfileWithImage = async (id: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('Invalid profile ID');
    }
    
    // FormData 객체 생성
    const formData = new FormData();
    
    // 프로필 필드 추가
    if (data.name) formData.append('name', data.name);
    if (data.title) formData.append('title', data.title);
    if (data.bio !== undefined) formData.append('bio', data.bio || '');
    if (data.email !== undefined) formData.append('email', data.email || '');
    if (data.phone !== undefined) formData.append('phone', data.phone || '');
    if (data.address !== undefined) formData.append('address', data.address || '');
    if (data.location !== undefined) formData.append('location', data.location || '');
    
    // 이미지 파일 추가
    if (data.image instanceof File) {
      formData.append('imageFile', data.image);
    }
    
    console.log('Updating profile with image:', numericId);
    
    const response = await api.put(`/api/profiles/${numericId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile with image:', error);
    throw error;
  }
};

// 경력 관련 API
export const addCareer = async (profileId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    if (isNaN(numericProfileId)) {
      throw new Error('Invalid profile ID');
    }
    
    console.log('Adding career to profile:', numericProfileId);
    console.log('Career data:', data);
    
    // id 필드 제거 (백엔드에서 자동 생성됨)
    const { id, ...careerData } = data;
    
    const response = await api.post(`/api/profiles/${numericProfileId}/careers`, careerData);
    console.log('Career add response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding career:', error);
    throw error;
  }
};

export const updateCareer = async (profileId: string, careerId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericCareerId = parseInt(careerId, 10);
    if (isNaN(numericProfileId) || isNaN(numericCareerId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.put(`/api/profiles/${numericProfileId}/careers/${numericCareerId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating career:', error);
    throw error;
  }
};

export const deleteCareer = async (profileId: string, careerId: string) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericCareerId = parseInt(careerId, 10);
    if (isNaN(numericProfileId) || isNaN(numericCareerId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.delete(`/api/profiles/${numericProfileId}/careers/${numericCareerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting career:', error);
    throw error;
  }
};

// 교육 관련 API
export const addEducation = async (profileId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    if (isNaN(numericProfileId)) {
      throw new Error('Invalid profile ID');
    }
    
    console.log('Adding education to profile:', numericProfileId);
    console.log('Education data:', data);
    
    // id 필드 제거 (백엔드에서 자동 생성됨)
    const { id, ...educationData } = data;
    
    const response = await api.post(`/api/profiles/${numericProfileId}/educations`, educationData);
    console.log('Education add response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

export const updateEducation = async (profileId: string, educationId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericEducationId = parseInt(educationId, 10);
    if (isNaN(numericProfileId) || isNaN(numericEducationId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.put(`/api/profiles/${numericProfileId}/educations/${numericEducationId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

export const deleteEducation = async (profileId: string, educationId: string) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericEducationId = parseInt(educationId, 10);
    if (isNaN(numericProfileId) || isNaN(numericEducationId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.delete(`/api/profiles/${numericProfileId}/educations/${numericEducationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// 기술 관련 API
export const addSkill = async (profileId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    if (isNaN(numericProfileId)) {
      throw new Error('Invalid profile ID');
    }
    
    console.log('Adding skill to profile:', numericProfileId);
    console.log('Skill data:', data);
    
    // id 필드 제거 (백엔드에서 자동 생성됨)
    const { id, ...skillData } = data;
    
    const response = await api.post(`/api/profiles/${numericProfileId}/skills`, skillData);
    console.log('Skill add response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
};

export const updateSkill = async (profileId: string, skillId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericSkillId = parseInt(skillId, 10);
    if (isNaN(numericProfileId) || isNaN(numericSkillId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.put(`/api/profiles/${numericProfileId}/skills/${numericSkillId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
};

export const deleteSkill = async (profileId: string, skillId: string) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericSkillId = parseInt(skillId, 10);
    if (isNaN(numericProfileId) || isNaN(numericSkillId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.delete(`/api/profiles/${numericProfileId}/skills/${numericSkillId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
};

// 소셜 미디어 관련 API
export const addSocial = async (profileId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    if (isNaN(numericProfileId)) {
      throw new Error('Invalid profile ID');
    }
    
    console.log('Adding social to profile:', numericProfileId);
    console.log('Social data:', data);
    
    // id 필드 제거 (백엔드에서 자동 생성됨)
    const { id, ...socialData } = data;
    
    const response = await api.post(`/api/profiles/${numericProfileId}/socials`, socialData);
    console.log('Social add response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding social:', error);
    throw error;
  }
};

export const updateSocial = async (profileId: string, socialId: string, data: any) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericSocialId = parseInt(socialId, 10);
    if (isNaN(numericProfileId) || isNaN(numericSocialId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.put(`/api/profiles/${numericProfileId}/socials/${numericSocialId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating social:', error);
    throw error;
  }
};

export const deleteSocial = async (profileId: string, socialId: string) => {
  try {
    // 문자열 ID를 숫자로 변환
    const numericProfileId = parseInt(profileId, 10);
    const numericSocialId = parseInt(socialId, 10);
    if (isNaN(numericProfileId) || isNaN(numericSocialId)) {
      throw new Error('Invalid ID');
    }
    
    const response = await api.delete(`/api/profiles/${numericProfileId}/socials/${numericSocialId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting social:', error);
    throw error;
  }
}; 