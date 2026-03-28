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
    private final OrderRepository orderRepository;
    private final InquiryRepository inquiryRepository;
    private final TestDriveRepository testDriveRepository;
    
    
    @Override
    public void run(String... args) {
        // Always ensure deterministic demo accounts exist (idempotent by email)
        String encodedPw = passwordEncoder.encode("password123");
        if (userRepository.findByEmail("admin@serene.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("admin@serene.com").passwordHash(encodedPw)
                    .firstName("Admin").lastName("Serene")
                    .role(UserRole.ADMIN).status(UserStatus.ACTIVE)
                    .phone("+91 9000000000").build());
        }
        if (userRepository.findByEmail("manager@serene.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("manager@serene.com").passwordHash(encodedPw)
                    .firstName("Rahul").lastName("Sharma")
                    .role(UserRole.MANAGER).status(UserStatus.ACTIVE)
                    .phone("+91 9000000001").build());
        }
        if (userRepository.findByEmail("dealer@serene.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("dealer@serene.com").passwordHash(encodedPw)
                    .firstName("Priya").lastName("Singh")
                    .role(UserRole.DEALER).status(UserStatus.ACTIVE)
                    .phone("+91 9000000002").build());
        }
        if (userRepository.findByEmail("employee@serene.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("employee@serene.com").passwordHash(encodedPw)
                    .firstName("Arjun").lastName("Patel")
                    .role(UserRole.EMPLOYEE).status(UserStatus.ACTIVE)
                    .phone("+91 9000000003").build());
        }
        if (userRepository.findByEmail("customer@serene.com").isEmpty()) {
            userRepository.save(User.builder()
                    .email("customer@serene.com").passwordHash(encodedPw)
                    .firstName("Gautam").lastName("Sharma")
                    .role(UserRole.CUSTOMER).status(UserStatus.ACTIVE)
                    .phone("+91 9876543210").build());
        }

        if (userRepository.count() > 20) {
            log.info("Users already seeded, skipping bulk user seeding...");
            seedCars();
            seedOrdersAndInquiries();
            seedTestDrives();
            return;
        }

        log.info("Seeding Indian Managers, Dealers, and Customers...");


        String[] firstNames = {"Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Siddharth", "Rohan", "Rahul", "Karan", "Gautam", 
            "Diya", "Ananya", "Ishita", "Sneha", "Kavya", "Neha", "Priya", "Riya", "Ayesha", "Meera"};
        String[] lastNames = {"Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Chopra", "Joshi", "Bansal"};
        String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat"};
        
        java.util.Random rnd = new java.util.Random();
        
        java.util.List<User> managers = new java.util.ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            User m = User.builder()
                    .email("manager" + i + "@serene.in")
                    .passwordHash(encodedPw)
                    .firstName(firstNames[rnd.nextInt(firstNames.length)])
                    .lastName(lastNames[rnd.nextInt(lastNames.length)])
                    .role(UserRole.MANAGER)
                    .status(UserStatus.ACTIVE)
                    .phone("+91" + (9000000000L + rnd.nextInt(999999999)))
                    .build();
            managers.add(userRepository.save(m));
        }

        int[] counts = {3, 3, 4};
        int dCount = 1;
        for (int i = 0; i < managers.size(); i++) {
            User m = managers.get(i);
            int num = counts[i];
            for (int k = 0; k < num; k++) {
                String city = cities[dCount % cities.length];
                Dealership d = dealershipRepository.save(Dealership.builder()
                        .name("Serene " + city + " Branch " + dCount)
                        .code("IND-" + (1000 + dCount))
                        .street("Avenue " + dCount)
                        .city(city)
                        .state("State " + (i+1))
                        .zipCode("10000" + dCount)
                        .country("India")
                        .phone("+91" + (8000000000L + rnd.nextInt(999999999)))
                        .email("dealership" + dCount + "@serene.in")
                        .status("active")
                        .manager(m)
                        .build());
                
                // Add 1 Dealer (Employee) mapped to this Dealership
                userRepository.save(User.builder()
                        .email("dealer" + dCount + "@serene.in")
                        .passwordHash(encodedPw)
                        .firstName(firstNames[rnd.nextInt(firstNames.length)])
                        .lastName(lastNames[rnd.nextInt(lastNames.length)])
                        .role(UserRole.DEALER)
                        .status(UserStatus.ACTIVE)
                        .dealership(d)
                        .phone("+91" + (7000000000L + rnd.nextInt(999999999)))
                        .build());
                dCount++;
            }
        }

        for (int i = 1; i <= 50; i++) {
            userRepository.save(User.builder()
                    .email("customer" + i + "@serene.in")
                    .passwordHash(encodedPw)
                    .firstName(firstNames[rnd.nextInt(firstNames.length)])
                    .lastName(lastNames[rnd.nextInt(lastNames.length)])
                    .role(UserRole.CUSTOMER)
                    .status(UserStatus.ACTIVE)
                    .phone("+91" + (6000000000L + rnd.nextInt(999999999)))
                    .build());
        }
        log.info("Database seeding complete with Indian dataset.");
        seedCars();
        seedOrdersAndInquiries();
        seedTestDrives();
    }

    private void seedCars() {
        if (carRepository.count() > 0) {
            log.info("Cars already seeded, skipping...");
            return;
        }

        java.util.List<Dealership> dealerships = dealershipRepository.findAll();
        if (dealerships.isEmpty()) {
            log.warn("No dealerships found, cannot seed cars");
            return;
        }

        log.info("Seeding cars...");
        java.util.Random rnd = new java.util.Random();
        String[][] cars = {
            {"Tata Nexon",      "suv",       "1200000", "Petrol 1.2L Turbo",   "Manual",    "petrol"},
            {"Tata Nexon EV",   "electric",  "1500000", "Electric 30.2 kWh",   "Automatic", "electric"},
            {"Tata Harrier",    "suv",       "1800000", "Diesel 2.0L Kryotec", "Manual",    "diesel"},
            {"Tata Safari",     "suv",       "2100000", "Diesel 2.0L Kryotec", "Automatic", "diesel"},
            {"Tata Punch",      "hatchback", "700000",  "Petrol 1.2L",         "Manual",    "petrol"},
            {"Tata Curvv EV",   "electric",  "1800000", "Electric 55 kWh",     "Automatic", "electric"},
            {"Hyundai Creta",   "suv",       "1600000", "Petrol 1.5L",         "Automatic", "petrol"},
            {"Hyundai i20",     "hatchback", "900000",  "Petrol 1.2L",         "Manual",    "petrol"},
            {"Hyundai Verna",   "sedan",     "1300000", "Petrol 1.5L Turbo",   "Automatic", "petrol"},
            {"Hyundai Ioniq 5", "electric",  "4500000", "Electric 72.6 kWh",   "Automatic", "electric"},
            {"Hyundai Tucson",  "suv",       "3200000", "Diesel 2.0L",         "Automatic", "diesel"},
            {"Mahindra XUV700", "suv",       "2200000", "Diesel 2.2L mHawk",   "Automatic", "diesel"},
            {"Mahindra Thar",   "suv",       "1700000", "Petrol 2.0L Turbo",   "Manual",    "petrol"},
            {"Mahindra XUV 3XO","suv",       "1100000", "Petrol 1.2L Turbo",   "Manual",    "petrol"},
            {"Mahindra BE 6",   "electric",  "1900000", "Electric 59 kWh",     "Automatic", "electric"},
            {"Maruti Suzuki Baleno",  "hatchback","800000","Petrol 1.2L DualJet","Manual",  "petrol"},
            {"Maruti Suzuki Grand Vitara","suv","1400000","Hybrid 1.5L",       "Automatic", "hybrid"},
            {"Maruti Suzuki Fronx","suv",    "1000000", "Petrol 1.0L Turbo",   "Automatic", "petrol"},
            {"Kia Seltos",      "suv",       "1500000", "Petrol 1.5L Turbo",   "Automatic", "petrol"},
            {"Kia EV6",         "electric",  "6500000", "Electric 77.4 kWh",   "Automatic", "electric"},
            {"Kia Sonet",       "suv",       "1000000", "Diesel 1.5L",         "Manual",    "diesel"},
            {"Toyota Fortuner", "luxury",    "4800000", "Diesel 2.8L",         "Automatic", "diesel"},
            {"Toyota Innova Hycross","luxury","2500000", "Hybrid 2.0L",        "Automatic", "hybrid"},
            {"MG Hector",       "suv",       "1700000", "Petrol 1.5L Turbo",   "Automatic", "petrol"},
            {"MG ZS EV",        "electric",  "2200000", "Electric 50.3 kWh",   "Automatic", "electric"},
            {"Honda City",      "sedan",     "1300000", "Petrol 1.5L",         "Manual",    "petrol"},
            {"Honda City Hybrid","hybrid",   "2000000", "Hybrid 1.5L",         "Automatic", "hybrid"},
            {"Skoda Slavia",    "sedan",     "1400000", "Petrol 1.5L TSI",     "Automatic", "petrol"},
            {"VW Taigun",       "suv",       "1500000", "Petrol 1.5L TSI",     "Automatic", "petrol"},
            {"BMW 3 Series",    "luxury",    "5500000", "Petrol 2.0L Twin-Turbo","Automatic","petrol"},
        };

        String[] colors = {"White", "Black", "Silver", "Red", "Blue", "Grey", "Green", "Orange"};
        CarStatus[] statuses = {CarStatus.AVAILABLE, CarStatus.AVAILABLE, CarStatus.AVAILABLE, CarStatus.RESERVED, CarStatus.SOLD};

        for (int i = 0; i < cars.length; i++) {
            String[] c = cars[i];
            Dealership d = dealerships.get(i % dealerships.size());
            int year = 2023 + rnd.nextInt(3);
            CarCategory cat = CarCategory.fromApi(c[1]);
            BigDecimal price = new BigDecimal(c[2]);
            String features = "[\"ABS\",\"Airbags\",\"Touchscreen Infotainment\",\"Rear Camera\",\"Cruise Control\"]";
            String images = "[]";
            String vin = "SRN" + String.format("%014d", 100000000L + rnd.nextInt(999999999));

            carRepository.save(Car.builder()
                    .model(c[0])
                    .year(year)
                    .category(cat)
                    .price(price)
                    .status(statuses[rnd.nextInt(statuses.length)])
                    .color(colors[rnd.nextInt(colors.length)])
                    .vin(vin)
                    .engine(c[3])
                    .transmission(c[4])
                    .fuelType(c[5])
                    .mileage(rnd.nextInt(50000))
                    .features(features)
                    .images(images)
                    .description(c[0] + " - " + year + " model, " + c[5] + " variant with premium features.")
                    .dealership(d)
                    .build());
        }
        log.info("Seeded {} cars.", cars.length);
    }

    private void seedOrdersAndInquiries() {
        if (orderRepository.count() > 0) {
            log.info("Orders already seeded, skipping...");
            return;
        }
        
        java.util.List<User> customers = userRepository.findAll().stream().filter(u -> u.getRole() == UserRole.CUSTOMER).toList();
        java.util.List<Dealership> dealerships = dealershipRepository.findAll();
        java.util.List<Car> cars = carRepository.findAll();
        if (customers.isEmpty() || dealerships.isEmpty() || cars.isEmpty()) return;

        log.info("Seeding Orders and Inquiries...");
        java.util.Random rnd = new java.util.Random();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(90);
        
        int orderCount = 0;
        int inquiryCount = 0;

        for (int i = 0; i < 150; i++) {
            Dealership d = dealerships.get(rnd.nextInt(dealerships.size()));
            User dealer = userRepository.findAll().stream().filter(u -> u.getRole() == UserRole.DEALER && d.equals(u.getDealership())).findFirst().orElse(null);
            if (dealer == null) continue;

            User c = customers.get(rnd.nextInt(customers.size()));
            Car car = cars.get(rnd.nextInt(cars.size()));
            
            long randomEpochDay = startDate.toEpochDay() + rnd.nextInt((int) (endDate.toEpochDay() - startDate.toEpochDay()));
            java.time.LocalDateTime randomDate = LocalDate.ofEpochDay(randomEpochDay).atTime(rnd.nextInt(24), rnd.nextInt(60));

            boolean isOrder = rnd.nextBoolean();
            
            if (isOrder) {
                Order order = Order.builder()
                        .orderNumber("ORD-" + System.currentTimeMillis() + "-" + i)
                        .customer(c)
                        .customerName(c.getFirstName() + " " + c.getLastName())
                        .customerEmail(c.getEmail())
                        .customerPhone(c.getPhone())
                        .car(car)
                        .carModel(car.getModel())
                        .carPrice(car.getPrice())
                        .dealership(d)
                        .dealer(dealer)
                        .status(OrderStatus.DELIVERED)
                        .paymentStatus(PaymentStatus.COMPLETED)
                        .totalAmount(car.getPrice())
                        .finalAmount(car.getPrice().subtract(new BigDecimal("10000"))) // Random discount
                        .createdAt(randomDate)
                        .updatedAt(randomDate)
                        .build();
                orderRepository.save(order);
                orderCount++;
            } else {
                InquiryChannel[] channels = InquiryChannel.values();
                Inquiry inquiry = Inquiry.builder()
                        .customer(c)
                        .customerName(c.getFirstName() + " " + c.getLastName())
                        .customerEmail(c.getEmail())
                        .customerPhone(c.getPhone())
                        .car(car)
                        .carModel(car.getModel())
                        .message("I am interested in buying " + car.getModel())
                        .status(InquiryStatus.PENDING)
                        .channel(channels[rnd.nextInt(channels.length)])
                        .assignedDealer(dealer)
                        .createdAt(randomDate)
                        .updatedAt(randomDate)
                        .build();
                inquiryRepository.save(inquiry);
                inquiryCount++;
            }
        }
        log.info("Seeded {} orders and {} inquiries.", orderCount, inquiryCount);
    }

    private void seedTestDrives() {
        if (testDriveRepository.count() > 0) {
            log.info("Test drives already seeded, skipping...");
            return;
        }

        java.util.List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.CUSTOMER).toList();
        java.util.List<Dealership> dealerships = dealershipRepository.findAll();
        java.util.List<Car> cars = carRepository.findAll();
        if (customers.isEmpty() || dealerships.isEmpty() || cars.isEmpty()) {
            log.warn("Cannot seed test drives: missing prerequisite data");
            return;
        }

        log.info("Seeding Test Drives...");
        java.util.Random rnd = new java.util.Random();

        String[] timeSlots = {"09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"};
        TestDriveStatus[] statuses = {
            TestDriveStatus.PENDING, TestDriveStatus.PENDING,
            TestDriveStatus.CONFIRMED, TestDriveStatus.CONFIRMED,
            TestDriveStatus.COMPLETED, TestDriveStatus.COMPLETED,
            TestDriveStatus.CANCELLED, TestDriveStatus.NO_SHOW
        };

        int count = 0;
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 60; i++) {
            Dealership d = dealerships.get(rnd.nextInt(dealerships.size()));
            User dealer = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.DEALER && d.equals(u.getDealership()))
                    .findFirst().orElse(null);
            User customer = customers.get(rnd.nextInt(customers.size()));
            Car car = cars.get(rnd.nextInt(cars.size()));

            // Mix of past, present and upcoming dates
            int dayOffset = -30 + rnd.nextInt(60); // -30 to +30 days from today
            LocalDate preferredDate = today.plusDays(dayOffset);
            TestDriveStatus status;
            if (dayOffset < -3) {
                // past drives: completed or cancelled
                status = rnd.nextBoolean() ? TestDriveStatus.COMPLETED : TestDriveStatus.CANCELLED;
            } else if (dayOffset > 3) {
                // future drives: pending or confirmed
                status = rnd.nextBoolean() ? TestDriveStatus.PENDING : TestDriveStatus.CONFIRMED;
            } else {
                status = statuses[rnd.nextInt(statuses.length)];
            }

            TestDrive td = TestDrive.builder()
                    .customer(customer)
                    .customerName(customer.getFirstName() + " " + customer.getLastName())
                    .customerEmail(customer.getEmail())
                    .customerPhone(customer.getPhone())
                    .car(car)
                    .carModel(car.getModel())
                    .dealership(d)
                    .preferredDate(preferredDate)
                    .preferredTime(timeSlots[rnd.nextInt(timeSlots.length)])
                    .status(status)
                    .assignedDealer(dealer)
                    .notes("Customer interested in " + car.getModel() + ". Please confirm availability.")
                    .build();

            testDriveRepository.save(td);
            count++;
        }
        log.info("Seeded {} test drives.", count);
    }
}


