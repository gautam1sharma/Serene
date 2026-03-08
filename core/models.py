from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('dealer', 'Dealer'),
        ('manager', 'Manager'),
        ('management', 'Management'),
        ('ceo', 'CEO'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def is_customer(self):
        return self.role == 'customer'

    def is_dealer(self):
        return self.role == 'dealer'

    def is_manager(self):
        return self.role == 'manager'

    def is_management(self):
        return self.role == 'management'

    def is_ceo(self):
        return self.role == 'ceo'

class CarModel(models.Model):
    name = models.CharField(max_length=100)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name

class Dealership(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_dealerships', limit_choices_to={'role': 'manager'})

    def __str__(self):
        return f"{self.name} - {self.location}"

class CarInventory(models.Model):
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name='inventory')
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE)
    vin = models.CharField(max_length=17, unique=True)
    status_choices = (
        ('available', 'Available'),
        ('sold', 'Sold'),
    )
    status = models.CharField(max_length=20, choices=status_choices, default='available')

    def __str__(self):
        return f"{self.car_model.name} ({self.vin})"

class ServiceRequest(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_requests', limit_choices_to={'role': 'customer'})
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name='service_requests')
    car_model = models.CharField(max_length=100)
    issue_description = models.TextField()
    date_requested = models.DateTimeField(auto_now_add=True)
    status_choices = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    )
    status = models.CharField(max_length=20, choices=status_choices, default='pending')

    def __str__(self):
        return f"Service for {self.car_model} by {self.customer.username}"
