package com.serene.dms.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;

public enum UserRole {
    CUSTOMER("customer"),
    EMPLOYEE("employee"),
    DEALER("dealer"),
    MANAGER("manager"),
    ADMIN("admin");

    private final String json;

    UserRole(String json) {
        this.json = json;
    }

    @JsonValue
    public String getJson() {
        return json;
    }

    @JsonCreator
    public static UserRole fromApi(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim().toLowerCase(Locale.ROOT);
        for (UserRole e : values()) {
            if (e.json.equals(s)) {
                return e;
            }
        }
        return UserRole.valueOf(raw.trim().toUpperCase(Locale.ROOT));
    }
}
