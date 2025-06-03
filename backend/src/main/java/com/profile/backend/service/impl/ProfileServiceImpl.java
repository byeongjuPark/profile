package com.profile.backend.service.impl;

import com.profile.backend.dto.ProfileDto;
import com.profile.backend.entity.*;
import com.profile.backend.exception.ResourceNotFoundException;
import com.profile.backend.repository.ProfileRepository;
import com.profile.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    
    @Value("${app.upload.image-dir}")
    private String uploadDir;
    
    @Override
    public ProfileDto getProfile(Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        return mapToDto(profile);
    }
    
    @Override
    public ProfileDto getFirstProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("No profiles found"));
    }
    
    @Override
    public ProfileDto createProfile(ProfileDto profileDto) {
        Profile profile = mapToEntity(profileDto);
        Profile savedProfile = profileRepository.save(profile);
        return mapToDto(savedProfile);
    }
    
    @Override
    public ProfileDto updateProfile(Long id, ProfileDto profileDto) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        
        profile.setName(profileDto.getName());
        profile.setTitle(profileDto.getTitle());
        profile.setBio(profileDto.getBio());
        profile.setEmail(profileDto.getEmail());
        profile.setImage(profileDto.getImage());
        profile.setPhone(profileDto.getPhone());
        profile.setAddress(profileDto.getAddress());
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public void deleteProfile(Long id) {
        if (!profileRepository.existsById(id)) {
            throw new ResourceNotFoundException("Profile not found with id: " + id);
        }
        profileRepository.deleteById(id);
    }
    
    // Career 관련 메서드
    @Override
    public ProfileDto addCareer(Long profileId, ProfileDto.CareerDto careerDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Career career = new Career();
        career.setCompany(careerDto.getCompany());
        career.setPosition(careerDto.getPosition());
        career.setPeriod(careerDto.getPeriod());
        career.setDescription(careerDto.getDescription());
        career.setProfile(profile);
        
        profile.getCareers().add(career);
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto updateCareer(Long profileId, Long careerId, ProfileDto.CareerDto careerDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Career career = profile.getCareers().stream()
                .filter(c -> c.getId().equals(careerId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Career not found with id: " + careerId));
        
        career.setCompany(careerDto.getCompany());
        career.setPosition(careerDto.getPosition());
        career.setPeriod(careerDto.getPeriod());
        career.setDescription(careerDto.getDescription());
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto deleteCareer(Long profileId, Long careerId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        profile.getCareers().removeIf(career -> career.getId().equals(careerId));
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    // Education 관련 메서드
    @Override
    public ProfileDto addEducation(Long profileId, ProfileDto.EducationDto educationDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Education education = new Education();
        education.setInstitution(educationDto.getInstitution());
        education.setDegree(educationDto.getDegree());
        education.setPeriod(educationDto.getPeriod());
        education.setDescription(educationDto.getDescription());
        education.setProfile(profile);
        
        profile.getEducations().add(education);
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto updateEducation(Long profileId, Long educationId, ProfileDto.EducationDto educationDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Education education = profile.getEducations().stream()
                .filter(e -> e.getId().equals(educationId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Education not found with id: " + educationId));
        
        education.setInstitution(educationDto.getInstitution());
        education.setDegree(educationDto.getDegree());
        education.setPeriod(educationDto.getPeriod());
        education.setDescription(educationDto.getDescription());
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto deleteEducation(Long profileId, Long educationId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        profile.getEducations().removeIf(education -> education.getId().equals(educationId));
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    // Skill 관련 메서드
    @Override
    public ProfileDto addSkill(Long profileId, ProfileDto.SkillDto skillDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Skill skill = new Skill();
        skill.setName(skillDto.getName());
        skill.setLevel(skillDto.getLevel());
        skill.setCategory(skillDto.getCategory());
        skill.setProfile(profile);
        
        profile.getSkills().add(skill);
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto updateSkill(Long profileId, Long skillId, ProfileDto.SkillDto skillDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Skill skill = profile.getSkills().stream()
                .filter(s -> s.getId().equals(skillId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        skill.setName(skillDto.getName());
        skill.setLevel(skillDto.getLevel());
        skill.setCategory(skillDto.getCategory());
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto deleteSkill(Long profileId, Long skillId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        profile.getSkills().removeIf(skill -> skill.getId().equals(skillId));
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    // Social 관련 메서드
    @Override
    public ProfileDto addSocial(Long profileId, ProfileDto.SocialDto socialDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Social social = new Social();
        social.setPlatform(socialDto.getPlatform());
        social.setUrl(socialDto.getUrl());
        social.setIcon(socialDto.getIcon());
        social.setProfile(profile);
        
        profile.getSocials().add(social);
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto updateSocial(Long profileId, Long socialId, ProfileDto.SocialDto socialDto) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        Social social = profile.getSocials().stream()
                .filter(s -> s.getId().equals(socialId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Social not found with id: " + socialId));
        
        social.setPlatform(socialDto.getPlatform());
        social.setUrl(socialDto.getUrl());
        social.setIcon(socialDto.getIcon());
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    @Override
    public ProfileDto deleteSocial(Long profileId, Long socialId) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + profileId));
        
        profile.getSocials().removeIf(social -> social.getId().equals(socialId));
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }
    
    // Entity에서 DTO로 변환하는 메서드
    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .name(profile.getName())
                .title(profile.getTitle())
                .bio(profile.getBio())
                .email(profile.getEmail())
                .image(profile.getImage())
                .phone(profile.getPhone())
                .address(profile.getAddress())
                .careers(profile.getCareers().stream()
                        .map(career -> ProfileDto.CareerDto.builder()
                                .id(career.getId())
                                .company(career.getCompany())
                                .position(career.getPosition())
                                .period(career.getPeriod())
                                .description(career.getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .educations(profile.getEducations().stream()
                        .map(education -> ProfileDto.EducationDto.builder()
                                .id(education.getId())
                                .institution(education.getInstitution())
                                .degree(education.getDegree())
                                .period(education.getPeriod())
                                .description(education.getDescription())
                                .build())
                        .collect(Collectors.toList()))
                .skills(profile.getSkills().stream()
                        .map(skill -> ProfileDto.SkillDto.builder()
                                .id(skill.getId())
                                .name(skill.getName())
                                .level(skill.getLevel())
                                .category(skill.getCategory())
                                .build())
                        .collect(Collectors.toList()))
                .socials(profile.getSocials().stream()
                        .map(social -> ProfileDto.SocialDto.builder()
                                .id(social.getId())
                                .platform(social.getPlatform())
                                .url(social.getUrl())
                                .icon(social.getIcon())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
    
    // DTO에서 Entity로 변환하는 메서드
    private Profile mapToEntity(ProfileDto profileDto) {
        Profile profile = new Profile();
        profile.setName(profileDto.getName());
        profile.setTitle(profileDto.getTitle());
        profile.setBio(profileDto.getBio());
        profile.setEmail(profileDto.getEmail());
        profile.setImage(profileDto.getImage());
        profile.setPhone(profileDto.getPhone());
        profile.setAddress(profileDto.getAddress());
        
        // Career 엔티티 변환
        if (profileDto.getCareers() != null) {
            profileDto.getCareers().forEach(careerDto -> {
                Career career = new Career();
                career.setCompany(careerDto.getCompany());
                career.setPosition(careerDto.getPosition());
                career.setPeriod(careerDto.getPeriod());
                career.setDescription(careerDto.getDescription());
                career.setProfile(profile);
                profile.getCareers().add(career);
            });
        }
        
        // Education 엔티티 변환
        if (profileDto.getEducations() != null) {
            profileDto.getEducations().forEach(educationDto -> {
                Education education = new Education();
                education.setInstitution(educationDto.getInstitution());
                education.setDegree(educationDto.getDegree());
                education.setPeriod(educationDto.getPeriod());
                education.setDescription(educationDto.getDescription());
                education.setProfile(profile);
                profile.getEducations().add(education);
            });
        }
        
        // Skill 엔티티 변환
        if (profileDto.getSkills() != null) {
            profileDto.getSkills().forEach(skillDto -> {
                Skill skill = new Skill();
                skill.setName(skillDto.getName());
                skill.setLevel(skillDto.getLevel());
                skill.setCategory(skillDto.getCategory());
                skill.setProfile(profile);
                profile.getSkills().add(skill);
            });
        }
        
        // Social 엔티티 변환
        if (profileDto.getSocials() != null) {
            profileDto.getSocials().forEach(socialDto -> {
                Social social = new Social();
                social.setPlatform(socialDto.getPlatform());
                social.setUrl(socialDto.getUrl());
                social.setIcon(socialDto.getIcon());
                social.setProfile(profile);
                profile.getSocials().add(social);
            });
        }
        
        return profile;
    }

    // 이미지 업로드를 위한 메서드 구현
    @Override
    public ProfileDto createProfileWithImage(ProfileDto profileDto, MultipartFile imageFile) throws IOException {
        // 프로필 생성
        Profile profile = mapToEntity(profileDto);
        
        // 이미지 처리
        if (!imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            profile.setImage(fileName);
        }
        
        Profile savedProfile = profileRepository.save(profile);
        return mapToDto(savedProfile);
    }

    @Override
    public ProfileDto updateProfileWithImage(Long id, ProfileDto profileDto, MultipartFile imageFile) throws IOException {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        
        // 기본 프로필 정보 업데이트
        if (profileDto.getName() != null) profile.setName(profileDto.getName());
        if (profileDto.getTitle() != null) profile.setTitle(profileDto.getTitle());
        profile.setBio(profileDto.getBio());
        profile.setEmail(profileDto.getEmail());
        profile.setPhone(profileDto.getPhone());
        profile.setAddress(profileDto.getAddress());
        
        // 이미지 처리
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = saveImage(imageFile);
            profile.setImage(fileName);
        }
        
        Profile updatedProfile = profileRepository.save(profile);
        return mapToDto(updatedProfile);
    }

    // 이미지 저장 helper 메서드
    private String saveImage(MultipartFile file) throws IOException {
        // 디렉토리가 없으면 생성
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (!created) {
                throw new IOException("Failed to create directory: " + uploadDir);
            }
        }
        
        // 파일 이름 생성 (중복 방지를 위해 타임스탬프 추가)
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unknown.jpg";
        }
        String fileName = System.currentTimeMillis() + "_" + originalFilename.replaceAll("\\s+", "_");
        String filePath = uploadDir + File.separator + fileName;
        
        // 파일 저장
        File dest = new File(filePath);
        file.transferTo(dest);
        
        // 상대 URL 반환 (프론트엔드에서 접근 가능한 URL)
        return "/api/images/" + fileName;
    }
} 