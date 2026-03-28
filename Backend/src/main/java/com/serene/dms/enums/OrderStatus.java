package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum OrderStatus {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    PROCESSING("processing"),
    READY("ready"),
    DELIVERED("delivered"),
    CANCELLED("cancelled");

    private final String json;

    OrderStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static OrderStatus fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (OrderStatus e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        return OrderStatus.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}
