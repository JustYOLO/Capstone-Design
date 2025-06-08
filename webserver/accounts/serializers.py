from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.mail import send_mail
from django.conf import settings
from .models import BusinessProfile
from .verify import verify_pdf  # your existing function
from .models import BusinessImage
from .models import BusinessProfile, Order

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    NORMAL   = User.NORMAL
    BUSINESS = User.BUSINESS
    USER_TYPE_CHOICES = User.USER_TYPE_CHOICES

    user_type = serializers.ChoiceField(choices=USER_TYPE_CHOICES)

    def validate_email(self, email):
        # enforce unique, case‐insensitive email
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "A user with that email already exists."
            )
        return email

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["user_type"] = self.validated_data.get("user_type")
        return data

class BusinessRegisterSerializer(RegisterSerializer):
    file = serializers.FileField(write_only=True)

    def validate(self, attrs):
        pdf_file = attrs.get("file")
        is_active, company_name = verify_pdf(pdf_file)
        if not is_active:
            raise serializers.ValidationError({
                "file": "PDF verification failed or business not active."
            })
        # attach the extracted name so save() can use it
        attrs["company_name"] = company_name
        return super().validate(attrs)

    def save(self, request):
        # 1) run normal user creation & email‐confirmation
        user = super().save(request)
        # 2) create the profile with both pdf and company_name
        BusinessProfile.objects.create(
            user=user,
            pdf=self.validated_data["file"],
            company_name=self.validated_data["company_name"],
            is_verified=True,
        )
        return user

class BusinessDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ["data"]

class PublicBusinessSerializer(serializers.ModelSerializer):
    housename = serializers.CharField(source="company_name", read_only=True)
    data      = serializers.JSONField(read_only=True)
    inventory  = serializers.JSONField(read_only=True)

    class Meta:
        model  = BusinessProfile
        fields = ["housename", "data", "inventory"]

class BusinessImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessImage
        fields = ["id", "image"]

class BusinessInventorySerializer(serializers.ModelSerializer):
    # we expect { "flowers": [ {name, meaning, quantity}, ... ] }
    flowers = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    class Meta:
        model = BusinessProfile
        fields = ["flowers"]

    def update(self, instance, validated_data):
        instance.inventory = validated_data["flowers"]
        instance.save()
        return instance

class OrderItemSerializer(serializers.Serializer):
    name     = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)

class OrderCreateSerializer(serializers.Serializer):
    business_id    = serializers.IntegerField()
    items          = serializers.ListField(child=OrderItemSerializer())

    def validate_business_id(self, value):
        try:
            business = BusinessProfile.objects.get(pk=value, is_verified=True)
        except BusinessProfile.DoesNotExist:
            raise serializers.ValidationError("Invalid or unverified business.")
        self.business = business
        return value

    def validate(self, attrs):
        inventory = self.business.inventory  # list of { name, meaning, quantity }
        stock_map = {i["name"]: i["quantity"] for i in inventory}
        for it in attrs["items"]:
            name, qty = it["name"], it["quantity"]
            if name not in stock_map:
                raise serializers.ValidationError(f"Item '{name}' not in stock.")
            if qty > stock_map[name]:
                raise serializers.ValidationError(
                    f"Not enough '{name}' in stock (requested {qty}, available {stock_map[name]})."
                )
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        # grab name/email from the user model
        customer_name  = user.get_full_name() or user.email
        customer_email = user.email

        # then the rest is the same
        business = self.business
        items    = validated_data["items"]
        # subtract inventory, save profile, etc…
        order = Order.objects.create(
            business=business,
            customer_name=customer_name,
            customer_email=customer_email,
            items=items
        )

        # 3) Email notification to the business owner
        subject = f"[New Order #{order.id}] {business.company_name}"
        body = ["You have a new flower order:", ""]
        for it in items:
            body.append(f"- {it['name']}: {it['quantity']}")
        body += [
            "",
            f"Customer: {order.customer_name}",
            f"Email: {order.customer_email}",
        ]
        send_mail(
            subject,
            "\n".join(body),
            settings.EMAIL_HOST_USER,
            [business.user.email],
            fail_silently=False,
        )

        return order

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Order
        fields = ["id", "customer_name", "customer_email", "items", "created_at"]

