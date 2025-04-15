package com.profile.backend.repository;

import com.profile.backend.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    // 추가적인 쿼리 메서드가 필요하다면 여기에 정의
} 