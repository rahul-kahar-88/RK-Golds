from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField




class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = CloudinaryField(
        'image',
        folder='jewelry_categories',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name


class CustomerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    phone = models.CharField(max_length=10)
    address = models.TextField()
    def __str__(self):
        return self.user.username


class Shop(models.Model):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    logo = CloudinaryField(
        "image",
        folder="shop_logo",
        null=True,
        blank=True
    )
    banner = CloudinaryField(
        "image",
        folder="shop_banner",
        null=True,
        blank=True
    )
    description = models.TextField(
        blank=True
    )
    phone = models.CharField(
        max_length=10,
        blank=True
    )
    shop_name = models.CharField(
        max_length=100
    )
    slug = models.SlugField(
        unique=True
    )
    is_active = models.BooleanField(
        default=True
    )
    address = models.TextField()
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return self.shop_name


class Product(models.Model):
    shop = models.ForeignKey(
        Shop,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    stock = models.PositiveIntegerField()
    image = CloudinaryField(
        'image',
        folder='jewelry_products'
    )
    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return f"{self.user.username} Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(
        default=1
    )
    def __str__(self):
        return self.product.name


class Wishlist(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending','Pending'),
        ('Processing','Processing'),
        ('Delivered','Delivered'),
        ("Shipped","Shipped"),
        ("Cancelled","Cancelled")
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    shop = models.ForeignKey(
        Shop,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    phone = models.CharField(
        max_length=10,
        default=""
    )
    address = models.TextField(
        default=""
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )
    order_date = models.DateTimeField(
        auto_now_add=True
    )
    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    def __str__(self):
        return self.product.name

class Inventory(models.Model):
    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE
    )
    available_stock = models.PositiveIntegerField()
    def __str__(self):
        return self.product.name