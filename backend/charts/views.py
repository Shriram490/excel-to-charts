from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import requests
import json
from django.views.decorators.csrf import csrf_exempt

from .models import UploadedSheet, MicrosoftUser
from .serializers import UploadedSheetSerializer




@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_sheet(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        df = pd.read_excel(file, engine='openpyxl')  # read Excel file
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    data = {
        'columns': df.columns.tolist(),
        'rows': df.fillna('').to_dict(orient='records')
    }
    sheet = UploadedSheet.objects.create(name=file.name, data=data)
    return Response(UploadedSheetSerializer(sheet).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_sheets(request):
    sheets = UploadedSheet.objects.all().order_by('-uploaded_at')
    return Response(UploadedSheetSerializer(sheets, many=True).data)


@api_view(['GET', 'DELETE'])
def sheet_detail_delete(request, pk):
    try:
        sheet = UploadedSheet.objects.get(pk=pk)
    except UploadedSheet.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UploadedSheetSerializer(sheet)
        return Response(serializer.data)
    elif request.method == 'DELETE':
        sheet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




@csrf_exempt
@api_view(['POST'])
def microsoft_auth(request):
    try:
        body = json.loads(request.body)
        token = body.get("token")
        if not token:
            return Response({"error": "Token missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Call Microsoft Graph API 
        graph_response = requests.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {token}"}
        )

        if graph_response.status_code == 200:
            user_data = graph_response.json()

            microsoft_id = user_data.get("id")
            email = user_data.get("mail") or user_data.get("userPrincipalName")
            name = user_data.get("displayName")
            job_title = user_data.get("jobTitle")
            department = user_data.get("department")

            # Save or update MicrosoftUser in DB
            user, created = MicrosoftUser.objects.update_or_create(
                microsoft_id=microsoft_id,
                defaults={
                    "display_name": name,
                    "email": email,
                    "job_title": job_title,
                    "department": department,
                }
            )

            return Response(
                {"status": "ok", "user": {"id": user.id, "email": user.email, "name": user.display_name}},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
