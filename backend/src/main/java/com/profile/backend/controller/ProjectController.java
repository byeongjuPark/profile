package com.profile.backend.controller;

import com.profile.backend.dto.ProjectDto;
import com.profile.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ObjectMapper objectMapper;
    
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProject(id));
    }
    
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto projectDto) {
        return new ResponseEntity<>(projectService.createProject(projectDto), HttpStatus.CREATED);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectDto> createProjectWithFiles(
            @RequestParam("project") String projectJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "thumbnailIndex", required = false) String thumbnailIndex,
            @RequestParam(value = "troubleshootingImages", required = false) List<MultipartFile> troubleshootingImages,
            @RequestParam(value = "troubleshootingImageIndices", required = false) List<String> troubleshootingImageIndices
    ) throws IOException {
        ProjectDto projectDto = objectMapper.readValue(projectJson, ProjectDto.class);
        Integer thumbIndex = thumbnailIndex != null ? Integer.parseInt(thumbnailIndex) : null;
        return new ResponseEntity<>(projectService.createProjectWithFiles(projectDto, images, thumbIndex, troubleshootingImages, troubleshootingImageIndices), HttpStatus.CREATED);
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProjectDto> updateProject(@PathVariable Long id, @RequestBody ProjectDto projectDto) {
        return ResponseEntity.ok(projectService.updateProject(id, projectDto));
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectDto> updateProjectWithFiles(
            @PathVariable Long id,
            @RequestParam("project") String projectJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "thumbnailIndex", required = false) String thumbnailIndex,
            @RequestParam(value = "troubleshootingImages", required = false) List<MultipartFile> troubleshootingImages,
            @RequestParam(value = "troubleshootingImageIndices", required = false) List<String> troubleshootingImageIndices
    ) throws IOException {
        ProjectDto projectDto = objectMapper.readValue(projectJson, ProjectDto.class);
        Integer thumbIndex = thumbnailIndex != null ? Integer.parseInt(thumbnailIndex) : null;
        return ResponseEntity.ok(projectService.updateProjectWithFiles(id, projectDto, images, thumbIndex, troubleshootingImages, troubleshootingImageIndices));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
    
    // TroubleShooting 엔드포인트
    @PostMapping("/{projectId}/troubleshooting")
    public ResponseEntity<ProjectDto> addTroubleShooting(@PathVariable Long projectId, 
                                                      @RequestBody ProjectDto.TroubleShootingDto troubleShootingDto) {
        return ResponseEntity.ok(projectService.addTroubleShooting(projectId, troubleShootingDto));
    }
    
    @PutMapping("/{projectId}/troubleshooting/{troubleShootingId}")
    public ResponseEntity<ProjectDto> updateTroubleShooting(@PathVariable Long projectId, 
                                                         @PathVariable Long troubleShootingId, 
                                                         @RequestBody ProjectDto.TroubleShootingDto troubleShootingDto) {
        return ResponseEntity.ok(projectService.updateTroubleShooting(projectId, troubleShootingId, troubleShootingDto));
    }
    
    @DeleteMapping("/{projectId}/troubleshooting/{troubleShootingId}")
    public ResponseEntity<ProjectDto> deleteTroubleShooting(@PathVariable Long projectId, 
                                                         @PathVariable Long troubleShootingId) {
        return ResponseEntity.ok(projectService.deleteTroubleShooting(projectId, troubleShootingId));
    }
} 