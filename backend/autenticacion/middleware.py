from django.http import JsonResponse
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.deprecation import MiddlewareMixin

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