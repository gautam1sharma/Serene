package com.serene.dms.seed;

import com.serene.dms.entity.*;
import com.serene.dms.enums.*;
import com.serene.dms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DealershipRepository dealershipRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database with initial data...");
        String encodedPw = passwordEncoder.encode("password123");

        // ── Dealerships ──────────────────────────────────────
        Dealership d1 = dealershipRepository.save(Dealership.builder()
                .name("Serene Motors Mumbai").code("SRN-MUM")
                .street("123 Marine Drive").city("Mumbai").state("Maharashtra").zipCode("400001").country("India")
                .phone("+91-22-1234-5678").email("mumbai@serene.com").status("active").build());

        Dealership d2 = dealershipRepository.save(Dealership.builder()
                .name("Serene Motors Delhi").code("SRN-DEL")
                .street("456 Connaught Place").city("New Delhi").state("Delhi").zipCode("110001").country("India")
                .phone("+91-11-2345-6789").email("delhi@serene.com").status("active").build());

        // ── Users ────────────────────────────────────────────
        User admin = userRepository.save(User.builder()
                .email("admin@serene.com").passwordHash(encodedPw)
                .firstName("System").lastName("Admin").role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE).build());

        User manager = userRepository.save(User.builder()
                .email("manager@serene.com").passwordHash(encodedPw)
                .firstName("Rahul").lastName("Mehta").role(UserRole.MANAGER)
                .status(UserStatus.ACTIVE).dealership(d1).build());

        User dealer = userRepository.save(User.builder()
                .email("dealer@serene.com").passwordHash(encodedPw)
                .firstName("Alex").lastName("Johnson").role(UserRole.DEALER)
                .status(UserStatus.ACTIVE).dealership(d1).build());

        User employee = userRepository.save(User.builder()
                .email("employee@serene.com").passwordHash(encodedPw)
                .firstName("Priya").lastName("Sharma").role(UserRole.EMPLOYEE)
                .status(UserStatus.ACTIVE).dealership(d1).build());

        User customer = userRepository.save(User.builder()
                .email("gautam@serene.com").passwordHash(encodedPw)
                .firstName("Gautam").lastName("Sharma").role(UserRole.CUSTOMER)
                .status(UserStatus.ACTIVE).phone("+91 9876543210").build());

        // Set dealership managers
        d1.setManager(manager);
        dealershipRepository.save(d1);

        // ── Cars ─────────────────────────────────────────────
        carRepository.save(Car.builder()
                .model("Serene Aura").year(2025).category(CarCategory.SUV)
                .price(new BigDecimal("3500000")).status(CarStatus.AVAILABLE)
                .color("Midnight Black").vin("SRN2025AURA00001").engine("2.0L Turbo")
                .transmission("8-Speed DCT").fuelType("Petrol").mileage(0)
                .features("[\"Panoramic Sunroof\",\"Leather Seats\",\"360 Camera\"]")
                .images("[\"https://images.unsplash.com/photo-1544636331-e26879cd4d9b\"]")
                .description("The Serene Aura redefines luxury SUV experiences.")
                .dealership(d1).build());

        carRepository.save(Car.builder()
                .model("Serene Crest").year(2025).category(CarCategory.SEDAN)
                .price(new BigDecimal("2800000")).status(CarStatus.AVAILABLE)
                .color("Pearl White").vin("SRN2025CRST00001").engine("1.6L Turbo")
                .transmission("7-Speed DCT").fuelType("Petrol").mileage(0)
                .features("[\"BOSE Audio\",\"Ventilated Seats\",\"HUD\"]")
                .images("[\"https://images.unsplash.com/photo-1553440569-bcc63803a83d\"]")
                .description("Elegance meets performance in the Serene Crest.")
                .dealership(d1).build());

        carRepository.save(Car.builder()
                .model("Serene Volt").year(2025).category(CarCategory.ELECTRIC)
                .price(new BigDecimal("4500000")).status(CarStatus.AVAILABLE)
                .color("Galactic Silver").vin("SRN2025VOLT00001").engine("Dual Motor AWD")
                .transmission("Single-Speed").fuelType("Electric").mileage(0)
                .features("[\"500km Range\",\"Fast Charging\",\"Autopilot\"]")
                .images("[\"https://images.unsplash.com/photo-1560958089-b8a1929cea89\"]")
                .description("Zero emissions. Maximum thrill.")
                .dealership(d2).build());

        carRepository.save(Car.builder()
                .model("Serene Zenith").year(2025).category(CarCategory.LUXURY)
                .price(new BigDecimal("8500000")).status(CarStatus.AVAILABLE)
                .color("Royal Blue").vin("SRN2025ZNTH00001").engine("3.5L Twin-Turbo V6")
                .transmission("10-Speed Auto").fuelType("Petrol").mileage(0)
                .features("[\"Massage Seats\",\"Starlight Roof\",\"Rear Entertainment\"]")
                .images("[\"https://images.unsplash.com/photo-1503376780353-7e6692767b70\"]")
                .description("The pinnacle of automotive luxury.")
                .dealership(d2).build());

        carRepository.save(Car.builder()
                .model("Serene Breeze").year(2025).category(CarCategory.HATCHBACK)
                .price(new BigDecimal("1200000")).status(CarStatus.AVAILABLE)
                .color("Coral Red").vin("SRN2025BRZZ00001").engine("1.2L NA")
                .transmission("CVT").fuelType("Petrol").mileage(0)
                .features("[\"Touchscreen\",\"Apple CarPlay\",\"Rear Cam\"]")
                .images("[\"https://images.unsplash.com/photo-1549317661-bd32c8ce0afa\"]")
                .description("Compact. Fun. Affordable.")
                .dealership(d1).build());

        carRepository.save(Car.builder()
                .model("Serene Horizon").year(2025).category(CarCategory.HYBRID)
                .price(new BigDecimal("3200000")).status(CarStatus.AVAILABLE)
                .color("Forest Green").vin("SRN2025HRZN00001").engine("2.0L Hybrid")
                .transmission("E-CVT").fuelType("Hybrid").mileage(0)
                .features("[\"Eco Mode\",\"Regen Braking\",\"Wireless Charging\"]")
                .images("[\"https://images.unsplash.com/photo-1580273916550-e323be2ae537\"]")
                .description("The best of both worlds.")
                .dealership(d2).build());

        log.info("Database seeded successfully! Users: {}, Dealerships: {}, Cars: {}",
                userRepository.count(), dealershipRepository.count(), carRepository.count());
    }
}
