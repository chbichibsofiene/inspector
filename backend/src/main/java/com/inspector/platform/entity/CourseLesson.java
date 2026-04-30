package com.inspector.platform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "course_lessons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LessonType type;

    @Column(columnDefinition = "TEXT")
    private String contentUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Duration in minutes (for videos/PDFs)
    @Column
    private Integer durationMinutes;

    @Column(nullable = false)
    @Builder.Default
    private Integer orderIndex = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;
}
