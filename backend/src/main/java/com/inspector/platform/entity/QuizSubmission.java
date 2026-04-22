package com.inspector.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherProfile teacher;

    // JSON string mapping questionId to answer
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String answers;

    private Integer score; // 0-20

    @Column(columnDefinition = "TEXT")
    private String evaluationText;

    @Column(columnDefinition = "TEXT")
    private String trainingSuggestion;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onSubmit() {
        submittedAt = LocalDateTime.now();
    }
}
