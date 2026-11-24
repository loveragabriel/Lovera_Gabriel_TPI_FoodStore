# Food Store

Trabajo Práctico Integrador de Programación IV · 

El TP se basa en una aplicación web para un negocio de comidas e integrar backend con FastAPI,  SQLModel, PostgreSQL; además de frontend con React,  TypeScript y uso de Vite. Los clientes navegan el catálogo, arman un carrito y confirman pedidos. Por otra parte los administradores gestionan categorías, productos, stock, pedidos y usuarios desde un panel propio.

Repositorio: https://github.com/loveragabriel/Lovera_Gabriel_TPI_FoodStore

Video de demostración: https://drive.google.com/file/d/1FtvsScydX7iBB5xEiGT0Q_SgzTgOEUns/view?usp=sharing

## Requisitos

- Python 3.11 a 3.13
- Node.js 20.19 o superior
- pnpm 9 o superior
- Docker (para levantar PostgreSQL localmente)

## Backend

### Instalación

```bash
cd backend
python -m venv .venv
```

Activar el entorno virtual:

```bash
.venv\Scripts\activate       # Windows (cmd o PowerShell)
source .venv/Scripts/activate # Windows (Git Bash)
source .venv/bin/activate     # Linux / macOS
```

```bash
pip install -r requirements.txt
cp .env.example .env
```

### Base de datos

El proyecto incluye un `docker-compose.yml` con PostgreSQL 16 en el puerto `5437`:

```bash
docker compose up -d
```

### Seed

Carga el usuario administrador, categorías y productos iniciales. Es idempotente, por lo cual se puede ejecutar varias veces sin duplicar datos.

```bash
python -m app.db.seed
```

**Usuario administrador del seed:** `admin` / `Admin1234!`

### Ejecución

```bash
uvicorn app.main:app --reload
```

La API queda disponible en `http://localhost:8000`, documentada en `http://localhost:8000/docs` y `http://localhost:8000/redoc`.

### Variables de entorno (`backend/.env`)

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `SECRET_KEY` | Clave de firma del JWT (mínimo 32 caracteres) |
| `ALGORITHM` | Algoritmo de firma del JWT (`HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Minutos de validez del token y la cookie |
| `FRONTEND_ORIGIN` | Origen permitido en CORS |

## Frontend

### Instalación

```bash
cd frontend
pnpm install
cp .env.example .env
```

### Ejecución

```bash
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Build de producción

```bash
pnpm build
```

Corre la verificación de tipos de TypeScript (`tsc -b`) y genera el build con Vite en `frontend/dist`.

### Variables de entorno (`frontend/.env`)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base de la API del backend |

## Estructura del proyecto

```
backend/    API REST (FastAPI + SQLModel + PostgreSQL)
frontend/   Aplicación web (React + TypeScript + Vite)
```

Cada carpeta sigue una arquitectura en capas (backend: Router → Service → Unit of Work → Repository → Model) y por features (frontend: `shared/`, `features/`, `store/`, `routes/`).
