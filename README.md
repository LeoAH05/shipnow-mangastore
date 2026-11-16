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

## Logging con Winston

### Herramienta utilizada
Winston con rotación diaria de archivos mediante `winston-daily-rotate-file`.

### Niveles de log
| Nivel   | Descripción                        |
|---------|-----------------------------------|
| fatal   | Fallas críticas del sistema        |
| error   | Errores inesperados del servidor   |
| warning | Errores de negocio esperados       |
| info    | Eventos importantes del servidor   |
| http    | Requests HTTP                      |
| debug   | Información detallada (desarrollo) |

### Endpoint de prueba
GET /api/logger/test → Genera logs en todos los niveles

### Archivos de logs
Los logs se guardan en la carpeta `/logs/`:
- `error-YYYY-MM-DD.log` → solo errores y fatales
- `combined-YYYY-MM-DD.log` → todos los niveles

Los archivos de logs NO se suben a GitHub (.gitignore).

### Comportamiento por entorno
- **development**: muestra desde nivel `debug`
- **production**: muestra desde nivel `info`

## Documentación de la API (Swagger)

### Acceso
Con el servidor levantado, la documentación interactiva está en:

http://localhost:8080/api/docs

### Cómo levantar el servidor
1. npm install
2. Crear el archivo .env a partir de .env.example
3. node src/app.js

### Módulos documentados
- **Users**: GET, POST, PUT y DELETE de usuarios
- **Products**: GET, POST, PUT y DELETE de productos
- **Mocks**: generación de usuarios y productos simulados (GET) y carga de datos de prueba en MongoDB (POST /api/mocks/seed)
- **Logger**: GET /api/logger/test (herramienta de validación del sistema de logs, no es una funcionalidad de negocio)
- **Orders**: GET, POST, PUT y DELETE de pedidos (el total se calcula automáticamente; filtros por status y priority)
- **Deliveries**: GET, POST, PUT y DELETE de entregas (asociadas a un pedido y, opcionalmente, a un repartidor con rol delivery)
### Schemas reutilizables
User, Product, Order, Delivery, ErrorResponse y SuccessResponse.

### Errores documentados
Todos los errores usan la estructura { status, errorCode, message }. Entre ellos: recurso no encontrado (404), campos faltantes o email duplicado (400), cantidad inválida en mocks (400) y error interno (500).

### Aclaraciones para probar
- Desde Swagger UI, usá el botón "Try it out" en cada endpoint.
- Para POST /api/mocks/seed el orden recomendado es: users, products, orders y deliveries.
- La configuración de Swagger está separada de las rutas en src/config/swagger.js.

## Testing

### Herramientas
- **Mocha**: organiza y ejecuta los tests.
- **Chai**: validaciones (expect).
- **Supertest**: peticiones HTTP a la app Express, sin abrir un puerto.
- **cross-env**: permite definir NODE_ENV=test en Windows, Mac y Linux.

### Cómo ejecutar los tests
1. npm install
2. Crear el archivo `.env.test` a partir de `.env.test.example`
3. npm test

### Entorno de testing separado
Se usa una base de datos exclusiva: `mangastore_test`. Los tests leen `.env.test` (cuando NODE_ENV=test) y se niegan a correr si la URI no apunta a una base que termine en `_test`, para no tocar nunca datos reales. La app (`src/app.js`) está separada del arranque del servidor (`src/server.js`), por eso Supertest la importa sin abrir un puerto.

### Variables de entorno necesarias (.env.test)
- PORT: puerto de test (ej. 8081)
- MONGODB_URI: conexión a la base de test (ej. .../mangastore_test)
- NODE_ENV: test

### Módulos cubiertos
- **Users**: listar, consultar por ID, crear; errores 404 y 400 (campos faltantes, email duplicado).
- **Orders**: listar (con filtro por estado), consultar por ID, crear (total calculado), actualizar estado; errores 400 y 404.
- **Deliveries**: listar, crear, consultar; errores 400 y 404.
- **Mocks**: generar usuarios y productos, seed en MongoDB; errores por cantidad negativa, entidad inválida y dependencias faltantes.
- **Logger**: GET /api/logger/test.
- **Swagger**: GET /api/docs/.
- **Ruta inexistente**: 404 ROUTE_NOT_FOUND.
- **Products**: listar (con filtro por categoría), consultar por ID, crear, actualizar (incluye paso a out_of_stock) y eliminar; errores 400 y 404.

Los errores se validan con el formato { status, errorCode, message } definido en el módulo de manejo de errores.

### Datos de prueba y limpieza
Cada grupo crea sus propios datos antes de cada test (usuarios, productos y pedidos de ejemplo) y vacía las colecciones con `beforeEach` y `after`. Al terminar toda la suite se elimina la base de test completa. Los tests no dependen del orden ni de datos cargados a mano, y la suite se puede correr varias veces seguidas.

## Carga de archivos (Multer)

### Endpoints
- `POST /api/uploads/users/:id/documents`: sube un documento de usuario. Campo del archivo: `document`. Campo opcional `documentType`: dni, license, address_proof u other (por defecto other).
- `POST /api/uploads/receipts/:entity/:id`: sube un comprobante. `:entity` es `orders` o `deliveries`. Campo del archivo: `receipt`.

Ejemplo con curl:
```bash
curl -X POST http://localhost:8080/api/uploads/users/ID_USUARIO/documents \
  -F "documentType=dni" -F "document=@dni.pdf"
```
También se pueden probar desde Swagger (`/api/docs`, sección Uploads).

### Reglas de validación
- Tipos permitidos: PDF, JPG y PNG.
- Tamaño máximo: 2 MB.
- Un solo archivo por request y con el nombre de campo esperado.
- Si la entidad no existe o los datos son inválidos, el archivo se elimina y no queda huérfano.

### Dónde se guardan
- Configuración centralizada en `src/config/multer.js`.
- Archivos en `uploads/documents/` (documentos de usuario) y `uploads/receipts/` (comprobantes), con nombre generado único.
- La carpeta `uploads/` está en `.gitignore`: los archivos subidos no se suben al repositorio.
- La ruta se configura con la variable `UPLOADS_DIR` (por defecto `uploads`; en testing `uploads_test`).

### Qué se guarda en la base
Solo metadatos (nunca el archivo): originalName, storedName, path, mimeType, size, documentType y uploadedAt.
Se guardan en `User.documents`, `Order.receipts` y `Delivery.receipts`.

### Errores
Mismo formato `{ status, errorCode, message }`: FILE_REQUIRED, FILE_INVALID_TYPE, FILE_TOO_LARGE (413), FILE_INVALID_FIELD, DOCUMENT_TYPE_INVALID, UPLOAD_INVALID_ENTITY, USER_NOT_FOUND, ORDER_NOT_FOUND, DELIVERY_NOT_FOUND y FILE_SAVE_ERROR (500).

### Logging
Se registran la carga exitosa, el comprobante asociado, el intento de subir un tipo no permitido y los errores al guardar.

### Tests
`tests/uploads.test.js` cubre la carga correcta, archivo faltante, tipo de archivo y de documento inválidos, tamaño excedido, campo incorrecto y entidad inexistente. Usa la carpeta `uploads_test` y la limpia al terminar.