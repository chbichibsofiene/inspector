package com.inspector.platform.dto;

import com.inspector.platform.entity.Subject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TeacherProfileRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Subject is required")
    private Subject subject;

    @NotNull(message = "Delegation is required")
    private Long delegationId;

    @NotNull(message = "Dependency is required")
    private Long dependencyId;

    @NotNull(message = "Etablissement is required")
    private Long etablissementId;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Language is required")
    private String language;
}
