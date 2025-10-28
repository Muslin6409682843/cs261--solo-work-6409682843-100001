package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ✅ สร้างอัตโนมัติใน DB

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "display_name_th") // ✅ ใส่ชื่อคอลัมน์ชัดเจน
    private String displayNameTh;

    @Column(name = "display_name_en")
    private String displayNameEn;

    private String email;
    private String faculty;
    private String department;
    private String type;

    // ✅ Getters / Setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayNameTh() {
        return displayNameTh;
    }

    public void setDisplayNameTh(String displayNameTh) {
        this.displayNameTh = displayNameTh;
    }

    public String getDisplayNameEn() {
        return displayNameEn;
    }

    public void setDisplayNameEn(String displayNameEn) {
        this.displayNameEn = displayNameEn;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
