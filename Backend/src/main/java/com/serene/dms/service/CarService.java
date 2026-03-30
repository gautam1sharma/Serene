package com.serene.dms.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.serene.dms.dto.response.CarResponse;
import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;
    private final ObjectMapper objectMapper;

    public Page<Car> getCars(int page, int limit, CarCategory category, CarStatus status,
                             BigDecimal minPrice, BigDecimal maxPrice, Long dealershipId, String search,
                             String sortBy, String sortDir) {
        Specification<Car> spec = Specification.where(null);

        if (category != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("category"), category));
        if (status != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), status));
        if (minPrice != null) spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        if (maxPrice != null) spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        if (dealershipId != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("dealership").get("id"), dealershipId));
        if (search != null && !search.isBlank()) {
            String like = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("model")), like),
                    cb.like(cb.lower(root.get("description")), like)
            ));
        }

        String resolvedSort = (sortBy != null && !sortBy.isBlank()) ? sortBy : "createdAt";
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(direction, resolvedSort));
        return carRepository.findAll(spec, pageReq);
    }

    @Cacheable(value = "carById", key = "#id")
    public Car getCarById(Long id) {
        log.debug("Fetching car by id={}", id);
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
    }

    public List<Car> getCarsByDealership(Long dealershipId) {
        log.debug("Fetching cars for dealership id={}", dealershipId);
        return carRepository.findByDealershipId(dealershipId);
    }

    @Cacheable(value = "featuredCars", key = "#limit")
    public List<Car> getFeaturedCars(int limit) {
        log.debug("Fetching {} featured cars", limit);
        return carRepository.findByStatusOrderByCreatedAtDesc(CarStatus.AVAILABLE)
                .stream().limit(limit).toList();
    }

    public List<Car> searchCars(String query) {
        log.debug("Searching cars with query='{}'", query);
        return carRepository.searchCars(query);
    }

    @Caching(evict = {
        @CacheEvict(value = "cars", allEntries = true),
        @CacheEvict(value = "featuredCars", allEntries = true)
    })
    @Transactional
    public Car createCar(Car car) {
        Car saved = carRepository.save(car);
        log.info("Car created: id={}, model={}", saved.getId(), saved.getModel());
        return saved;
    }

    @Caching(evict = {
        @CacheEvict(value = "carById", key = "#id"),
        @CacheEvict(value = "cars", allEntries = true),
        @CacheEvict(value = "featuredCars", allEntries = true)
    })
    @Transactional
    public Car updateCar(Long id, Car updates) {
        Car car = getCarById(id);
        if (updates.getModel() != null) car.setModel(updates.getModel());
        if (updates.getYear() != null) car.setYear(updates.getYear());
        if (updates.getCategory() != null) car.setCategory(updates.getCategory());
        if (updates.getPrice() != null) car.setPrice(updates.getPrice());
        if (updates.getColor() != null) car.setColor(updates.getColor());
        if (updates.getEngine() != null) car.setEngine(updates.getEngine());
        if (updates.getTransmission() != null) car.setTransmission(updates.getTransmission());
        if (updates.getFuelType() != null) car.setFuelType(updates.getFuelType());
        if (updates.getMileage() != null) car.setMileage(updates.getMileage());
        if (updates.getFeatures() != null) car.setFeatures(updates.getFeatures());
        if (updates.getImages() != null) car.setImages(updates.getImages());
        if (updates.getDescription() != null) car.setDescription(updates.getDescription());
        Car saved = carRepository.save(car);
        log.info("Car updated: id={}", id);
        return saved;
    }

    @Caching(evict = {
        @CacheEvict(value = "carById", key = "#id"),
        @CacheEvict(value = "cars", allEntries = true),
        @CacheEvict(value = "featuredCars", allEntries = true)
    })
    @Transactional
    public Car updateCarStatus(Long id, CarStatus status) {
        Car car = getCarById(id);
        car.setStatus(status);
        Car saved = carRepository.save(car);
        log.info("Car status updated: id={}, status={}", id, status);
        return saved;
    }

    @Caching(evict = {
        @CacheEvict(value = "carById", key = "#id"),
        @CacheEvict(value = "cars", allEntries = true),
        @CacheEvict(value = "featuredCars", allEntries = true)
    })
    @Transactional
    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
        log.info("Car deleted: id={}", id);
    }

    public CarResponse toCarResponse(Car car) {
        return CarResponse.builder()
                .id(String.valueOf(car.getId()))
                .model(car.getModel())
                .year(car.getYear())
                .category(car.getCategory())
                .price(car.getPrice())
                .status(car.getStatus())
                .color(car.getColor())
                .vin(car.getVin())
                .engine(car.getEngine())
                .transmission(car.getTransmission())
                .fuelType(car.getFuelType())
                .mileage(car.getMileage())
                .features(readStringList(car.getFeatures()))
                .images(readStringList(car.getImages()))
                .description(car.getDescription())
                .dealershipId(car.getDealership() != null ? String.valueOf(car.getDealership().getId()) : null)
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public Page<CarResponse> getCarsResponse(int page, int limit, CarCategory category, CarStatus status,
                                             BigDecimal minPrice, BigDecimal maxPrice, Long dealershipId,
                                             String search, String sortBy, String sortDir) {
        return getCars(page, limit, category, status, minPrice, maxPrice, dealershipId, search, sortBy, sortDir)
                .map(this::toCarResponse);
    }

    @Transactional(readOnly = true)
    public CarResponse getCarResponseById(Long id) {
        return toCarResponse(getCarById(id));
    }

    @Transactional(readOnly = true)
    public List<CarResponse> getCarsByDealershipResponse(Long dealershipId) {
        return getCarsByDealership(dealershipId).stream().map(this::toCarResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CarResponse> getFeaturedCarsResponse(int limit) {
        return getFeaturedCars(limit).stream().map(this::toCarResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CarResponse> searchCarsResponse(String query) {
        return searchCars(query).stream().map(this::toCarResponse).toList();
    }

    private List<String> readStringList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}

