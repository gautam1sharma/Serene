from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .decorators import role_required
from .models import CarInventory, ServiceRequest, Dealership, User
from django.contrib import messages
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard_redirect(request):
    user = request.user
    if user.is_customer():
        return redirect('customer_dashboard')
    elif user.is_dealer():
        return redirect('dealer_dashboard')
    elif user.is_manager():
        return redirect('manager_dashboard')
    elif user.is_management():
        return redirect('management_dashboard')
    elif user.is_ceo():
        return redirect('ceo_dashboard')
    else:
        return redirect('login')

@login_required
@role_required('customer')
def customer_dashboard(request):
    service_requests = ServiceRequest.objects.filter(customer=request.user)
    return render(request, 'core/customer_dashboard.html', {'service_requests': service_requests})

@login_required
@role_required('dealer')
def dealer_dashboard(request):
    inventory = CarInventory.objects.all()
    return render(request, 'core/dealer_dashboard.html', {'inventory': inventory})

@login_required
@role_required('manager')
def manager_dashboard(request):
    dealerships = Dealership.objects.filter(manager=request.user)
    dealership_ids = dealerships.values_list('id', flat=True)
    inventory = CarInventory.objects.filter(dealership_id__in=dealership_ids)
    service_requests = ServiceRequest.objects.filter(dealership_id__in=dealership_ids)
    return render(request, 'core/manager_dashboard.html', {
        'dealerships': dealerships,
        'inventory': inventory,
        'service_requests': service_requests
    })

@login_required
@role_required('management')
def management_dashboard(request):
    total_dealerships = Dealership.objects.count()
    total_inventory = CarInventory.objects.count()
    total_service_requests = ServiceRequest.objects.count()
    return render(request, 'core/management_dashboard.html', {
        'total_dealerships': total_dealerships,
        'total_inventory': total_inventory,
        'total_service_requests': total_service_requests
    })

@login_required
@role_required('ceo')
def ceo_dashboard(request):
    total_users = User.objects.count()
    role_counts = {
        'customers': User.objects.filter(role='customer').count(),
        'dealers': User.objects.filter(role='dealer').count(),
        'managers': User.objects.filter(role='manager').count(),
    }
    total_revenue_approx = CarInventory.objects.filter(status='sold').count() * 1000000 # Dummy logic

    return render(request, 'core/ceo_dashboard.html', {
        'total_users': total_users,
        'role_counts': role_counts,
        'total_revenue_approx': total_revenue_approx
    })
