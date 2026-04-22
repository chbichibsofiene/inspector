package com.inspector.platform.dto;

import com.inspector.platform.entity.InspectorRank;
import com.inspector.platform.entity.SchoolLevel;
import com.inspector.platform.entity.Subject;
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

    @NotNull(message = "Subject is required")
    private Subject subject;

    @NotNull(message = "School level is required")
    private SchoolLevel schoolLevel;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Language is required")
    private String language;

    @NotEmpty(message = "At least one delegation is required")
    private List<Long> delegationIds;

    @NotEmpty(message = "At least one dependency is required")
    private List<Long> dependencyIds;

    @NotEmpty(message = "At least one department is required")
    private List<Long> departmentIds;

    @NotEmpty(message = "At least one etablissement is required")
    private List<Long> etablissementIds;
}
