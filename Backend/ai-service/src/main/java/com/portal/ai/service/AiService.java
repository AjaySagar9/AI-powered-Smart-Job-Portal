package com.portal.ai.service;

public interface AiService {
    String analyzeResume(String resumeText);
    int calculateAtsScore(String resumeText, String jobDescription);
    String generateCoverLetter(String resumeText, String jobDescription);
}
