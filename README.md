# Billing Microservice

Microservicio de facturación encargado de administrar el **catálogo de planes** y las **suscripciones** de cada tenant.

Expone una API REST para dar de alta y mantener los planes comerciales (precio y límites de almacenamiento y de ejecuciones) y modela las suscripciones que vinculan a cada tenant con un plan, junto con su estado y su período de facturación vigente.

## Stack

- **NestJS 12** sobre Node.js (CommonJS)
- **Prisma 6** como ORM
- **PostgreSQL** como base de datos
- **Swagger / OpenAPI** para la documentación de la API
- **class-validator** para la validación de los DTOs

## Requisitos previos

| Requisito | Versión | Notas |
|---|---|---|
| Node.js | `20.19+` o `22.12+` | La línea `21.x` no está soportada por NestJS 12 |
| npm | `10+` | Incluido con Node.js |
| Docker | Cualquiera reciente | Opcional, para levantar PostgreSQL localmente |
| PostgreSQL | `14+` recomendado | Si no usas Docker, necesitas una instancia propia |

## Configuración

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la cadena de conexión:

```env
DATABASE_URL="postgresql://admin:secretpassword@localhost:5433/billing_db?schema=public"
```

### 2. Base de datos

Si usas Docker, este contenedor coincide con la cadena de conexión anterior (mapea el puerto `5433` del host al `5432` del contenedor para no chocar con una instalación local de PostgreSQL):

```bash
docker run --name billing-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=secretpassword -e POSTGRES_DB=billing_db -p 5433:5432 -d postgres:16
```

### 3. Dependencias

```bash
npm install
```

### 4. Cliente de Prisma

Genera el cliente tipado a partir de `prisma/schema.prisma`:

```bash
npx prisma generate
```

Debes volver a ejecutarlo cada vez que modifiques el esquema.

### 5. Migraciones

Aplica el esquema a la base de datos:

```bash
npx prisma migrate dev
```

En un entorno de producción usa en su lugar:

```bash
npx prisma migrate deploy
```

## Ejecución

```bash
# desarrollo con recarga automática
npm run start:dev

# desarrollo
npm run start

# producción
npm run build
npm run start:prod
```

El servicio escucha en el puerto `3000` por defecto, configurable con la variable de entorno `PORT`.

## Documentación de la API

Con el servidor levantado, la documentación interactiva de Swagger queda disponible en:

**http://localhost:3000/docs**

Desde ahí puedes explorar y probar cada endpoint con los esquemas de request y response.

## Endpoints

### Plans

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/plans` | Crea un plan |
| `GET` | `/plans` | Lista los planes, del más reciente al más antiguo |
| `GET` | `/plans/:id` | Obtiene un plan por su UUID |
| `PATCH` | `/plans/:id` | Actualiza parcialmente un plan |
| `DELETE` | `/plans/:id` | Elimina un plan (`204 No Content`) |

Notas de comportamiento:

- Un `id` que no sea un UUID válido se rechaza con `400`.
- Un plan inexistente devuelve `404`.
- Eliminar un plan que todavía tiene suscripciones asociadas devuelve `409 Conflict`: la relación está declarada con `onDelete: Restrict`.
- El campo `price` se serializa como **string** en las respuestas JSON. Es intencional: la columna es `DECIMAL(10,2)` y devolverla como número la degradaría a un flotante de doble precisión en el cliente.

## Modelo de datos

- **`Plan`** (`plans`) — catálogo comercial: `name`, `price`, `maxStorage`, `maxExecutions`.
- **`Subscription`** (`subscriptions`) — vincula un `tenantId` con un plan, con su `status` (`ACTIVE`, `CANCELED`, `PAST_DUE`) y el período vigente (`currentPeriodStart`, `currentPeriodEnd`).

Las tablas y columnas se mapean a `snake_case` en PostgreSQL mediante `@map` y `@@map`.

Para inspeccionar los datos con una interfaz gráfica:

```bash
npx prisma studio
```

## Calidad

```bash
# tests unitarios
npm run test

# tests end-to-end
npm run test:e2e

# cobertura
npm run test:cov

# linter
npm run lint

# formateo
npm run format
```

## Estructura del proyecto

```
prisma/
  schema.prisma          # Esquema de la base de datos
src/
  main.ts                # Bootstrap: ValidationPipe global y Swagger
  app.module.ts          # Módulo raíz
  prisma/
    prisma.module.ts
    prisma.service.ts    # Extiende PrismaClient y gestiona el ciclo de conexión
  plans/
    plans.module.ts
    plans.controller.ts
    plans.service.ts
    dto/
      create-plan.dto.ts
      update-plan.dto.ts
```

## Licencia

UNLICENSED — uso interno.
