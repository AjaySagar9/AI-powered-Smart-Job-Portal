package com.portal.auth.service;

import com.portal.auth.dto.AuthResponse;
import com.portal.auth.dto.LoginRequest;
import com.portal.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
