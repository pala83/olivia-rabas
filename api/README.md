# API del KDS

Backend del sistema de comandas para cocina (KDS): la recepcionista crea las comandas y el cocinero cambia su estado. Está hecho con Bun (`Bun.serve` para HTTP + WebSocket, `bun:test`) y Drizzle ORM sobre libsql, así que el mismo código funciona contra un archivo SQLite local o contra una base de datos en Turso.

## Configuración de la base de datos

Copiar `.env.example` a `.env` (Bun lo carga automáticamente) y elegir el destino:

| Variable             | Se usa con | Significado                                                                  |
| -------------------- | ---------- | ---------------------------------------------------------------------------- |
| `DB_TARGET`          | siempre    | `local` (por defecto) o `turso`                                              |
| `LOCAL_DB_FILE`      | `local`    | Ruta del archivo SQLite; por defecto `data/kds.db` (la carpeta se crea sola) |
| `TURSO_DATABASE_URL` | `turso`    | Por ejemplo `libsql://<db>-<org>.turso.io`                                   |
| `TURSO_AUTH_TOKEN`   | `turso`    | Token de la base de datos                                                    |

`src/config/database.config.ts` resuelve estas variables tanto para la aplicación como para `drizzle.config.ts`, así `drizzle-kit` siempre apunta a la misma base de datos que el servidor. Si faltan las variables de Turso o `DB_TARGET` tiene un valor desconocido, el proceso se detiene con un error explícito.

Al arrancar, el servidor aplica las migraciones pendientes y, si la tabla `PRODUCTO` está vacía, carga el catálogo inicial de productos (seed). `createServer({ migrate: false })` omite las migraciones. Así arranca en Vercel (`main.ts` lo decide según la variable `VERCEL`), porque ahí las migraciones corren en el build con `bun run db:migrate` (ver el README de la raíz).

## Comandos

Se ejecutan desde `api/`. También se pueden correr desde la raíz del repositorio con `bun --filter @olivia-rabas/api <script>`; `bun dev` en la raíz levanta la api y el cliente juntos.

| Comando                       | Qué hace                                              |
| ----------------------------- | ----------------------------------------------------- |
| `bun run dev` / `start`       | Inicia el servidor (con / sin recarga al guardar)     |
| `bun test`                    | Corre los tests (`bun test -t "<nombre>"` para uno)   |
| `bun run typecheck`           | Chequea los tipos con `tsc`                           |
| `bun run check` / `check:fix` | Lint + formato con Biome                              |
| `bun run db:generate`         | Genera una migración en `drizzle/` a partir de los schemas |
| `bun run db:migrate`          | Aplica las migraciones en la base de datos configurada |
| `bun run db:studio`           | Abre Drizzle Studio sobre la base de datos configurada |

Después de modificar un `*.schema.ts`, correr `db:generate` y commitear la nueva carpeta de `drizzle/`. El README de la raíz explica el flujo completo de migraciones.

## Endpoints HTTP

| Método  | Ruta                     | Body                                                                    | Respuesta                        |
| ------- | ------------------------ | ----------------------------------------------------------------------- | -------------------------------- |
| `GET`   | `/api/products`          | —                                                                       | `Product[]`                      |
| `GET`   | `/api/orders`            | —                                                                       | `Order[]`, de la más antigua a la más reciente |
| `GET`   | `/api/orders/:id`        | —                                                                       | `Order`                          |
| `GET`   | `/api/orders/:id/items`  | —                                                                       | `OrderItem[]`                    |
| `POST`  | `/api/orders`            | `{ customerName, notes?, items: [{ productId, quantity, withSalt? }] }` | `201 Order`                      |
| `PATCH` | `/api/orders/:id/status` | `{ status }`                                                            | `Order`                          |

- `status` es uno de `ORDERED`, `IN_PREPARATION`, `DELAYED`, `FINISHED`. Toda comanda nueva empieza en `ORDERED`, y el cocinero puede moverla a cualquier estado.
- `withSalt` es obligatorio en los productos `FOOD` y debe omitirse (o ser `null`) en los productos `DRINK`.
- `createdAt` lo asigna el servidor y nunca cambia; el cronómetro de la UI arranca desde ese momento.
- `updatedAt` lo asigna el servidor: al crear la comanda vale lo mismo que `createdAt`, y pasa a ser la hora de cada cambio **real** de estado. Pedir el mismo estado que ya tiene no cambia ninguna hora. En una comanda `FINISHED` es la hora de entrega.
- `timerStartedAt` es el arranque del reloj de cocina. El reloj muestra `ahora − timerStartedAt` y, cuando la comanda está `FINISHED`, queda detenido en `updatedAt − timerStartedAt`. Al crear la comanda vale `createdAt`. Si una comanda entregada se reabre (pasa de `FINISHED` a otro estado), avanza exactamente el tiempo que estuvo entregada, así el reloj retoma desde el total en que se había detenido.
- Los errores devuelven `{ "error": string }` con `400` (validación) o `404` (no encontrado). Los mensajes de validación los genera zod (`z.prettifyError`): una línea `✖ mensaje` por cada problema, seguida de `→ at <campo>`.

`kds-api.http`, en la raíz del repositorio, tiene una request de ejemplo para cada endpoint, lista para usar con la extensión REST Client de VS Code.

## WebSocket

Conectarse a `ws://<host>/ws` para recibir cada cambio de una comanda en formato JSON:

```json
{ "type": "order.created", "order": { "...": "Order" } }
{ "type": "order.status_changed", "order": { "...": "Order" } }
```

## Estructura

Hay una carpeta por tabla (`PRODUCTO`, `COMANDA`, `ITEM_COMANDA`). Cada una tiene su schema de Drizzle y su controller (rutas HTTP), y además un service cuando hay reglas de negocio o validación de datos de entrada:

- `src/producto/`: schema + controller. El controller lee el catálogo directamente porque no hay datos de entrada que validar.
- `src/comanda/`: schema + service + controller. El service valida las comandas, aplica la regla de la sal, cambia los estados y publica los eventos.
- `src/item-comanda/`: schema + service de solo lectura + controller. Los ítems se crean junto con su comanda en `comanda.service.ts`.
- `src/db/`: cliente de Drizzle, barrel de schemas, relaciones, migrador y seed.
- `src/config/`: elección de la base de datos.
- `src/realtime/`: publicador de eventos por WebSocket.
- `src/shared/`: helpers HTTP, errores base y los schemas compartidos `idSchema` / `jsonBodySchema`.

### Validación

Los controllers solo pasan a los services los parámetros de la ruta y el body como texto, sin procesar. Los services son el único lugar donde se validan los datos de entrada.

Cada carpeta que valida datos de entrada tiene una carpeta `types/` con tres archivos:

- `*.types.ts`: los tipos del módulo.
- `*.validation.ts`: los schemas de zod.
- `*.errors.ts`: las clases de error propias del módulo.

Para validar, el service llama a `safeParse` y, si los datos no son válidos, lanza su propio error. Los errores de cada módulo extienden `ValidationError` (400) o `NotFoundError` (404), definidos en `src/shared/types/shared.errors.ts`; `withErrorHandling` los convierte en respuestas HTTP.

Dos reglas de Biome hacen cumplir esto:

- `biome-plugins/no-runtime-typeof.grit` rechaza los chequeos `typeof` en tiempo de ejecución dentro de `src/` y `tests/`. Las consultas de tipo de TypeScript, como `z.infer<typeof schema>`, están permitidas.
- `noExplicitAny` es un error en todo el repositorio.

No se escribe SQL a mano: las consultas usan el query builder de Drizzle y `drizzle/` contiene las migraciones generadas. Los nombres de las tablas siguen `client/docs/er-diagram.md`.
