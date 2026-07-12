from urllib import request
from xmlrpc import client
from razorpay.errors import SignatureVerificationError
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated , IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser , JSONParser
from django.contrib.auth.models import User
from rest_framework.decorators import action
from rest_framework.response import Response
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from django.db.models import Sum

from .models import *
from .serializers import *

from rest_framework.decorators import api_view

@api_view(["GET"])
def user_info(request):
    return Response({
        "username":request.user.username,
        "is_staff":request.user.is_staff
    })


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        total_products = Product.objects.count()
        total_orders = Order.objects.count()
        total_users = User.objects.count()
        total_shops = Shop.objects.count()
        total_sales = sum(
            order.total_amount
            for order in Order.objects.all()
        )
        return Response({
            "products": total_products,
            "orders": total_orders,
            "users": total_users,
            "shops": total_shops,
            "sales": total_sales
        })


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser , JSONParser]


from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    filter_backends = [
        DjangoFilterBackend, SearchFilter
    ]
    filterset_fields = ["category"]
    search_fields = [
        "name",
        "category__name",
    ]
    def perform_create(self, serializer):
        product = serializer.save()
        Inventory.objects.create(
            product=product,
            available_stock=product.stock
        )


class CustomerProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CustomerProfile.objects.filter(
            user=self.request.user
        )
    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__user=self.request.user
        )


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().prefetch_related(
                "orderitem_set"
            )
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related(
            "orderitem_set"
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user
        )

    # CREATE RAZORPAY ORDER
    @action(
        detail=False,
        methods=["post"],
        url_path="create_payment"
    )
    def create_payment(self, request):

        phone = request.data.get("phone")
        address = request.data.get("address")
        if not phone or not address:
            return Response(
                {
                    "error":"Phone and Address required"
                },
                status=400
            )
        cart = Cart.objects.filter(
            user=request.user
        ).first()

        if not cart:
            return Response(
                {
                    "error":"Cart not found"
                },
                status=400
            )
        cart_items = CartItem.objects.filter(
            cart=cart
        )

        if not cart_items.exists():
            return Response(
                {
                    "error":"Cart empty"
                },
                status=400
            )
        amount = sum(
            item.product.price *
            item.quantity
            for item in cart_items
        )

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )

        payment = client.order.create({
            "amount": int(amount * 100),
            "currency":"INR",
            "payment_capture":1
        })

        return Response({
            "key":
            settings.RAZORPAY_KEY_ID,
            "id":
            payment["id"],
            "amount":
            payment["amount"]
        })

    # VERIFY PAYMENT + CREATE ORDER
    @action(
        detail=False,
        methods=["post"],
        url_path="verify_payment"
    )
    def verify_payment(self, request):
        try:
            data = request.data
            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET
                )
            )
            # verify razorpay payment
            client.utility.verify_payment_signature({
                "razorpay_order_id":
                data["razorpay_order_id"],
                "razorpay_payment_id":
                data["razorpay_payment_id"],
                "razorpay_signature":
                data["razorpay_signature"]
            })
            # get cart
            cart = Cart.objects.filter(
                user=request.user
            ).first()

            cart_items = CartItem.objects.filter(
                cart=cart
            )

            if not cart_items.exists():
                return Response(
                    {
                        "error":"Cart empty"
                    },
                    status=400
                )
            total_amount = sum(
                item.product.price * item.quantity
                for item in cart_items
            )
            # create order
            # shop wise products divide

            products_by_shop = {}
            for item in cart_items:
                shop = item.product.shop
                if shop not in products_by_shop:
                    products_by_shop[shop] = []
                products_by_shop[shop].append(item)
            for shop, items in products_by_shop.items():
                total_amount = sum(
                    item.product.price * item.quantity
                    for item in items
                )
                order = Order.objects.create(
                    user=request.user,
                    shop=shop,
                    total_amount=total_amount,
                    phone=request.data.get("phone"),
                    address=request.data.get("address"),
                    status="Processing"
                )
                for item in items:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price=item.product.price
                    )
            # clear cart
            cart_items.delete()
            return Response({
                "message":"Payment Successful",
                "order_id":order.id
            })

        except Exception as e:
            print("RAZORPAY VERIFY ERROR:",e)
            return Response(
                {
                    "error":str(e)
                },
                status=400
            )
    # NORMAL CHECKOUT (WITHOUT PAYMENT)
    @action(
        detail=False,
        methods=["post"]
    )
    def checkout(self, request):
        cart = Cart.objects.filter(
            user=request.user
        ).first()

        if not cart:
            return Response(
                {
                    "error":"Cart not found"
                },
                status=400
            )
        cart_items = CartItem.objects.filter(
            cart=cart
        )

        if not cart_items.exists():
            return Response(
                {
                    "error":"Cart empty"
                },
                status=400
            )
        total_amount = sum(
            item.product.price *
            item.quantity
            for item in cart_items
        )

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        cart_items.delete()

        return Response({
            "message":
            "Order Placed Successfully",
            "order_id":
            order.id
        })
    
class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAdminUser]


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["is_staff"] = user.is_staff
        return token

class MyTokenView(TokenObtainPairView):
    serializer_class = MyTokenSerializer



# =================== Shop ==========================


class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAdminUser]
    @action(
        detail=False,
        methods=["post"],
        url_path="create_shop"
    )
    def create_shop(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        shop_name = request.data.get("shop_name")
        address = request.data.get("address")
        if not username or not password or not shop_name:
            return Response(
                {
                    "error":"All fields required"
                },
                status=400
            )
        # create owner user
        if User.objects.filter(username=username).exists():
            return Response(
            {
                "error":"Username already exists"
            },
            status=400
        )
        user = User.objects.create_user(
            username=username,
            password=password
        )
        # create shop
        shop = Shop.objects.create(
            owner=user,
            shop_name=shop_name,
            slug=shop_name.lower().replace(" ","-"),
            address=address
        )
        return Response({
            "message":"Shop Created",
            "shop_id":shop.id
        })
    

class VendorDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        shop = Shop.objects.filter(
            owner=request.user
        ).first()
        if not shop:
            return Response(
                {
                    "error":"Shop not found"
                },
                status=400
            )
        return Response({
            "shop_name":shop.shop_name,
            "address":shop.address,
            "owner": request.user.username
        })
    

class VendorProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        shop = Shop.objects.filter(
            owner=self.request.user
        ).first()
        return Product.objects.filter(
            shop=shop
        )
    def perform_create(self, serializer):

        shop = Shop.objects.get(
            owner=self.request.user
        )
        product = serializer.save(
            shop=shop
        )
        Inventory.objects.create(
            product=product,
            available_stock=product.stock
        )


class VendorOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        shop = Shop.objects.filter(
            owner=self.request.user
        ).first()
        if not shop:
            return Order.objects.none()
        return Order.objects.filter(
            orderitem__product__shop=shop
        ).distinct()
    

class VendorInventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        shop = Shop.objects.filter(
            owner=self.request.user
        ).first()
        return Inventory.objects.filter(
            product__shop=shop
        )
    def update(self, request, *args, **kwargs):
        inventory = self.get_object()
        print("REQUEST DATA:", request.data)
        print(
            "OLD STOCK:",
            inventory.available_stock
        )
        stock = request.data.get(
            "available_stock"
        )
        inventory.available_stock = stock
        inventory.save()
        inventory.product.stock = stock
        inventory.product.save()
        print(
            "NEW STOCK:",
            inventory.available_stock
        )
        return Response({
            "message":"Stock Updated",
            "stock":inventory.available_stock
        })
    

class PublicShopView(APIView):
    permission_classes = []
    def get(self,request,slug):
        shop = Shop.objects.get(
            slug=slug
        )
        products = Product.objects.filter(
            shop=shop
        )
        serializer = ProductSerializer(
            products,
            many=True
        )
        return Response({
            "shop_name": shop.shop_name,
            "owner": shop.owner.username,
            "address": shop.address,
            "phone": shop.phone,
            "description": shop.description,
            "logo": shop.logo.url if shop.logo else None,
            "banner": shop.banner.url if shop.banner else None,
            "products": serializer.data
        })
    

class VendorShopView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        shop = Shop.objects.get(
            owner=request.user
        )
        serializer = ShopSerializer(shop)
        return Response(
            serializer.data
        )
    def patch(self,request):
        shop = Shop.objects.get(
            owner=request.user
        )
        serializer = ShopSerializer(
            shop,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data
            )
        return Response(
            serializer.errors,
            status=400
        )