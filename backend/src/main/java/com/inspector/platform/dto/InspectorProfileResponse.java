package com.inspector.platform.dto;

import com.inspector.platform.entity.InspectorRank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InspectorProfileResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private InspectorRank rank;
    private String phone;
    private String language;
    
    private ReferenceDto delegation;
    private ReferenceDto dependency;
    private ReferenceDto department;
    private List<ReferenceDto> etablissements;
}
