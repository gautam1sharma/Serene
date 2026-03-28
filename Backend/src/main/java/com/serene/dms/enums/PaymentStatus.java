package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum PaymentStatus {
    PENDING("pending"),
    PARTIAL("partial"),
    COMPLETED("completed"),
    REFUNDED("refunded");

    private final String json;

    PaymentStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static PaymentStatus fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (PaymentStatus e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        return PaymentStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}
