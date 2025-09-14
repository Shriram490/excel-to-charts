from rest_framework import serializers
from .models import UploadedSheet

class UploadedSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedSheet
        fields = ['id','name','data','uploaded_at']