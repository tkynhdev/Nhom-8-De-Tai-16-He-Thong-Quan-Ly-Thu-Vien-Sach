package com.library.service.impl;

import com.library.dto.MemberRequest;
import com.library.dto.MemberResponse;
import com.library.entity.Member;
import com.library.exception.BusinessRuleException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.MemberRepository;
import com.library.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    @Override
    public List<MemberResponse> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public MemberResponse createMember(MemberRequest request) {
        if (memberRepository.findByMemberCode(request.getMemberCode()).isPresent()) {
            throw new BusinessRuleException("Member code already exists");
        }
        
        Member member = Member.builder()
                .memberCode(request.getMemberCode())
                .fullName(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(request.getRole())
                .cardType(request.getCardType())
                .cardExpiryDate(request.getCardExpiryDate())
                .build();
                
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
                
        member.setFullName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setRole(request.getRole());
        member.setCardType(request.getCardType());
        member.setCardExpiryDate(request.getCardExpiryDate());
        
        return mapToResponse(memberRepository.save(member));
    }

    @Override
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found");
        }
        memberRepository.deleteById(id);
    }

    @Override
    public MemberResponse updateProfile(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
                
        member.setFullName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        
        return mapToResponse(memberRepository.save(member));
    }

    private MemberResponse mapToResponse(Member member) {
        String status = "ACTIVE";
        if (member.getCardExpiryDate() != null && member.getCardExpiryDate().isBefore(LocalDate.now())) {
            status = "EXPIRED";
        }
        
        return MemberResponse.builder()
                .id(member.getId())
                .memberCode(member.getMemberCode())
                .name(member.getFullName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .role(member.getRole())
                .cardType(member.getCardType())
                .cardExpiryDate(member.getCardExpiryDate())
                .status(status)
                .build();
    }
}
