package com.portal.application.controller;

import com.portal.application.entity.Application;
import com.portal.application.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable UUID jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Application>> getCandidateApplications(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(applicationRepository.findByCandidateId(candidateId));
    }

    @PostMapping
    public ResponseEntity<Application> apply(@RequestBody Application application) {
        application.setStatus("APPLIED");
        return ResponseEntity.ok(applicationRepository.save(application));
    }
}
