package com.example.backend.controller;

import com.example.backend.model.AddDropForm;
import com.example.backend.repository.AddDropFormRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/form")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FormController {

    @Autowired
    private AddDropFormRepository addDropFormRepository;

    @PostMapping("/add-drop")
    public ResponseEntity<String> submitAddDropForm(@RequestBody AddDropForm form) {
        System.out.println("[DEBUG] Saving form from studentId: " + form.getStudentId());
        addDropFormRepository.save(form);
        return ResponseEntity.ok("บันทึกคำร้องสำเร็จ");
    }
}
