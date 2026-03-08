from django.core.management.base import BaseCommand
from core.models import User, CarModel, Dealership, CarInventory, ServiceRequest

class Command(BaseCommand):
    help = 'Setup mock data for Hyundai Hub'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing old data...')
        ServiceRequest.objects.all().delete()
        CarInventory.objects.all().delete()
        Dealership.objects.all().delete()
        CarModel.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

        self.stdout.write('Creating users...')
        customer1 = User.objects.create_user(username='customer1', password='password123', role='customer')
        dealer1 = User.objects.create_user(username='dealer1', password='password123', role='dealer')
        manager1 = User.objects.create_user(username='manager1', password='password123', role='manager')
        management1 = User.objects.create_user(username='management1', password='password123', role='management')
        ceo1 = User.objects.create_user(username='ceo1', password='password123', role='ceo')

        self.stdout.write('Creating car models...')
        creta = CarModel.objects.create(name='Creta', base_price=1500000, description='Compact SUV')
        tucson = CarModel.objects.create(name='Tucson', base_price=3000000, description='Premium SUV')
        verna = CarModel.objects.create(name='Verna', base_price=1200000, description='Premium Sedan')

        self.stdout.write('Creating dealerships...')
        delhi_dealership = Dealership.objects.create(name='Hyundai Delhi Central', location='Delhi', manager=manager1)
        mumbai_dealership = Dealership.objects.create(name='Hyundai Mumbai South', location='Mumbai', manager=manager1)

        self.stdout.write('Creating inventory...')
        CarInventory.objects.create(dealership=delhi_dealership, car_model=creta, vin='VIN123456789CRETA', status='available')
        CarInventory.objects.create(dealership=delhi_dealership, car_model=verna, vin='VIN123456789VERNA', status='sold')
        CarInventory.objects.create(dealership=mumbai_dealership, car_model=tucson, vin='VIN12345678TUCSON', status='available')

        self.stdout.write('Creating service requests...')
        ServiceRequest.objects.create(customer=customer1, dealership=delhi_dealership, car_model='Creta', issue_description='Routine Maintenance', status='pending')
        ServiceRequest.objects.create(customer=customer1, dealership=mumbai_dealership, car_model='i20', issue_description='AC not working', status='in_progress')

        self.stdout.write(self.style.SUCCESS('Mock data created successfully!'))
