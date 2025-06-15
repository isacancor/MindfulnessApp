# Mindfulness App

Proyecto **fullstack** para una aplicación de mindfulness, con el frontend en **React**, **Vite**, y **Tailwind CSS**, y el backend con **Django** y **PostgreSQL**.

---

## Estructura del Proyecto

- /backend: API Django + Base de datos PostgreSQL
- /frontend: Aplicación React (JSX) con Vite y Tailwind

---

## Tecnologías

- **Frontend**:

  - React (JSX)
  - Vite
  - Tailwind CSS
  - React Router

- **Backend**:
  - Django
  - PostgreSQL
  - psycopg (driver PostgreSQL)

---

## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- **Node.js** (v14 o superior) - [Instalar Node.js](https://nodejs.org)
- **Python** (v3.9 o superior) - [Instalar Python](https://www.python.org)
- **PostgreSQL** - [Instalar PostgreSQL](https://www.postgresql.org/download/)

---

## Configuración de Backend (Django)

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/isacancor/MindfulnessApp.git
   cd MindfulnessApp/backend
   ```

2. **Crea un entorno virtual para Python (recomendado):**:

   ```bash
   python -m venv venv
   source venv/bin/activate   # En Linux/Mac
   venv/Scripts/Activate      # En Windows
   ```

3. **Instala las dependencias de Python:**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configura las variables de entorno del backend:**:
   Copia el archivo `.env.example` a `.env` en la carpeta /backend y edítalo con la información correcta (como el nombre de la base de datos y credenciales):

   ```bash
   cp .env.example .env
   ```

5. **Realiza las migraciones de la base de datos:**:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Popula la base de datos:**:

   ```bash
   python populate_db.py
   ```

7. **Levanta el servidor de desarrollo:**:

   ```bash
   python manage.py runserver
   ```

Ahora tu backend debería estar corriendo en `http://localhost:8000`.

---

## Configuración de Frontend (React + Vite)

1. **Ir a la carpeta frontend**:

   ```bash
   cd ..
   cd frontend
   ```

2. **Instala las dependencias de Node:**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno del frontend:**:
   Copia el archivo `.env.example` a `.env` en la carpeta /frontend y edítalo con la información correcta:

   ```bash
   cp .env.example .env
   ```

4. **Levanta el servidor de desarrollo:**:

   ```bash
   npm run dev
   ```

Ahora tu frontend debería estar corriendo en `http://localhost:3000`.

---

## Testing de backend

El proyecto incluye una suite completa de tests para validar la funcionalidad de la API. Los tests están organizados por módulos y cubren todos los endpoints principales.

### Estructura de Tests

```
backend/tests/
├── conftest.py              # Configuración y fixtures compartidas
├── test_settings.py         # Configuración específica para tests
└── test_api/
    ├── test_autenticacion_api.py    # Tests de autenticación y JWT
    ├── test_usuario_api.py          # Tests de gestión de usuarios
    ├── test_programa_api.py         # Tests de programas de mindfulness
    ├── test_sesion_api.py           # Tests de sesiones y diarios
    └── test_cuestionario_api.py     # Tests de cuestionarios y respuestas
```

### Ejecutar Tests

**Ejecutar todos los tests:**
```bash
cd backend
venv/Scripts/Activate
pytest
```

**Ejecutar tests con cobertura:**
```bash
pytest --cov
```

**Ejecutar tests de un módulo específico:**
```bash
# Tests de autenticación
python run_tests.py autenticacion

# Tests de usuarios
python run_tests.py usuario

# Tests de programas
python run_tests.py programa

# Tests de sesiones
python run_tests.py sesion

# Tests de cuestionarios
python run_tests.py cuestionario
```

**Ejecutar tests con salida detallada:**
```bash
pytest -v
```

**Ejecutar un test específico:**
```bash
pytest tests/test_api/test_usuario_api.py::TestUsuarioAPI::test_usuario_create_success
```

### Cobertura de Tests

Los tests actuales cubren:

- ✅ **Autenticación**: Login, logout, refresh tokens, registro
- ✅ **Usuarios**: CRUD completo, permisos, perfiles (investigador/participante)
- ✅ **Programas**: Creación, gestión, publicación, inscripciones, duplicación
- ✅ **Sesiones**: CRUD, diarios de sesión, tipos de práctica y contenido
- ✅ **Cuestionarios**: Creación, respuestas, validaciones, momentos (pre/post)

**Estadísticas de cobertura actual:**
- **104 tests** ejecutándose exitosamente
- **72% cobertura** general del código
- **100% de tests pasando** en todos los módulos

### Configuración de Tests

Los tests utilizan:
- **Base de datos en memoria** (SQLite) para mayor velocidad
- **Fixtures** reutilizables para datos de prueba
- **Autenticación JWT** simulada para tests de API
- **Transacciones** que se revierten automáticamente
