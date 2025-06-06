package com.profile.backend.service.impl;

import com.profile.backend.dto.ProjectDto;
import com.profile.backend.entity.Project;
import com.profile.backend.entity.TroubleShooting;
import com.profile.backend.exception.ResourceNotFoundException;
import com.profile.backend.repository.ProjectRepository;
import com.profile.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    
    @Override
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ProjectDto getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToDto(project);
    }
    
    @Override
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = mapToEntity(projectDto);
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }
    
    @Override
    public ProjectDto createProjectWithFiles(
            ProjectDto projectDto, 
            List<MultipartFile> images,
            Integer thumbnailIndex,
            List<MultipartFile> troubleshootingImages,
            List<String> troubleshootingImageIndices) throws IOException {
        
        Project project = mapToEntity(projectDto);
        
        // 날짜 필드 확인 및 기본값 설정
        if (project.getStartDate() == null) {
            project.setStartDate(java.time.LocalDate.now().toString());
        }
        if (project.getEndDate() == null) {
            project.setEndDate(java.time.LocalDate.now().toString());
        }
        
        // 이미지 파일 처리
        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = new ArrayList<>();
            
            // 모든 이미지 파일을 저장하고 URL을 목록에 추가
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = saveImage(image);
                    imageUrls.add(imageUrl);
                }
            }
            
            project.setImages(imageUrls);
            
            // 썸네일 설정 (기본적으로 첫 번째 이미지)
            if (thumbnailIndex != null && thumbnailIndex >= 0 && thumbnailIndex < imageUrls.size()) {
                project.setThumbnail(imageUrls.get(thumbnailIndex));
            } else if (!imageUrls.isEmpty()) {
                project.setThumbnail(imageUrls.get(0));
            }
        }
        
        // 트러블슈팅 처리
        if (projectDto.getTroubleshooting() != null && !projectDto.getTroubleshooting().isEmpty()) {
            List<TroubleShooting> troubleshootingEntities = new ArrayList<>();
            
            // troubleshootingImages와 troubleshootingImageIndices를 사용하여 이미지 매핑
            for (int i = 0; i < projectDto.getTroubleshooting().size(); i++) {
                ProjectDto.TroubleShootingDto tsDto = projectDto.getTroubleshooting().get(i);
                TroubleShooting ts = new TroubleShooting();
                
                // id는 무시하고 새로운 엔티티로 생성 (DB에서 자동 생성됨)
                ts.setTitle(tsDto.getTitle());
                ts.setDescription(tsDto.getDescription());
                ts.setProject(project);
                
                // 이미지 처리
                if (troubleshootingImages != null && troubleshootingImageIndices != null) {
                    for (int j = 0; j < troubleshootingImageIndices.size(); j++) {
                        if (String.valueOf(i).equals(troubleshootingImageIndices.get(j)) && j < troubleshootingImages.size()) {
                            MultipartFile tsImage = troubleshootingImages.get(j);
                            if (!tsImage.isEmpty()) {
                                String imageUrl = saveImage(tsImage);
                                ts.setImage(imageUrl);
                                break;
                            }
                        }
                    }
                }
                
                troubleshootingEntities.add(ts);
            }
            
            project.setTroubleshooting(troubleshootingEntities);
        }
        
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }
    
    @Override
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        project.setTitle(projectDto.getName());
        project.setSummary(projectDto.getSummary());
        project.setDescription(projectDto.getDescription());
        project.setTechnologies(projectDto.getTechnologies());
        project.setThumbnail(projectDto.getThumbnail());
        project.setStartDate(projectDto.getStartDate().toString());
        project.setEndDate(projectDto.getEndDate().toString());
        
        // github, website 필드 추가
        if (projectDto.getGithub() != null) {
            project.setGithub(projectDto.getGithub());
        }
        
        if (projectDto.getWebsite() != null) {
            project.setWebsite(projectDto.getWebsite());
        }
        
        // 이미지 정보 유지
        if (projectDto.getImages() != null && !projectDto.getImages().isEmpty()) {
            project.setImages(projectDto.getImages());
        }
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public ProjectDto updateProjectWithFiles(
            Long id, 
            ProjectDto projectDto, 
            List<MultipartFile> images,
            Integer thumbnailIndex,
            List<MultipartFile> troubleshootingImages,
            List<String> troubleshootingImageIndices,
            List<String> deletedImages) throws IOException {
        
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        
        // 기본 프로젝트 정보 업데이트
        if (projectDto.getName() != null) project.setTitle(projectDto.getName());
        
        // summary 필드 업데이트 - null 또는 빈 문자열 체크
        if (projectDto.getSummary() != null && !projectDto.getSummary().trim().isEmpty()) {
            project.setSummary(projectDto.getSummary());
        } else if (project.getSummary() == null || project.getSummary().trim().isEmpty()) {
            // 기존 summary가 없는 경우 기본값 설정
            project.setSummary(project.getTitle() != null ? project.getTitle() + " 프로젝트" : "새 프로젝트");
        }
        
        if (projectDto.getDescription() != null) project.setDescription(projectDto.getDescription());
        if (projectDto.getTechnologies() != null) project.setTechnologies(projectDto.getTechnologies());
        
        // 날짜 필드 업데이트 - null 체크 추가
        if (projectDto.getStartDate() != null) {
            project.setStartDate(projectDto.getStartDate().toString());
        } else if (project.getStartDate() == null) {
            // 기존 데이터도 없는 경우 현재 날짜로 설정
            project.setStartDate(java.time.LocalDate.now().toString());
        }
        
        if (projectDto.getEndDate() != null) {
            project.setEndDate(projectDto.getEndDate().toString());
        } else if (project.getEndDate() == null) {
            // 기존 데이터도 없는 경우 현재 날짜로 설정
            project.setEndDate(java.time.LocalDate.now().toString());
        }
        
        // GitHub 및 웹사이트 URL 업데이트
        if (projectDto.getGithub() != null) project.setGithub(projectDto.getGithub());
        if (projectDto.getWebsite() != null) project.setWebsite(projectDto.getWebsite());
        
        // 이미지 파일 처리
        List<String> currentImages = new ArrayList<>(project.getImages());
        
        // 삭제된 이미지 처리
        if (deletedImages != null && !deletedImages.isEmpty()) {
            System.out.println("삭제할 이미지: " + deletedImages);
            // 현재 이미지 목록에서 삭제 대상 이미지를 제거
            currentImages.removeAll(deletedImages);
            
            // 썸네일이 삭제된 경우 처리
            if (deletedImages.contains(project.getThumbnail())) {
                if (!currentImages.isEmpty()) {
                    // 남은 이미지 중 첫 번째를 썸네일로 설정
                    project.setThumbnail(currentImages.get(0));
                } else {
                    // 모든 이미지가 삭제된 경우 썸네일을 빈 문자열로 설정
                    project.setThumbnail("");
                }
            }
        }
        
        if (images != null && !images.isEmpty()) {
            // 새 이미지 저장 및 URL 목록에 추가
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = saveImage(image);
                    currentImages.add(imageUrl);
                }
            }
            
            // 썸네일 설정
            if (thumbnailIndex != null && thumbnailIndex >= 0 && thumbnailIndex < currentImages.size()) {
                project.setThumbnail(currentImages.get(thumbnailIndex));
            } else if (!currentImages.isEmpty() && (project.getThumbnail() == null || project.getThumbnail().isEmpty())) {
                // 기본값으로 첫 번째 이미지를 썸네일로 설정 (기존 썸네일이 없거나 비어있는 경우만)
                project.setThumbnail(currentImages.get(0));
            }
        }
        
        // 업데이트된 이미지 목록 설정
        project.setImages(currentImages);
        
        if (projectDto.getTroubleshooting() != null) {
            // 기존 트러블슈팅 항목 제거
            project.getTroubleshooting().clear();
            
            // 새 트러블슈팅 항목 추가
            for (int i = 0; i < projectDto.getTroubleshooting().size(); i++) {
                ProjectDto.TroubleShootingDto tsDto = projectDto.getTroubleshooting().get(i);
                TroubleShooting ts = new TroubleShooting();
                
                ts.setTitle(tsDto.getTitle());
                ts.setDescription(tsDto.getDescription());
                ts.setProject(project);
                
                // 이미지 처리
                if (troubleshootingImages != null && troubleshootingImageIndices != null) {
                    for (int j = 0; j < troubleshootingImageIndices.size(); j++) {
                        if (String.valueOf(i).equals(troubleshootingImageIndices.get(j)) && j < troubleshootingImages.size()) {
                            MultipartFile tsImage = troubleshootingImages.get(j);
                            if (!tsImage.isEmpty()) {
                                String imageUrl = saveImage(tsImage);
                                ts.setImage(imageUrl);
                                break;
                            }
                        }
                    }
                }
                
                project.getTroubleshooting().add(ts);
            }
        }
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    @Override
    public ProjectDto addTroubleShooting(Long projectId, ProjectDto.TroubleShootingDto troubleShootingDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        TroubleShooting troubleShooting = new TroubleShooting();
        troubleShooting.setTitle(troubleShootingDto.getTitle());
        troubleShooting.setDescription(troubleShootingDto.getDescription());
        troubleShooting.setImage(troubleShootingDto.getImage());
        troubleShooting.setProject(project);
        
        project.getTroubleshooting().add(troubleShooting);
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public ProjectDto updateTroubleShooting(Long projectId, Long troubleShootingId, 
                                          ProjectDto.TroubleShootingDto troubleShootingDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        TroubleShooting troubleShooting = project.getTroubleshooting().stream()
                .filter(ts -> ts.getId().equals(troubleShootingId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("TroubleShooting not found with id: " + troubleShootingId));
        
        troubleShooting.setTitle(troubleShootingDto.getTitle());
        troubleShooting.setDescription(troubleShootingDto.getDescription());
        troubleShooting.setImage(troubleShootingDto.getImage());
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public ProjectDto deleteTroubleShooting(Long projectId, Long troubleShootingId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        project.getTroubleshooting().removeIf(ts -> ts.getId().equals(troubleShootingId));
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public ProjectDto addTroubleShootingWithImage(Long projectId, ProjectDto.TroubleShootingDto troubleShootingDto, MultipartFile image) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        TroubleShooting troubleShooting = new TroubleShooting();
        troubleShooting.setTitle(troubleShootingDto.getTitle());
        troubleShooting.setDescription(troubleShootingDto.getDescription());
        troubleShooting.setProject(project);
        
        // 이미지 처리
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = saveImage(image);
                troubleShooting.setImage(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save troubleshooting image", e);
            }
        }
        
        project.getTroubleshooting().add(troubleShooting);
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    @Override
    public ProjectDto updateTroubleShootingWithImage(Long projectId, Long troubleShootingId, 
                                                   ProjectDto.TroubleShootingDto troubleShootingDto, 
                                                   MultipartFile image) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        TroubleShooting troubleShooting = project.getTroubleshooting().stream()
                .filter(ts -> ts.getId().equals(troubleShootingId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("TroubleShooting not found with id: " + troubleShootingId));
        
        troubleShooting.setTitle(troubleShootingDto.getTitle());
        troubleShooting.setDescription(troubleShootingDto.getDescription());
        
        // 이미지 처리
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = saveImage(image);
                troubleShooting.setImage(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save troubleshooting image", e);
            }
        }
        
        Project updatedProject = projectRepository.save(project);
        return mapToDto(updatedProject);
    }
    
    // Entity에서 DTO로 변환하는 메서드
    private ProjectDto mapToDto(Project project) {
        List<ProjectDto.TroubleShootingDto> troubleShootingDtos = project.getTroubleshooting().stream()
                .map(ts -> {
                    return ProjectDto.TroubleShootingDto.builder()
                            .id(ts.getId())
                            .title(ts.getTitle())
                            .description(ts.getDescription())
                            .image(ts.getImage())
                            .build();
                })
                .collect(Collectors.toList());
        
        ProjectDto projectDto = ProjectDto.builder()
                .id(project.getId())
                .name(project.getTitle())
                .summary(project.getSummary())
                .description(project.getDescription())
                .technologies(project.getTechnologies())
                .thumbnail(project.getThumbnail())
                .github(project.getGithub())
                .website(project.getWebsite())
                .images(project.getImages())
                .startDate(java.time.LocalDate.parse(project.getStartDate()))
                .endDate(java.time.LocalDate.parse(project.getEndDate()))
                .troubleshooting(troubleShootingDtos)
                .build();
                
        return projectDto;
    }
    
    // DTO에서 Entity로 변환하는 메서드
    private Project mapToEntity(ProjectDto projectDto) {
        Project project = new Project();
        project.setTitle(projectDto.getName());
        
        // summary 필드가 null이면 기본값 설정
        if (projectDto.getSummary() != null && !projectDto.getSummary().trim().isEmpty()) {
            project.setSummary(projectDto.getSummary());
        } else {
            project.setSummary(projectDto.getName() != null ? projectDto.getName() + " 프로젝트" : "새 프로젝트");
        }
        
        project.setDescription(projectDto.getDescription());
        project.setTechnologies(projectDto.getTechnologies());
        project.setThumbnail(projectDto.getThumbnail());
        
        // github, website 필드 추가
        project.setGithub(projectDto.getGithub());
        project.setWebsite(projectDto.getWebsite());
        
        // 이미지 목록 설정
        if (projectDto.getImages() != null && !projectDto.getImages().isEmpty()) {
            project.setImages(projectDto.getImages());
        } else {
            project.setImages(new ArrayList<>());
        }
        
        // 날짜 필드 설정 - null 체크 및 기본값
        if (projectDto.getStartDate() != null) {
            project.setStartDate(projectDto.getStartDate().toString());
        } else {
            project.setStartDate(java.time.LocalDate.now().toString());
        }
        
        if (projectDto.getEndDate() != null) {
            project.setEndDate(projectDto.getEndDate().toString());
        } else {
            project.setEndDate(java.time.LocalDate.now().toString());
        }
        
        return project;
    }
    
    // 이미지 저장 helper 메서드
    private String saveImage(MultipartFile file) throws IOException {
        // 파일 저장을 위한 절대 경로 설정
        String userHome = System.getProperty("user.home");
        String uploadDir = userHome + File.separator + "profile-app-uploads" + File.separator + "images";
        
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
        
        // 파일 권한 설정 - 읽기/쓰기 권한 추가
        dest.setReadable(true, false);
        dest.setWritable(true, false);
        
        // 상대 URL 반환 (프론트엔드에서 접근 가능한 URL)
        return "/api/images/" + fileName;
    }
} 