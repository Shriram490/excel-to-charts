from django.db import models

# Create your models here.
class UploadedSheet(models.Model):
    name = models.CharField(max_length=255)
    data = models.JSONField()
    uploaded_at = models.DateTimeField(auto_now_add = True)



    def __str__(self):
        return f"{self.name}({self.uploaded_at:%Y-%m-%d %H : %M})"
class MicrosoftUser(models.Model):
    microsoft_id = models.CharField(max_length=200, unique=True)
    display_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    job_title = models.CharField(max_length=200, blank=True, null=True)
    department = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.display_name