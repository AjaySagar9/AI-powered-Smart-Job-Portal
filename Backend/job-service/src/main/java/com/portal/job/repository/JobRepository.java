package com.portal.job.repository;

import com.portal.job.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByRecruiterId(UUID recruiterId);
    List<Job> findByStatus(String status);
}
