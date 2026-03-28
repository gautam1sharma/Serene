package com.serene.dms.config;

import com.serene.dms.enums.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(String.class, CarCategory.class, CarCategory::fromApi);
        registry.addConverter(String.class, CarStatus.class, CarStatus::fromApi);
        registry.addConverter(String.class, InquiryStatus.class, InquiryStatus::fromApi);
        registry.addConverter(String.class, UserRole.class, UserRole::fromApi);
        registry.addConverter(String.class, UserStatus.class, UserStatus::fromApi);
        registry.addConverter(String.class, TestDriveStatus.class, TestDriveStatus::fromApi);
        registry.addConverter(String.class, OrderStatus.class, OrderStatus::fromApi);
        registry.addConverter(String.class, PaymentStatus.class, PaymentStatus::fromApi);
        registry.addConverter(String.class, NotificationType.class, NotificationType::fromApi);
    }
}
