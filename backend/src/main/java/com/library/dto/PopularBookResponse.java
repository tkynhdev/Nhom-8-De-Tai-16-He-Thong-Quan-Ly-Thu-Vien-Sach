package com.library.dto;

import lombok.Builder;
import lombok.Value;

/**
 * Popular book row used by the reporting chart.
 */
@Value
@Builder
public class PopularBookResponse {
    String title;
    Long borrowCount;
}
