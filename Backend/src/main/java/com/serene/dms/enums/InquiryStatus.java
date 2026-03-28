package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum InquiryStatus {
    PENDING("pending"),
    RESPONDED("responded"),
    CLOSED("closed");

    private final String json;

    InquiryStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static InquiryStatus fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (InquiryStatus e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        return InquiryStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}
