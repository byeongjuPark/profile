package com.profile.backend.repository;

import com.profile.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // 기본 CRUD 메서드는 JpaRepository에서 제공
    // 필요한 경우 추가 쿼리 메서드를 여기에 정의
} 