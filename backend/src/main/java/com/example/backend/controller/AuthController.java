package com.example.backend.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    // URL ของ TU API login
    private final String TU_API_URL = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify";
    private final String TU_PROFILE_URL = "https://restapi.tu.ac.th/api/v2/profile/std/info/?id=";
    private final String APPLICATION_KEY = "TUa4eb23f2d27e28f6790899278076889f4f33907c6389139141b2735e8e93aad6f3d60bd57e7bfbe332a0849f097362a2";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", false,
                    "error", "Username or password is missing"));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Application-Key", APPLICATION_KEY);

            Map<String, String> body = Map.of(
                    "UserName", username,
                    "PassWord", password);

            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(TU_API_URL, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = response.getBody();

                System.out.println("🟢 [DEBUG] TU Login API Response: " + data);

                Boolean status = (Boolean) data.get("status");
                if (status != null && status) {
                    // ✅ ดึง username จาก key ที่ถูกต้อง
                    String studentId = (String) data.get("username");

                    System.out.println("🟢 [DEBUG] Saving studentId in session: " + studentId);
                    session.setAttribute("studentId", studentId);

                    return ResponseEntity.ok(Map.of(
                            "status", true,
                            "studentId", studentId,
                            "displayname_th", data.get("displayname_th"),
                            "faculty", data.get("faculty"),
                            "department", data.get("department")));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("status", false, "error", "Login failed"));
                }

            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("status", false, "error", "Invalid response from TU API"));
            }

        } catch (Exception e) {
            System.out.println("🔴 [EXCEPTION LOGIN] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/student/info")
    public ResponseEntity<?> getStudentInfo(HttpSession session) {
        String studentId = (String) session.getAttribute("studentId");
        System.out.println("🟡 [DEBUG] Student ID in session: " + studentId);

        if (studentId == null) {
            System.out.println("🔴 [ERROR] No studentId found in session");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No studentId found. Please login first."));
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.set("Application-Key", APPLICATION_KEY);

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            System.out.println("🟢 [DEBUG] Calling TU API: " + TU_PROFILE_URL + studentId);

            ResponseEntity<Map> response = restTemplate.exchange(
                    TU_PROFILE_URL + studentId,
                    HttpMethod.GET,
                    entity,
                    Map.class);

            System.out.println("🟢 [DEBUG] TU API Response: " + response);

            Map<String, Object> body = response.getBody();
            if (body == null || body.get("data") == null) {
                System.out.println("🔴 [ERROR] Student data not found in TU API response");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Student data not found"));
            }

            Map<String, Object> data = (Map<String, Object>) body.get("data");
            return ResponseEntity.ok(Map.of(
                    "userName", data.get("userName"),
                    "displayname_th", data.get("displayname_th"),
                    "faculty", data.get("faculty"),
                    "department", data.get("department")));

        } catch (Exception e) {
            System.out.println("🔴 [EXCEPTION] " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Exception: " + e.getMessage()));
        }
    }

    // Logout (ล้าง session)
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("status", true, "message", "Logged out successfully"));
    }
}
