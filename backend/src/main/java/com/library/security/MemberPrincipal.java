package com.library.security;

import com.library.entity.Member;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class MemberPrincipal implements UserDetails {

    private final Long id;
    private final String memberCode;
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public static MemberPrincipal fromMember(Member member) {
        return new MemberPrincipal(
                member.getId(),
                member.getMemberCode(),
                "",
                List.of(new SimpleGrantedAuthority("ROLE_MEMBER"))
        );
    }

    @Override
    public String getUsername() {
        return memberCode;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
