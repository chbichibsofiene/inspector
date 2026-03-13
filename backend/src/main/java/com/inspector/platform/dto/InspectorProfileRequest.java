package com.inspector.platform.dto;

import com.inspector.platform.entity.InspectorRank;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class InspectorProfileRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Rank is required")
    private InspectorRank rank;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Delegation is required")
    private Long delegationId;

    @NotNull(message = "Dependency is required")
    private Long dependencyId;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotEmpty(message = "At least one etablissement is required")
    private List<Long> etablissementIds;
}
