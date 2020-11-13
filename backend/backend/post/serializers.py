from rest_framework import serializers
from .models import Post, Foreground

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        
class ForegroundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foreground
        fields = '__all__'