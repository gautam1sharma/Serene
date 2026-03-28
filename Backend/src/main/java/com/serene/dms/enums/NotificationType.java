package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum NotificationType {
    INQUIRY("inquiry"),
    TEST_DRIVE("test_drive"),
    ORDER("order"),
    SYSTEM("system"),
    ALERT("alert");

    private final String json;

    NotificationType(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static NotificationType fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (NotificationType e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        String upper = raw.trim().toUpperCase(Locale.ROOT).replace("-", "_");
        return NotificationType.valueOf(upper);
    }
}
