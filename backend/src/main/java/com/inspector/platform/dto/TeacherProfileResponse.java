package com.inspector.platform.dto;

import com.inspector.platform.entity.Subject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String serialCode;
    private Subject subject;
    
    private ReferenceDto delegation;
    private ReferenceDto dependency;
    private EtablissementDto etablissement;
}
