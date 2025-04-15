package com.profile.backend.service;

import com.profile.backend.dto.ProjectDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProjectService {
    
    List<ProjectDto> getAllProjects();
    
    ProjectDto getProject(Long id);
    
    ProjectDto createProject(ProjectDto projectDto);
    
    ProjectDto createProjectWithFiles(
        ProjectDto projectDto,
        List<MultipartFile> images,
        Integer thumbnailIndex,
        List<MultipartFile> troubleshootingImages,
        List<String> troubleshootingImageIndices
    ) throws IOException;
    
    ProjectDto updateProject(Long id, ProjectDto projectDto);
    
    ProjectDto updateProjectWithFiles(
        Long id,
        ProjectDto projectDto,
        List<MultipartFile> images,
        Integer thumbnailIndex,
        List<MultipartFile> troubleshootingImages,
        List<String> troubleshootingImageIndices
    ) throws IOException;
    
    void deleteProject(Long id);
    
    // TroubleShooting 관련 메서드
    ProjectDto addTroubleShooting(Long projectId, ProjectDto.TroubleShootingDto troubleShootingDto);
    
    ProjectDto updateTroubleShooting(Long projectId, Long troubleShootingId, 
                                   ProjectDto.TroubleShootingDto troubleShootingDto);
    
    ProjectDto deleteTroubleShooting(Long projectId, Long troubleShootingId);
    
    ProjectDto addTroubleShootingWithImage(Long projectId, ProjectDto.TroubleShootingDto troubleShootingDto, MultipartFile image);
    
    ProjectDto updateTroubleShootingWithImage(Long projectId, Long troubleShootingId, ProjectDto.TroubleShootingDto troubleShootingDto, MultipartFile image);
} 