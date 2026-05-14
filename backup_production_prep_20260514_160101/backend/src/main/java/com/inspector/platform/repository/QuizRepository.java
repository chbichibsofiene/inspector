package com.inspector.platform.repository;

import com.inspector.platform.entity.Quiz;
import com.inspector.platform.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findBySubject(Subject subject);
    List<Quiz> findByInspectorUserId(Long userId);
}
