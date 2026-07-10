package com.library.dto;

import lombok.Builder;
import lombok.Value;

/**
 * Member activity row for report summaries.
 */
@Value
@Builder
public class MemberActivityResponse {
    String memberCode;
    String fullName;
    Long loanCount;
}
