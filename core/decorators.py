from django.contrib.auth.decorators import user_passes_test

def role_required(*roles):
    def check_role(user):
        if user.is_authenticated and user.role in roles:
            return True
        return False
    return user_passes_test(check_role, login_url='/login/')

def customer_required(function=None):
    return role_required('customer')(function)

def dealer_required(function=None):
    return role_required('dealer')(function)

def manager_required(function=None):
    return role_required('manager')(function)

def management_required(function=None):
    return role_required('management')(function)

def ceo_required(function=None):
    return role_required('ceo')(function)
