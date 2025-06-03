package com.profile.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    private static final Logger logger = Logger.getLogger(ImageController.class.getName());
    
    @Value("${app.upload.image-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body("Invalid file name");
            }

            // 디렉토리 확인 및 생성
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                boolean created = directory.mkdirs();
                if (!created) {
                    logger.severe("Failed to create upload directory: " + uploadDir);
                    return ResponseEntity.internalServerError().body("Failed to create upload directory");
                }
            }

            // 파일명 생성
            String fileName = System.currentTimeMillis() + "_" + originalFilename.replaceAll("\\s+", "_");
            String filePath = uploadDir + File.separator + fileName;

            // 파일 저장
            File dest = new File(filePath);
            file.transferTo(dest);
            logger.info("파일 저장 완료: " + filePath);

            // 파일 권한 설정
            dest.setReadable(true, false);
            dest.setWritable(true, false);

            // API URL 생성
            String fileUrl = "/api/images/" + fileName;
            
            // 성공 응답 반환 (JSON 객체로 반환)
            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("fileUrl", fileUrl);
            response.put("originalName", originalFilename);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.severe("Error uploading file: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            logger.info("이미지 요청 받음: " + fileName);
            logger.info("이미지 경로: " + uploadDir);
            
            String filePath = uploadDir + File.separator + fileName;
            Path path = Paths.get(filePath);
            
            if (!Files.exists(path)) {
                logger.warning("File not found: " + filePath);
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(path.toFile());
            String contentType = determineContentType(fileName);
            
            logger.info("이미지 찾음: " + filePath + ", ContentType: " + contentType);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            logger.severe("Error serving file " + fileName + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineContentType(String fileName) {
        try {
            String contentType = Files.probeContentType(Paths.get(fileName));
            if (contentType == null) {
                if (fileName.toLowerCase().endsWith(".svg")) {
                    return "image/svg+xml";
                }
                return "application/octet-stream";
            }
            return contentType;
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
} 