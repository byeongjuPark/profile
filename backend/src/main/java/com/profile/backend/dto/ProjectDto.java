package com.profile.backend.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private String summary;
    private String role;
    private String github;
    private String thumbnail;
    private String website;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<String> technologies;
    private List<String> images;
    private List<TroubleShootingDto> troubleshooting;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TroubleShootingDto {
        private Object id;
        private String title;
        private String description;
        private String image;
    }
} 