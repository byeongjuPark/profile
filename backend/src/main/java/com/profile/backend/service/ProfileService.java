package com.profile.backend.service;

import com.profile.backend.dto.ProfileDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ProfileService {
    
    ProfileDto getProfile(Long id);
    
    ProfileDto getFirstProfile();
    
    ProfileDto createProfile(ProfileDto profileDto);
    
    ProfileDto createProfileWithImage(ProfileDto profileDto, MultipartFile imageFile) throws IOException;
    
    ProfileDto updateProfile(Long id, ProfileDto profileDto);
    
    ProfileDto updateProfileWithImage(Long id, ProfileDto profileDto, MultipartFile imageFile) throws IOException;
    
    void deleteProfile(Long id);
    
    // Career 관련 메서드
    ProfileDto addCareer(Long profileId, ProfileDto.CareerDto careerDto);
    
    ProfileDto updateCareer(Long profileId, Long careerId, ProfileDto.CareerDto careerDto);
    
    ProfileDto deleteCareer(Long profileId, Long careerId);
    
    // Education 관련 메서드
    ProfileDto addEducation(Long profileId, ProfileDto.EducationDto educationDto);
    
    ProfileDto updateEducation(Long profileId, Long educationId, ProfileDto.EducationDto educationDto);
    
    ProfileDto deleteEducation(Long profileId, Long educationId);
    
    // Skill 관련 메서드
    ProfileDto addSkill(Long profileId, ProfileDto.SkillDto skillDto);
    
    ProfileDto updateSkill(Long profileId, Long skillId, ProfileDto.SkillDto skillDto);
    
    ProfileDto deleteSkill(Long profileId, Long skillId);
    
    // Social 관련 메서드
    ProfileDto addSocial(Long profileId, ProfileDto.SocialDto socialDto);
    
    ProfileDto updateSocial(Long profileId, Long socialId, ProfileDto.SocialDto socialDto);
    
    ProfileDto deleteSocial(Long profileId, Long socialId);
} 