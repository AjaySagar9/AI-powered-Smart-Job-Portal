process.env.NODE_ENV = 'test';
import app from './src/app';
import { Server } from 'http';

const PORT = 5001;

async function runTests() {
  console.log('--- STARTING PHASE 1 VERIFICATION TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`, detail || '');
      failed++;
    }
  }

  const BASE_URL = `http://localhost:${PORT}/api`;

  // Start temporary server on port 5001
  const server: Server = app.listen(PORT);

  // Helper request
  async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json };
  }

  try {
    // 1. Health Check
    const health = await fetch(`http://localhost:${PORT}/health`);
    assert(health.status === 200, 'Health check returns 200');

    // 2. Validation error on invalid candidate registration
    const invalidReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email', password: '123' }),
    });
    assert(invalidReg.status === 400 && invalidReg.data.code === 'VALIDATION_ERROR', 'Invalid candidate registration returns 400 VALIDATION_ERROR');

    // 3. Candidate Registration
    const testEmail = `candidate_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Candidate',
        email: testEmail,
        password: 'password123',
      }),
    });
    assert(regRes.status === 201 && regRes.data.data.user.role === 'CANDIDATE', 'Candidate registration succeeds (201, Role CANDIDATE)');
    const candidateToken = regRes.data.data?.accessToken;
    const candidateRefreshToken = regRes.data.data?.refreshToken;

    // 4. Duplicate Registration
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Candidate',
        email: testEmail,
        password: 'password123',
      }),
    });
    assert(dupRes.status === 409 && dupRes.data.code === 'CONFLICT_ERROR', 'Duplicate registration returns 409 CONFLICT_ERROR');

    // 5. Invalid Login credentials
    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongpassword',
      }),
    });
    assert(badLogin.status === 401 && badLogin.data.code === 'UNAUTHORIZED_ERROR', 'Wrong password returns 401 UNAUTHORIZED_ERROR');

    // 6. Candidate Login
    const candLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    assert(candLogin.status === 200 && candLogin.data.data.user.email === testEmail, 'Candidate login succeeds (200, returns user & tokens)');

    // 7. Recruiter Registration
    const recruiterEmail = `recruiter_${Date.now()}@company.com`;
    const recRegRes = await request('/auth/register-recruiter', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Recruiter',
        email: recruiterEmail,
        password: 'password123',
        companyName: 'Acme Corp',
      }),
    });
    assert(recRegRes.status === 201 && recRegRes.data.data.user.role === 'RECRUITER', 'Recruiter registration succeeds (201, Role RECRUITER)');

    // 8. Admin Login (from seeded database)
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@jobportal.local',
        password: 'admin123',
      }),
    });
    assert(adminLogin.status === 200 && adminLogin.data.data.user.role === 'ADMIN', 'Admin login with seeded credentials succeeds (200, Role ADMIN)');

    // 9. Protected route with and without JWT
    const noAuthRes = await request('/auth/me');
    assert(noAuthRes.status === 401 && noAuthRes.data.code === 'UNAUTHORIZED', 'Accessing /auth/me without token returns 401 UNAUTHORIZED');

    const authRes = await request('/auth/me', {
      headers: { Authorization: `Bearer ${candidateToken}` },
    });
    assert(authRes.status === 200 && authRes.data.data.user.email === testEmail, 'Accessing /auth/me with valid Bearer token returns 200 + user profile');

    // 10. Refresh Token flow
    const refreshRes = await request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: candidateRefreshToken }),
    });
    assert(refreshRes.status === 200 && !!refreshRes.data.data.accessToken, 'Token refresh flow returns new access & refresh tokens');

    // 11. Forgot Password & Reset Password
    const forgotRes = await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail }),
    });
    const resetToken = forgotRes.data.data?.resetToken;
    assert(forgotRes.status === 200 && !!resetToken, 'Forgot password returns resetToken');

    const resetRes = await request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        token: resetToken,
        password: 'newpassword456',
      }),
    });
    assert(resetRes.status === 200, 'Reset password succeeds (200)');

    // Verify login with new password
    const newPassLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: 'newpassword456',
      }),
    });
    assert(newPassLogin.status === 200, 'Login with newly reset password succeeds (200)');

    // 12. Logout
    const logoutRes = await request('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${newPassLogin.data.data.accessToken}` },
    });
    assert(logoutRes.status === 200, 'Logout succeeds (200)');

    // 13. Role-Based Authorization Tests
    // Candidate cannot access Recruiter-only endpoint (POST /api/jobs)
    const candidateJobsAttempt = await request('/jobs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${candidateToken}` },
      body: JSON.stringify({ title: 'Hacked Job', description: 'Unauthorized' }),
    });
    assert(candidateJobsAttempt.status === 403 && candidateJobsAttempt.data.code === 'FORBIDDEN', 'Candidate cannot access recruiter endpoints (returns 403 FORBIDDEN)');

    // Recruiter cannot access Candidate-only endpoint (GET /api/resumes)
    const recruiterToken = recRegRes.data.data?.accessToken;
    const recruiterResumeAttempt = await request('/resumes', {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    assert(recruiterResumeAttempt.status === 403 && recruiterResumeAttempt.data.code === 'FORBIDDEN', 'Recruiter cannot access candidate endpoints (returns 403 FORBIDDEN)');

    console.log(`\n--- TEST RESULTS: ${passed} PASSED, ${failed} FAILED ---`);
  } catch (error) {
    console.error('Unexpected error during tests:', error);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
