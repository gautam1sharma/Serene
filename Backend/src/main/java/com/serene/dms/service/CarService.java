package com.serene.dms.service;

import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.CarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {

    private final CarRepository carRepository;

    public Page<Car> getCars(int page, int limit, CarCategory category, CarStatus status,
                             BigDecimal minPrice, BigDecimal maxPrice, Long dealershipId, String search) {
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

        PageRequest pageReq = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        return carRepository.findAll(spec, pageReq);
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
    }

    public List<Car> getCarsByDealership(Long dealershipId) {
        return carRepository.findByDealershipId(dealershipId);
    }

    public List<Car> getFeaturedCars(int limit) {
        return carRepository.findByStatusOrderByCreatedAtDesc(CarStatus.AVAILABLE)
                .stream().limit(limit).toList();
    }

    public List<Car> searchCars(String query) {
        return carRepository.searchCars(query);
    }

    @Transactional
    public Car createCar(Car car) {
        return carRepository.save(car);
    }

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
        return carRepository.save(car);
    }

    @Transactional
    public Car updateCarStatus(Long id, CarStatus status) {
        Car car = getCarById(id);
        car.setStatus(status);
        return carRepository.save(car);
    }

    @Transactional
    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
    }
}
