
package com.serene.dms.controller;

import com.serene.dms.entity.Dealership;
import com.serene.dms.entity.User;
import com.serene.dms.enums.UserRole;
import com.serene.dms.enums.UserStatus;
import com.serene.dms.repository.DealershipRepository;
import com.serene.dms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/seeder")
public class SeederController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DealershipRepository dealershipRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/run")
    public String seedDatabase() {
        try {
            String defaultPassword = passwordEncoder.encode("password123");

            // Indian Names for generation
            String[] firstNames = {"Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Siddharth", "Rohan", "Rahul", "Karan", "Gautam", 
                "Diya", "Ananya", "Ishita", "Sneha", "Kavya", "Neha", "Priya", "Riya", "Ayesha", "Meera"};
            String[] lastNames = {"Sharma", "Verma", "Gupta", "Malhotra", "Singh", "Patel", "Kumar", "Chopra", "Joshi", "Bansal"};
            String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Surat"};
            
            Random random = new Random();

            // Create 3 Managers
            List<User> managers = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                User manager = User.builder()
                    .firstName(firstNames[random.nextInt(firstNames.length)])
                    .lastName(lastNames[random.nextInt(lastNames.length)])
                    .email("manager" + i + UUID.randomUUID().toString().substring(0,4) + "@serene.in")
                    .passwordHash(defaultPassword)
                    .role(UserRole.MANAGER)
                    .status(UserStatus.ACTIVE)
                    .phone("+91" + (9000000000L + random.nextInt(999999999)))
                    .build();
                managers.add(userRepository.save(manager));
            }

            int[] dealershipCounts = {3, 3, 4};
            int dealerCounter = 1;
            
            List<Dealership> dealerships = new ArrayList<>();
            
            for (int i = 0; i < managers.size(); i++) {
                User manager = managers.get(i);
                int count = dealershipCounts[i];
                
                for (int d = 0; d < count; d++) {
                    String city = cities[dealerCounter % cities.length];
                    Dealership dealership = Dealership.builder()
                        .name("Serene " + city + " branch " + dealerCounter)
                        .code("IND-" + UUID.randomUUID().toString().substring(0,6))
                        .street("Avenue " + dealerCounter)
                        .city(city)
                        .state("State " + (i+1))
                        .zipCode("1000" + dealerCounter)
                        .country("India")
                        .phone("+91" + (8000000000L + random.nextInt(999999999)))
                        .email("dealer" + UUID.randomUUID().toString().substring(0,4) + "@serene.in")
                        .manager(manager)
                        .status("active")
                        .build();
                    dealerships.add(dealershipRepository.save(dealership));
                    
                    User staff = User.builder()
                        .firstName(firstNames[random.nextInt(firstNames.length)])
                        .lastName(lastNames[random.nextInt(lastNames.length)])
                        .email("staff" + UUID.randomUUID().toString().substring(0,4) + "@serene.in")
                        .passwordHash(defaultPassword)
                        .role(UserRole.DEALER)
                        .status(UserStatus.ACTIVE)
                        .phone("+91" + (9000000000L + random.nextInt(999999999)))
                        .dealership(dealership)
                        .build();
                    userRepository.save(staff);
                    
                    dealerCounter++;
                }
            }

            for (int i = 1; i <= 50; i++) {
                User customer = User.builder()
                    .firstName(firstNames[random.nextInt(firstNames.length)])
                    .lastName(lastNames[random.nextInt(lastNames.length)])
                    .email("customer" + UUID.randomUUID().toString().substring(0,4) + "@example.in")
                    .passwordHash(defaultPassword)
                    .role(UserRole.CUSTOMER)
                    .status(UserStatus.ACTIVE)
                    .phone("+91" + (7000000000L + random.nextInt(999999999)))
                    .build();
                userRepository.save(customer);
            }

            return "Success!";
        } catch(Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }
}

