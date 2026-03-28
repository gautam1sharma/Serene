package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum CarCategory {
    SUV("suv"),
    SEDAN("sedan"),
    HATCHBACK("hatchback"),
    ELECTRIC("electric"),
    HYBRID("hybrid"),
    LUXURY("luxury");

    private final String json;

    CarCategory(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static CarCategory fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (CarCategory e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        return CarCategory.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}
