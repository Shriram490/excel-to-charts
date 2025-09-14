from django.urls import path
from .views import upload_sheet, list_sheets, sheet_detail_delete, microsoft_auth

urlpatterns = [
    path('upload/', upload_sheet, name='upload-sheet'),
    path('', list_sheets, name='list-sheets'),
    path('<int:pk>/', sheet_detail_delete, name='sheet-detail-delete'),
    path("auth/", microsoft_auth), 
]
