package com.portal.application.repository;

import com.portal.application.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByJobId(UUID jobId);
    List<Application> findByCandidateId(UUID candidateId);
}
