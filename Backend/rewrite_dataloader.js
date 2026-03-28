const fs = require('fs');

const dataLoaderPath = 'C:\\Users\\Gautam\\Desktop\\My\\Project\\Serene\\Backend\\src\\main\\java\\com\\serene\\dms\\seed\\DataLoader.java';
let content = fs.readFileSync(dataLoaderPath, 'utf8');

const newRunMethod = `
    @Override
    public void run(String... args) {
        if (userRepository.count() > 20) {
            log.info("Database already seeded with the large dataset, skipping...");
            return;
        }

        log.info("Seeding Indian Managers, Dealers, and Customers...");
        String encodedPw = passwordEncoder.encode("password123");

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
    }
}
`;

content = content.replace(/@Override\s+public void run\(String\.\.\. args\) \{[\s\S]*\}\s*\}/, newRunMethod);
fs.writeFileSync(dataLoaderPath, content);
console.log('DataLoader rewritten.');
