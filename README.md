# shipnow-mangastore
# ShipNow - MangaStore 🎌

API REST para una tienda de comics y mangas japoneses, desarrollada con Node.js, Express y MongoDB.

## Instrucciones para correr el proyecto localmente

1. Clonar el repositorio:
git clone https://github.com/LeoAH05/shipnow-mangastore.git
cd shipnow-mangastore

2. Instalar dependencias:
npm install

3. Crear archivo .env basado en .env.example:
PORT=8080
MONGODB_URI=mongodb+srv://...
NODE_ENV=development

4. Ejecutar el servidor:
node src/app.js

5. Acceder a la API:
http://localhost:8080/api/products
http://localhost:8080/api/users

## Arquitectura por capas

### ¿Por qué separar Service y Repository?

**Repository** se encarga únicamente de comunicarse con la base de datos. Encapsula las consultas a MongoDB, aplica filtros por defecto y proyecciones. No conoce ninguna lógica de negocio.

**Service** contiene la lógica de negocio. Por ejemplo, cuando el stock de un producto llega a 0, el Service actualiza automáticamente el status a OUT_OF_STOCK. También valida datos y verifica duplicados antes de crear usuarios. El Service nunca importa Mongoose directamente.

**Controller** solo gestiona el request y response HTTP. Llama al Service y retorna el status code apropiado.

## Endpoints de Mocking

### Generar datos sin guardar

GET /api/mocks/users?qty=5 → Genera 5 usuarios simulados
GET /api/mocks/products?qty=5 → Genera 5 productos simulados

### Insertar datos en MongoDB (seed)

POST /api/mocks/seed?entity=users&qty=10 → Inserta 10 usuarios
POST /api/mocks/seed?entity=products&qty=10 → Inserta 10 productos
POST /api/mocks/seed?entity=orders&qty=10 → Inserta 10 pedidos (requiere usuarios)
POST /api/mocks/seed?entity=deliveries&qty=10 → Inserta 10 entregas (requiere pedidos)

### Orden recomendado para seed completo

1. POST /api/mocks/seed?entity=users&qty=10
2. POST /api/mocks/seed?entity=products&qty=10
3. POST /api/mocks/seed?entity=orders&qty=10
4. POST /api/mocks/seed?entity=deliveries&qty=10

## Manejo de Errores

### Estructura de respuesta de error

Todos los errores responden con esta estructura uniforme:

```json
{
  "status": "error",
  "errorCode": "CODIGO_DEL_ERROR",
  "message": "Descripción del error"
}
```

### Casos de error para probar

#### Producto no encontrado (404):
GET /api/products/000000000000000000000000

#### Usuario no encontrado (404):
GET /api/users/000000000000000000000000

#### Campos faltantes (400):
POST /api/products con body vacío {}

#### Email duplicado (400):
POST /api/users con un email ya registrado

#### Mock con cantidad inválida (400):
GET /api/mocks/users?qty=-5

#### Mock con entidad inválida (400):
POST /api/mocks/seed sin el parámetro entity

#### Mock sin usuarios previos (400):
POST /api/mocks/seed?entity=orders sin haber creado usuarios