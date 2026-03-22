package com.serene.dms.dto.response;

import lombok.*;

import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaginatedResponse<T> {
    private List<T> data;
    private long total;
    private int page;
    private int limit;
    private int totalPages;
}
