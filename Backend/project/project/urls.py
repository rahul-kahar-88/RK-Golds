"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from app.views import *

router = DefaultRouter()

router.register(
    'categories',
    CategoryViewSet,
    basename="categories"
)

router.register(
    'products',
    ProductViewSet
)

router.register(
    'users',
    UserViewSet
)

router.register(
    'profiles',
    CustomerProfileViewSet
)

router.register(
    'carts',
    CartViewSet
)

router.register(
    'cart-items',
    CartItemViewSet
)

router.register(
    'wishlists',
    WishlistViewSet,
    basename="wishlists"
)

router.register(
    "orders",
    OrderViewSet,
    basename="orders"
)

router.register(
    'order-items',
    OrderItemViewSet
)

router.register(
    "inventory",
    InventoryViewSet,
    basename="inventory"
)

router.register(
    "shops",
    ShopViewSet,
    basename="shops"
)

router.register(
    "vendor/products",
    VendorProductViewSet,
    basename="vendor-products"
)

router.register(
    "vendor/orders",
    VendorOrderViewSet,
    basename="vendor-orders"
)

router.register(
    "vendor/inventory",
    VendorInventoryViewSet,
    basename="vendor-inventory"
)
urlpatterns = [
    path(
        "admin/dashboard/",
        AdminDashboardView.as_view()
        ),
    path('admin/', admin.site.urls),

    path('', include(router.urls)),

    path(
        'api/token/',
        MyTokenView.as_view(),
        name="token"
        ),
    
    path(
        "user-info/",
        user_info
        ),

    path(
        "vendor/dashboard/",
        VendorDashboardView.as_view()
        ),

    path(
        "shop/<slug:slug>/",
        PublicShopView.as_view()
        ),
    
    path(
        "vendor/shop/",
        VendorShopView.as_view()
        ),
    

    # JWT URLs
    path(
        'api/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
]
