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