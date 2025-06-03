package com.profile.backend.controller;

import com.profile.backend.dto.ProfileDto;
import com.profile.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    
    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }
    
    @GetMapping
    public ResponseEntity<ProfileDto> getFirstProfile() {
        return ResponseEntity.ok(profileService.getFirstProfile());
    }
    
    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(@RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.createProfile(profileDto));
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDto> createProfileWithImage(
            @RequestParam("name") String name,
            @RequestParam("title") String title,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
        
        ProfileDto profileDto = ProfileDto.builder()
                .name(name)
                .title(title)
                .bio(bio)
                .email(email)
                .phone(phone)
                .address(address)
                .build();
        
        return ResponseEntity.ok(profileService.createProfileWithImage(profileDto, imageFile));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ProfileDto> updateProfile(@PathVariable Long id, @RequestBody ProfileDto profileDto) {
        return ResponseEntity.ok(profileService.updateProfile(id, profileDto));
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileDto> updateProfileWithImage(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        
        System.out.println("프로필 업데이트 요청 받음 (ID: " + id + ")");
        System.out.println("name: " + name);
        System.out.println("title: " + title);
        System.out.println("bio: " + bio);
        System.out.println("email: " + email);
        System.out.println("phone: " + phone);
        System.out.println("location: " + location);
        System.out.println("imageFile: " + (imageFile != null ? (imageFile.isEmpty() ? "비어있음" : imageFile.getOriginalFilename()) : "null"));
        
        ProfileDto profileDto = ProfileDto.builder()
                .name(name)
                .title(title)
                .bio(bio)
                .email(email)
                .phone(phone)
                .address(address != null ? address : location)
                .build();
        
        return ResponseEntity.ok(profileService.updateProfileWithImage(id, profileDto, imageFile));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        profileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }
    
    // Career 엔드포인트
    @PostMapping("/{profileId}/careers")
    public ResponseEntity<ProfileDto> addCareer(@PathVariable Long profileId, @RequestBody ProfileDto.CareerDto careerDto) {
        return ResponseEntity.ok(profileService.addCareer(profileId, careerDto));
    }
    
    @PutMapping("/{profileId}/careers/{careerId}")
    public ResponseEntity<ProfileDto> updateCareer(@PathVariable Long profileId, @PathVariable Long careerId, 
                                                 @RequestBody ProfileDto.CareerDto careerDto) {
        return ResponseEntity.ok(profileService.updateCareer(profileId, careerId, careerDto));
    }
    
    @DeleteMapping("/{profileId}/careers/{careerId}")
    public ResponseEntity<ProfileDto> deleteCareer(@PathVariable Long profileId, @PathVariable Long careerId) {
        return ResponseEntity.ok(profileService.deleteCareer(profileId, careerId));
    }
    
    // Education 엔드포인트
    @PostMapping("/{profileId}/educations")
    public ResponseEntity<ProfileDto> addEducation(@PathVariable Long profileId, @RequestBody ProfileDto.EducationDto educationDto) {
        return ResponseEntity.ok(profileService.addEducation(profileId, educationDto));
    }
    
    @PutMapping("/{profileId}/educations/{educationId}")
    public ResponseEntity<ProfileDto> updateEducation(@PathVariable Long profileId, @PathVariable Long educationId, 
                                                    @RequestBody ProfileDto.EducationDto educationDto) {
        return ResponseEntity.ok(profileService.updateEducation(profileId, educationId, educationDto));
    }
    
    @DeleteMapping("/{profileId}/educations/{educationId}")
    public ResponseEntity<ProfileDto> deleteEducation(@PathVariable Long profileId, @PathVariable Long educationId) {
        return ResponseEntity.ok(profileService.deleteEducation(profileId, educationId));
    }
    
    // Skill 엔드포인트
    @PostMapping("/{profileId}/skills")
    public ResponseEntity<ProfileDto> addSkill(@PathVariable Long profileId, @RequestBody ProfileDto.SkillDto skillDto) {
        return ResponseEntity.ok(profileService.addSkill(profileId, skillDto));
    }
    
    @PutMapping("/{profileId}/skills/{skillId}")
    public ResponseEntity<ProfileDto> updateSkill(@PathVariable Long profileId, @PathVariable Long skillId, 
                                                @RequestBody ProfileDto.SkillDto skillDto) {
        return ResponseEntity.ok(profileService.updateSkill(profileId, skillId, skillDto));
    }
    
    @DeleteMapping("/{profileId}/skills/{skillId}")
    public ResponseEntity<ProfileDto> deleteSkill(@PathVariable Long profileId, @PathVariable Long skillId) {
        return ResponseEntity.ok(profileService.deleteSkill(profileId, skillId));
    }
    
    // Social 엔드포인트
    @PostMapping("/{profileId}/socials")
    public ResponseEntity<ProfileDto> addSocial(@PathVariable Long profileId, @RequestBody ProfileDto.SocialDto socialDto) {
        return ResponseEntity.ok(profileService.addSocial(profileId, socialDto));
    }
    
    @PutMapping("/{profileId}/socials/{socialId}")
    public ResponseEntity<ProfileDto> updateSocial(@PathVariable Long profileId, @PathVariable Long socialId, 
                                                 @RequestBody ProfileDto.SocialDto socialDto) {
        return ResponseEntity.ok(profileService.updateSocial(profileId, socialId, socialDto));
    }
    
    @DeleteMapping("/{profileId}/socials/{socialId}")
    public ResponseEntity<ProfileDto> deleteSocial(@PathVariable Long profileId, @PathVariable Long socialId) {
        return ResponseEntity.ok(profileService.deleteSocial(profileId, socialId));
    }
} 