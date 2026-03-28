package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum TestDriveStatus {
    PENDING("pending"),
    CONFIRMED("confirmed"),
    COMPLETED("completed"),
    CANCELLED("cancelled"),
    NO_SHOW("no_show");

    private final String json;

    TestDriveStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static TestDriveStatus fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (TestDriveStatus e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        String upper = raw.trim().toUpperCase(Locale.ROOT).replace("-", "_");
        return TestDriveStatus.valueOf(upper);
    }
}
