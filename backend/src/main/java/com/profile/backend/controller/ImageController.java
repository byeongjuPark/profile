package com.profile.backend.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    private static final Logger logger = Logger.getLogger(ImageController.class.getName());

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        // 사용자 홈 디렉토리 기반 이미지 저장 위치
        String userHome = System.getProperty("user.home");
        String imagePath = userHome + File.separator + "profile-app-uploads" + File.separator + "images" + File.separator + fileName;
        
        logger.info("Attempting to retrieve image: " + imagePath);
        
        try {
            // 파일이 존재하는지 확인
            Path path = Paths.get(imagePath);
            if (!Files.exists(path)) {
                logger.warning("File not found: " + imagePath);
                return ResponseEntity.notFound().build();
            }
            
            logger.info("File found: " + imagePath);
            
            // 파일 리소스 생성
            Resource resource = new FileSystemResource(path.toFile());
            
            // 컨텐츠 타입 결정
            String contentType = Files.probeContentType(path);
            
            // SVG 파일 처리
            if (fileName.toLowerCase().endsWith(".svg")) {
                contentType = "image/svg+xml";
            } 
            // 기본 컨텐츠 타입
            else if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            logger.info("Content type for " + fileName + ": " + contentType);
            
            // 응답 헤더 설정
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
                    
        } catch (IOException e) {
            logger.severe("Error serving file " + fileName + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
} 