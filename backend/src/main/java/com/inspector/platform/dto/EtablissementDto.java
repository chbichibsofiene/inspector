package com.inspector.platform.dto;

import com.inspector.platform.entity.SchoolLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtablissementDto {
    private Long id;
    private String name;
    private SchoolLevel schoolLevel;
}
