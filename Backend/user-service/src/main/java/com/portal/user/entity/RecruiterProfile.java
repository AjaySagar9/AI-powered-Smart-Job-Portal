package com.portal.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "recruiter_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    private String firstName;
    private String lastName;
    
    @Column(nullable = false)
    private String companyName;
    
    private String designation;
    
    @Column(columnDefinition = "TEXT")
    private String companyDescription;
    
    private String companyWebsite;
}
