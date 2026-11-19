# Olivia Rabas: KDS

Sistema de comandas para cocina (KDS, *kitchen display system*) para un local de conos de papas y rabas. La recepcionista carga las comandas de los clientes y el cocinero las ve en tiempo real y les cambia el estado mientras las prepara.

Es un monorepo con [Bun workspaces](https://bun.sh/docs/install/workspaces):

| Paquete  | Nombre                 | Qué es                                                                                     |
| -------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `api/`    | `@olivia-rabas/api`    | Backend en Bun (HTTP + WebSocket) con Drizzle ORM sobre SQLite local o Turso. Ver [`api/README.md`](api/README.md). |
| `client/` | `@olivia-rabas/client` | Frontend en React + Vite. Ver [`client/README.md`](client/README.md).                      |

## Requisitos

- [Bun](https://bun.sh) 1.4 o superior.
- Git.
- Opcional: VS Code con la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) para probar la API con `kds-api.http`.

No hace falta instalar SQLite: la base de datos local es un archivo que maneja libsql.

## Levantar el proyecto en modo desarrollo

1. **Clonar el repositorio y entrar a la carpeta:**

   ```bash
   git clone <url-del-repositorio> olivia-rabas
   cd olivia-rabas
   ```

2. **Instalar las dependencias.** Se hace una sola vez desde la raíz: Bun instala las de todos los paquetes y usa un único `bun.lock`.

   ```bash
   bun install
   ```

3. **Crear la configuración de la API:**

   ```bash
   cp api/.env.example api/.env
   ```

   Con los valores por defecto (`DB_TARGET=local`), la base de datos es el archivo `api/data/kds.db`, que se crea solo. Para usar Turso, ver [`api/README.md`](api/README.md#configuración-de-la-base-de-datos).

4. **Levantar todo:**

   ```bash
   bun dev
   ```

   Este comando levanta en paralelo la API y el cliente (`bun --filter '*' dev`):

   - **API:** `http://localhost:3000`, con WebSocket en `ws://localhost:3000/ws`. Se reinicia sola al guardar cambios (`bun --watch`).
   - **Cliente:** `http://localhost:5173` (puerto por defecto de Vite), con recarga en caliente. Vite redirige `/api` y `/ws` a la API, así que la interfaz se abre directamente en este puerto.

   La primera vez que arranca, la API crea la base de datos, aplica las migraciones y carga el catálogo inicial de productos. No hay que correr nada más.

5. **Comprobar que funciona:** abrir `http://localhost:3000/api/products`, que tiene que devolver el catálogo. También se puede abrir `kds-api.http` en VS Code y ejecutar las requests.

Para levantar un solo paquete: `bun run dev:api` o `bun run dev:client`.

## Otros comandos (desde la raíz)

| Comando             | Qué hace                                        |
| ------------------- | ----------------------------------------------- |
| `bun run test`      | Corre los tests de la API                       |
| `bun run check`     | Lint + formato con Biome en todo el repositorio |
| `bun run check:fix` | Lo mismo, aplicando las correcciones            |

## Migraciones con Drizzle ORM

La API no tiene SQL escrito a mano. Las tablas se definen en TypeScript y Drizzle genera el SQL de las migraciones a partir de esas definiciones.

### Las piezas

- **Schemas:** cada tabla se define en un archivo `*.schema.ts` dentro de su carpeta (`api/src/producto/`, `api/src/comanda/`, `api/src/item-comanda/`). `api/src/db/schema.ts` los reúne a todos. **Los schemas son la fuente de verdad** del modelo de datos.
- **`api/drizzle.config.ts`:** le dice a `drizzle-kit` dónde están los schemas (`./src/db/schema.ts`), dónde guardar las migraciones (`./drizzle`) y a qué base de datos conectarse. Esa conexión sale de `api/.env`, igual que la del servidor, así que `drizzle-kit` siempre trabaja sobre la misma base de datos que la API. Usa el dialecto `turso`, que sirve tanto para un archivo local (`file:`) como para Turso (`libsql://`).
- **`api/drizzle/`:** las migraciones generadas. Cada una es una carpeta `<fecha>_<nombre>/` con dos archivos:
  - `migration.sql`: el SQL que se ejecuta.
  - `snapshot.json`: una foto del modelo después de esa migración. `drizzle-kit` la compara con los schemas para saber qué cambió.
- **Tabla `__drizzle_migrations`:** Drizzle la crea dentro de la base de datos para registrar qué migraciones ya se aplicaron. Así cada migración se ejecuta una sola vez.

### Flujo para cambiar el modelo de datos

1. **Modificar el schema:** por ejemplo, agregar una columna en `api/src/producto/producto.schema.ts`.
2. **Generar la migración** (desde `api/`):

   ```bash
   bun run db:generate
   ```

   `drizzle-kit` compara los schemas con el último `snapshot.json` y crea una carpeta nueva en `api/drizzle/` con el SQL necesario. Si no cambió nada, avisa "No schema changes" y no crea nada.

3. **Revisar el `migration.sql` generado** antes de aplicarlo, sobre todo si la migración borra o renombra columnas, porque puede perder datos.
4. **Aplicar la migración**, de cualquiera de estas dos formas:
   - **Automática:** al reiniciar la API (`bun dev`), `runMigrations` (`api/src/db/migrate.ts`) aplica las migraciones pendientes antes de aceptar requests.
   - **Manual:** `bun run db:migrate` (desde `api/`), útil por ejemplo para migrar la base de datos de Turso sin levantar el servidor.
5. **Commitear la carpeta nueva de `api/drizzle/`** junto con el cambio en el schema, para que el resto del equipo y cada entorno apliquen la misma migración.
6. **Actualizar el diagrama** en `client/docs/er-diagram.md` para que siga coincidiendo con los schemas.

### Reglas

- **No modificar ni borrar una migración que ya se aplicó** (que ya está commiteada o se corrió en otra base de datos). Para corregir algo, se genera una migración nueva.
- **No editar `snapshot.json` a mano:** lo mantiene `drizzle-kit`.
- Para explorar los datos se puede abrir Drizzle Studio con `bun run db:studio` (desde `api/`).
- Para volver a empezar con la base de datos local vacía, borrar `api/data/kds.db` con la API apagada. Al levantarla de nuevo se recrea con todas las migraciones y el catálogo inicial. **Esto borra todas las comandas cargadas.**

## Deploy en Vercel (un solo proyecto)

El monorepo se deploya como **un único proyecto de Vercel** usando [Services](https://vercel.com/docs/services). La configuración está en `vercel.json`, en la raíz:

| Servicio | Carpeta | Qué hace en Vercel |
| -------- | ------- | ------------------ |
| `web` | `client/` | Build de Vite, servido como sitio estático. |
| `api` | `api/` | `src/main.ts` corre como Vercel Function con el [runtime de Bun](https://vercel.com/docs/functions/runtimes/bun) (`bunVersion`). Su comando de build es `bun run db:migrate`. |

Las `rewrites` mandan `/api/*` y `/ws` al servicio `api`, y todo lo demás al `web`. Como cliente y API comparten dominio, el cliente usa las mismas rutas relativas que en desarrollo y no necesita configuración extra.

### Diferencias con el entorno local

- **Base de datos: Turso.** Las funciones de Vercel tienen el disco de solo lectura (salvo `/tmp`, que se borra), así que en producción no se puede usar el archivo SQLite local.
- **Migraciones en el deploy.** El build del servicio `api` corre `bun run db:migrate` contra Turso. En Vercel la función no migra al arrancar: `main.ts` pasa `migrate: false` cuando existe la variable `VERCEL`. El seed sí corre al arrancar, y solo carga datos si `PRODUCTO` está vacía.
- **Tiempo real.** En Vercel, cada instancia de la función reparte los eventos de `/ws` solo entre sus propias conexiones, y la conexión se corta al llegar a la duración máxima de la función. Por eso el cliente, además del WebSocket, recarga las comandas cada 5 segundos y cada vez que la pestaña vuelve a estar visible. Una comanda nueva puede tardar hasta 5 segundos en aparecer en otra pantalla.

### Pasos

1. **Crear la base en [Turso](https://turso.tech)** con la CLI de Turso:

   ```bash
   turso db create olivia-rabas
   turso db show olivia-rabas --url       # → TURSO_DATABASE_URL
   turso db tokens create olivia-rabas    # → TURSO_AUTH_TOKEN
   ```

2. **Importar el repositorio en Vercel** como un solo proyecto. Elegir el framework preset **Services**, dejar el *Root Directory* en la raíz y verificar que **Fluid compute** esté activado: lo necesitan los WebSockets.
3. **Cargar las variables de entorno** del proyecto:
   - `DB_TARGET=turso`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

   Cargalas **solo para Production**, o apuntá Preview a otra base de Turso. Si no, cada deploy de preview corre las migraciones sobre la base de producción.
4. **Deployar.** Hacé push a la rama de producción, o corré `vercel --prod` con la [CLI de Vercel](https://vercel.com/docs/cli).
5. **Comprobar** que respondan `/api/products`, `/` y `/cocina`; en `/cocina`, entrando directo y también recargando la página.

El runtime de Bun en Vercel está en **beta**. Para probar el build sin deployar: `vercel pull` y después `vercel build`, con el proyecto ya vinculado.
