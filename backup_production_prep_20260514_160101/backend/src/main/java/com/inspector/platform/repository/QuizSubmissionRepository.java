package com.inspector.platform.repository;

import com.inspector.platform.entity.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    List<QuizSubmission> findByQuizId(Long quizId);
    List<QuizSubmission> findByTeacherUserId(Long userId);
    Optional<QuizSubmission> findByQuizIdAndTeacherUserId(Long quizId, Long userId);
}
