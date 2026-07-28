package com.portal.ai.controller;

import com.portal.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/resume-analyze")
    public ResponseEntity<Map<String, String>> analyzeResume(@RequestBody Map<String, String> request) {
        String analysis = aiService.analyzeResume(request.get("resumeText"));
        return ResponseEntity.ok(Map.of("analysis", analysis));
    }

    @PostMapping("/ats-score")
    public ResponseEntity<Map<String, Integer>> calculateAtsScore(@RequestBody Map<String, String> request) {
        int score = aiService.calculateAtsScore(request.get("resumeText"), request.get("jobDescription"));
        return ResponseEntity.ok(Map.of("atsScore", score));
    }

    @PostMapping("/cover-letter")
    public ResponseEntity<Map<String, String>> generateCoverLetter(@RequestBody Map<String, String> request) {
        String coverLetter = aiService.generateCoverLetter(request.get("resumeText"), request.get("jobDescription"));
        return ResponseEntity.ok(Map.of("coverLetter", coverLetter));
    }
}
