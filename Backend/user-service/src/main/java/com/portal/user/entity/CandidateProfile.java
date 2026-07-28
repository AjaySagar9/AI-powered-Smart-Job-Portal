package com.portal.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    private String firstName;
    private String lastName;
    private String headline;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    
    private Integer profileCompletionPct = 0;
}
