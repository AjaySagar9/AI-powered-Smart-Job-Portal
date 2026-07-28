package com.portal.resume.controller;

import com.portal.resume.entity.Resume;
import com.portal.resume.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeRepository resumeRepository;

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Resume>> getCandidateResumes(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(resumeRepository.findByCandidateId(candidateId));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file,
                                               @RequestParam("candidateId") UUID candidateId) {
        // Mock S3 upload implementation for scaffolding
        return ResponseEntity.ok("Resume uploaded successfully to S3 mockup");
    }
}
