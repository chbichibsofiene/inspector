package com.inspector.platform.service;

import com.inspector.platform.dto.UserDto;
import com.inspector.platform.dto.RegionDto;
import com.inspector.platform.dto.DelegationDto;
import com.inspector.platform.entity.Role;

import java.util.List;

public interface AdminService {

    
    List<UserDto> getAllUsers();

    
    List<RegionDto> getRegions();
    List<DelegationDto> getDelegationsByRegion(Long regionId);
    List<DelegationDto> getAllDelegations();
}
