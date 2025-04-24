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

4. **Configura las variables de entorno:**:
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

3. **Configura las variables de entorno:**:
   Copia el archivo `.env.example` a `.env` en la carpeta /frontend y edítalo con la información correcta:

   ```bash
   cp .env.example .env
   ```

4. **Levanta el servidor de desarrollo:**:

   ```bash
   npm run dev
   ```

Ahora tu frontend debería estar corriendo en `http://localhost:3000`.
