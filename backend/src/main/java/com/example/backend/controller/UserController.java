package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // React port
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/save")
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        System.out.println("[DEBUG] Saving user:");
        System.out.println("  username = " + user.getUsername());
        System.out.println("  faculty = " + user.getFaculty());
        System.out.println("  department = " + user.getDepartment());
        System.out.println("  type = " + user.getType());

        User saved = userRepository.save(user); // ✅ Hibernate จะสร้าง id ให้อัตโนมัติ
        System.out.println("[DEBUG] Saved user ID = " + saved.getId());

        return ResponseEntity.ok(saved);
    }
}
