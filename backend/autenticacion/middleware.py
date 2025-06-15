from django.http import JsonResponse
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.deprecation import MiddlewareMixin
import html
import json
import re

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Obtener el token del encabezado de autorización
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
            
        try:
            # Extraer el token
            token = auth_header.split(' ')[1]
            
            # Validar el token
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            
            # Obtener el usuario
            user = jwt_auth.get_user(validated_token)
            
            # Asignar el usuario a la solicitud
            request.user = user
            
        except (InvalidToken, TokenError) as e:
            return JsonResponse({
                'error': 'Token inválido o expirado',
                'detail': str(e)
            }, status=401)
            
        except Exception as e:
            return JsonResponse({
                'error': 'Error de autenticación',
                'detail': str(e)
            }, status=401)
            
        return None 

class DataSanitizationMiddleware(MiddlewareMixin):
    def sanitize_value(self, value):
        if isinstance(value, str):
            # Escapar HTML
            value = html.escape(value)
            # Remover posibles scripts
            value = re.sub(r'<script.*?>.*?</script>', '', value, flags=re.DOTALL)
            # Remover otros patrones potencialmente peligrosos
            value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
            value = re.sub(r'on\w+\s*=', '', value, flags=re.IGNORECASE)
            return value
        elif isinstance(value, dict):
            return {k: self.sanitize_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [self.sanitize_value(item) for item in value]
        return value

    def process_request(self, request):
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                if request.content_type == 'application/json':
                    if request.body:
                        data = json.loads(request.body)
                        sanitized_data = self.sanitize_value(data)
                        request._body = json.dumps(sanitized_data).encode('utf-8')
                elif request.POST:
                    request.POST = self.sanitize_value(request.POST.dict())
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        return None 