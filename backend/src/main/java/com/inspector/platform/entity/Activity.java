package com.inspector.platform.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "inspector_user_id", nullable = false)
    private User inspector;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Column(nullable = false)
    private LocalDateTime endDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityType type;

    @Column(length = 200)
    private String location;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "activity_guests",
            joinColumns = @JoinColumn(name = "activity_id"),
            inverseJoinColumns = @JoinColumn(name = "teacher_profile_id")
    )
    @Builder.Default
    private List<TeacherProfile> guests = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private boolean isOnline = false;

    @Column(length = 1000)
    private String meetingUrl;

    @Column(nullable = false)
    @Builder.Default
    private boolean isReminderSent = false;
}
