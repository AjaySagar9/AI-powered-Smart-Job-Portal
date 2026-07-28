package com.portal.ai.service.impl;

import com.portal.ai.service.AiService;
import org.springframework.stereotype.Service;
// import org.springframework.ai.chat.ChatClient;
// import lombok.RequiredArgsConstructor;

@Service
// @RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    // private final ChatClient chatClient;

    @Override
    public String analyzeResume(String resumeText) {
        // Mock implementation to avoid requiring valid API keys for scaffolding
        return "Based on your resume, you have strong backend engineering skills.";
        // return chatClient.call("Summarize the following resume and list key skills: " + resumeText);
    }

    @Override
    public int calculateAtsScore(String resumeText, String jobDescription) {
        // Mock implementation
        return 85;
    }

    @Override
    public String generateCoverLetter(String resumeText, String jobDescription) {
        // Mock implementation
        return "Dear Hiring Manager,\n\nI am writing to express my interest in the position...\n\nSincerely,\nCandidate";
    }
}
