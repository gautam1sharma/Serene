package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum CarStatus {
    AVAILABLE("available"),
    SOLD("sold"),
    RESERVED("reserved"),
    IN_TRANSIT("in_transit"),
    MAINTENANCE("maintenance");

    private final String json;

    CarStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static CarStatus fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (CarStatus e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        String upper = raw.trim().toUpperCase(Locale.ROOT).replace("-", "_");
        return CarStatus.valueOf(upper);
    }
}
