from django.test import TestCase, Client
from django.urls import reverse
from core.models import User, CarModel, Dealership, CarInventory, ServiceRequest

class RoleDashboardTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.customer = User.objects.create_user(username='cust', password='pwd', role='customer')
        self.dealer = User.objects.create_user(username='deal', password='pwd', role='dealer')
        self.manager = User.objects.create_user(username='man', password='pwd', role='manager')
        self.management = User.objects.create_user(username='mgmt', password='pwd', role='management')
        self.ceo = User.objects.create_user(username='ceo', password='pwd', role='ceo')

    def test_login_redirect(self):
        self.client.login(username='cust', password='pwd')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('customer_dashboard'))

        self.client.login(username='deal', password='pwd')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('dealer_dashboard'))

        self.client.login(username='man', password='pwd')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('manager_dashboard'))

    def test_role_permissions(self):
        # A customer shouldn't access the ceo dashboard
        self.client.login(username='cust', password='pwd')
        response = self.client.get(reverse('ceo_dashboard'))
        self.assertEqual(response.status_code, 302) # Redirects to login

        # CEO should access the ceo dashboard
        self.client.login(username='ceo', password='pwd')
        response = self.client.get(reverse('ceo_dashboard'))
        self.assertEqual(response.status_code, 200)
