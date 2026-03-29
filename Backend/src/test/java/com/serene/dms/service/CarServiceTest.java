package com.serene.dms.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.serene.dms.entity.Car;
import com.serene.dms.enums.CarCategory;
import com.serene.dms.enums.CarStatus;
import com.serene.dms.exception.ResourceNotFoundException;
import com.serene.dms.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    private CarService carService;

    private Car sampleCar;

    @BeforeEach
    void setUp() {
        carService = new CarService(carRepository, new ObjectMapper());

        sampleCar = Car.builder()
                .id(1L)
                .model("Toyota Camry")
                .year(2023)
                .category(CarCategory.SEDAN)
                .price(new BigDecimal("28000"))
                .status(CarStatus.AVAILABLE)
                .color("Silver")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getCarById_existingCar_returnsCar() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(sampleCar));

        Car result = carService.getCarById(1L);

        assertNotNull(result);
        assertEquals("Toyota Camry", result.getModel());
        verify(carRepository).findById(1L);
    }

    @Test
    void getCarById_nonExistentCar_throwsResourceNotFoundException() {
        when(carRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> carService.getCarById(99L));
    }

    @Test
    void createCar_savesAndReturnsCar() {
        when(carRepository.save(any(Car.class))).thenReturn(sampleCar);

        Car result = carService.createCar(sampleCar);

        assertNotNull(result);
        assertEquals(sampleCar.getModel(), result.getModel());
        verify(carRepository).save(sampleCar);
    }

    @Test
    void updateCar_partialUpdate_onlyUpdatesProvidedFields() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(sampleCar));
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> inv.getArgument(0));

        Car updates = Car.builder().price(new BigDecimal("25000")).build();
        Car result = carService.updateCar(1L, updates);

        assertEquals(new BigDecimal("25000"), result.getPrice());
        assertEquals("Toyota Camry", result.getModel()); // unchanged
        assertEquals("Silver", result.getColor());       // unchanged
    }

    @Test
    void updateCarStatus_changesStatus() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(sampleCar));
        when(carRepository.save(any(Car.class))).thenAnswer(inv -> inv.getArgument(0));

        Car result = carService.updateCarStatus(1L, CarStatus.SOLD);

        assertEquals(CarStatus.SOLD, result.getStatus());
    }

    @Test
    void deleteCar_existingCar_deletesSuccessfully() {
        when(carRepository.findById(1L)).thenReturn(Optional.of(sampleCar));

        assertDoesNotThrow(() -> carService.deleteCar(1L));
        verify(carRepository).delete(sampleCar);
    }

    @Test
    void getCars_withSortAsc_usesAscendingSort() {
        Page<Car> mockPage = new PageImpl<>(List.of(sampleCar));
        when(carRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(mockPage);

        carService.getCars(1, 10, null, null, null, null, null, null, "price", "asc");

        ArgumentCaptor<PageRequest> pageCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(carRepository).findAll(any(Specification.class), pageCaptor.capture());

        PageRequest captured = pageCaptor.getValue();
        assertEquals(Sort.Direction.ASC, captured.getSort().getOrderFor("price").getDirection());
    }

    @Test
    void getCars_withSortDesc_usesDescendingSort() {
        Page<Car> mockPage = new PageImpl<>(List.of(sampleCar));
        when(carRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(mockPage);

        carService.getCars(1, 10, null, null, null, null, null, null, "price", "desc");

        ArgumentCaptor<PageRequest> pageCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(carRepository).findAll(any(Specification.class), pageCaptor.capture());

        PageRequest captured = pageCaptor.getValue();
        assertEquals(Sort.Direction.DESC, captured.getSort().getOrderFor("price").getDirection());
    }

    @Test
    void getCars_withNullSort_defaultsToCreatedAtDesc() {
        Page<Car> mockPage = new PageImpl<>(List.of(sampleCar));
        when(carRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(mockPage);

        carService.getCars(1, 10, null, null, null, null, null, null, null, null);

        ArgumentCaptor<PageRequest> pageCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(carRepository).findAll(any(Specification.class), pageCaptor.capture());

        PageRequest captured = pageCaptor.getValue();
        Sort.Order order = captured.getSort().getOrderFor("createdAt");
        assertNotNull(order);
        assertEquals(Sort.Direction.DESC, order.getDirection());
    }

    @Test
    void toCarResponse_mapsFieldsCorrectly() {
        var response = carService.toCarResponse(sampleCar);

        assertEquals("1", response.getId());
        assertEquals("Toyota Camry", response.getModel());
        assertEquals(new BigDecimal("28000"), response.getPrice());
        assertEquals(CarStatus.AVAILABLE, response.getStatus());
        assertEquals(CarCategory.SEDAN, response.getCategory());
    }
}
