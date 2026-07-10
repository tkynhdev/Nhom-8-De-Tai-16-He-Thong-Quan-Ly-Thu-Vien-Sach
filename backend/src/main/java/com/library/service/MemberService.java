package com.library.service;

import com.library.dto.MemberRequest;
import com.library.dto.MemberResponse;

import java.util.List;

public interface MemberService {
    List<MemberResponse> getAllMembers();
    MemberResponse createMember(MemberRequest request);
    MemberResponse updateMember(Long id, MemberRequest request);
    void deleteMember(Long id);
    MemberResponse updateProfile(Long id, MemberRequest request);
}
