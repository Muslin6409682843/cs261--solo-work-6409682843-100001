package com.example.backend.repository;

import com.example.backend.model.AddDropForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddDropFormRepository extends JpaRepository<AddDropForm, Long> {
}
