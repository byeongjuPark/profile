package com.profile.backend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long id;
    private String name;
    private String title;
    private String bio;
    private String email;
    private String image;
    private String phone;
    private String address;
    private List<CareerDto> careers;
    private List<EducationDto> educations;
    private List<SkillDto> skills;
    private List<SocialDto> socials;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CareerDto {
        private Long id;
        private String company;
        private String position;
        private String period;
        private String description;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EducationDto {
        private Long id;
        private String institution;
        private String degree;
        private String period;
        private String description;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillDto {
        private Long id;
        private String name;
        private Integer level;
        private String category;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SocialDto {
        private Long id;
        private String platform;
        private String url;
        private String icon;
    }
} 