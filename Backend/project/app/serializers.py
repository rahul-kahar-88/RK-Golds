from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password"
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }
    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters."
            )
        return value
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )
        return value
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Category
        fields = "__all__"
    def validate_name(self, value):
        if len(value) < 2:
            raise serializers.ValidationError(
                "Category name is too short."
            )
        return value


class CustomerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source="user.username",
        read_only=True
    )
    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )
    class Meta:
        model = CustomerProfile
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "address"
        ]
    def validate_phone(self,value):
        if len(value)!=10:
            raise serializers.ValidationError(
                "Phone number must be 10 digits."
            )
        return value


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Product
        fields = "__all__"
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0."
            )
        return value
    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Stock cannot be negative."
            )
        return value


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    class Meta:
        model = Inventory
        fields = [
            "id",
            "product",
            "product_name",
            "available_stock"
        ]


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = "__all__"
        read_only_fields = ["user"]


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    product_price = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = [
            "id",
            "cart",
            "product",
            "quantity",
            "product_name",
            "product_price",
            "product_image",
        ]
    def get_product_price(self, obj):
        return str(obj.product.price)
    def get_product_image(self, obj):
        try:
            return obj.product.image.url
        except Exception:
            return None
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0."
            )
        return value
    
    
class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    product_price = serializers.CharField(
        source="product.price",
        read_only=True
    )
    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )
    class Meta:
        model = Wishlist
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "product_image"
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    product_image = serializers.ImageField(
        source="product.image",
        read_only=True
    )
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "product_image",
            "quantity",
            "price"
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
        source="orderitem_set"
    )
    shop_name = serializers.CharField(
        source="shop.shop_name",
        read_only=True
    )
    class Meta:
        model = Order
        fields = [
            "id",
            "shop_name",
            "total_amount",
            "phone",
            "address",
            "status",
            "order_date",
            "items"
        ]


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = "__all__"


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )
    class Meta:
        model = Inventory
        fields = [
            "id",
            "product",
            "product_name",
            "available_stock"
        ]