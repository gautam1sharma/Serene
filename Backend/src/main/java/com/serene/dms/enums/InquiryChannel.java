package com.serene.dms.enums;

public enum InquiryChannel {
    WEBSITE,
    WALK_IN,
    MOBILE_APP,
    EMAIL,
    PHONE,
    SOCIAL_MEDIA,
    REFERRAL,
    SEARCH_ADS,
    OTHER;

    public static InquiryChannel fromApi(String value) {
        if (value == null) return OTHER;
        try {
            return InquiryChannel.valueOf(value.toUpperCase().replace("-", "_").replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return OTHER;
        }
    }
}
