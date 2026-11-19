# Cliente del KDS

Frontend del sistema de comandas para cocina (KDS), hecho con React 19 + TypeScript + Vite. Es una pantalla única: el tablero de cocina ocupa el área principal y el panel de carga de comandas queda a la derecha. El diseño sale del lienzo «KDS · Sistema de diseño» de Claude Design; el alcance del producto está descrito en `client/CLAUDE.md` y el modelo de datos en `docs/er-diagram.md`.

## Las pantallas

El diseño sale del lienzo «KDS · Sistema de diseño» de Claude Design (versión «Fritería»). Hay dos pantallas, cada una con su ruta de [TanStack Router](https://tanstack.com/router). Las rutas se definen por archivo en `src/routes/`, con el plugin de Vite:

- **`/` · Recepción** (`ReceptionLayout`): tres columnas que se reacomodan solas.
  - **Kraft, «Nueva comanda»:** "Mesa o cliente" (si queda vacío se envía "Sin mesa"), los productos cargados con − y +, la nota de hasta 80 caracteres y "Enviar a cocina".
  - **Centro, el menú:** «Fritura», con una tarjeta con ilustración por cada comida y los botones "Con sal" y "Sin sal" (`withSalt`). «Bebidas», agrupadas por `containsAlcohol`; tocar una suma una unidad.
  - **Acero, «En cocina»:** un resumen con la cantidad de comandas pendientes, las 6 más nuevas en versión compacta, cuántas más hay y el botón "Maximizar".
- **`/cocina` · Tablero de cocina** (`KitchenLayout`): cuatro carriles (Pedido, En preparación, Urgente y Entregado, que en la API son `ORDERED`, `IN_PREPARATION`, `DELAYED` y `FINISHED`), con scroll horizontal cuando no entran. Los tickets cuelgan del riel de acero y se mueven arrastrándolos ([Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop)) o con el botón de la tarjeta. "Volver a recepción" vuelve a la otra pantalla.
- **Transición entre pantallas:** usa la View Transitions API (`defaultViewTransition` del router). Los links indican la dirección con los tipos `to-kitchen` y `to-reception`, que `index.css` anima; el header queda quieto. Si el navegador no tiene la API, o si el equipo tiene activado "reducir movimiento", el cambio de pantalla es instantáneo.
- **Reloj:** cuenta desde `createdAt`. Es verde hasta los 5 minutos, amarillo hasta los 10 y rojo con fuego después; la barra de progreso se llena en 10 minutos. Como dice el diseño ("Pasan a Urgente a los 10 min"), una comanda no entregada con 10 minutos o más **se muestra** en Urgente; en la API sigue con su estado hasta que alguien la mueva.
- **Tiempo real:** un solo WebSocket para toda la app (`OrdersProvider`). La comanda en armado sobrevive al ir y volver de la cocina (`OrderDraftProvider`).
- **Fuera del diseño:** el combo no está porque la API no lo soporta. El número de la próxima comanda no se muestra porque lo asigna la API al crearla.
- **Reloj detenido y reabierto:** el reloj corre desde `timerStartedAt`, y al entregar la comanda se detiene en `updatedAt − timerStartedAt`. Si se reabre, sigue desde ese total: el tiempo que estuvo entregada no se cuenta. Las horas las pone el servidor, así que todas las pantallas muestran lo mismo. Al mover una tarjeta, el cliente aplica la misma regla con la hora local (`timerStartAfter`) hasta que llega la respuesta.

### Estructura

Hay un componente por archivo. Un componente formado por otros es una carpeta con un archivo por componente (por ejemplo `OrderTicket/`: `OrderTicket`, `TicketHeader`, `StatusBadge`, `TimerBadge`, `WaitProgress`, `ItemSection`, `ItemLine` y `OrderNote`). `src/components/ui` es la excepción, porque lo genera shadcn.

- `src/routes/`: una ruta por archivo (`__root.tsx`, `index.tsx` para `/` y `cocina.tsx` para `/cocina`). Cada archivo solo declara la ruta y apunta a su página. `@tanstack/router-plugin` genera `src/routeTree.gen.ts` al correr `bun run dev` o `bun run build`. Ese archivo se commitea, no se edita a mano y Biome no lo analiza. Para agregar una pantalla alcanza con crear un archivo en `src/routes/`.
- `src/router.ts`: crea el router a partir del árbol generado y activa las transiciones (`defaultViewTransition`).
- `src/app/AppRoot.tsx`: el componente de la ruta raíz (los providers y el `<Outlet />`).
- `src/layouts/`: `ReceptionLayout/` y `KitchenLayout/`, que definen la estructura de cada pantalla.
- `src/pages/`: `ReceptionPage/` y `KitchenPage/`, que llenan cada layout con las features.
- `src/contexts/`: una carpeta por contexto, con tres archivos: el `createContext` (`*.context.ts`), el Provider (`*Provider.tsx`) y el hook con `useContext` (`use-*-context.ts`). Hoy existen `orders/` y `order-draft/`.
- `src/features/orders/`: la API de comandas, `useOrders`, `useNow`, los estados del diseño (`order-status.ts`, `timer-view.ts`), los tiempos (`order-time.ts`), el arrastrar y soltar (`order-dnd.ts`) y las carpetas `OrderTicket/`, `CompactOrder/`, `KitchenPanel/` y `KitchenBoard/`.
- `src/features/catalog/`: el catálogo, `product-art.ts` (la ilustración de cada producto, según su nombre) y `ProductMenu/`.
- `src/features/order-draft/`: `useOrderDraft` y `DraftPanel/`.
- `src/components/`: piezas compartidas (`AppHeader/`, `SaltTag`, `EmptyState`, `SteelRail`, los íconos propios del diseño) y `ui/` (shadcn).
- `src/assets/`: las texturas (`textures/`) y las ilustraciones (`products/`) descargadas del diseño. Biome no las analiza.

### API en desarrollo

Vite hace de proxy: `/api` y `/ws` van a `http://localhost:3000`, así que el navegador solo habla con el puerto de Vite. Para apuntar a otra API: `KDS_API_URL=http://localhost:3100 bun run dev`.

## Comandos

Se ejecutan desde `client/`. También se pueden correr desde la raíz del repositorio con `bun --filter @olivia-rabas/client <script>`; `bun dev` en la raíz levanta el cliente y la api juntos.

| Comando                           | Qué hace                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| `bun run dev`                     | Servidor de desarrollo de Vite con recarga en caliente (HMR) |
| `bun run build`                   | Chequea los tipos (`tsc -b`) y genera el build de producción |
| `bun run preview`                 | Sirve el build de producción                                 |
| `bun run check` / `check:fix`     | Lint + formato + orden de imports con Biome                  |
| `bun run lint` / `lint:fix`       | Solo el linter de Biome                                      |
| `bun run format` / `format:check` | Solo el formateador de Biome                                 |

Todavía no hay un test runner configurado.

## Plugins de React para Vite

Hay dos plugins oficiales:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Oxc](https://oxc.rs). Es el que usa este proyecto.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/).

## React Compiler

El React Compiler está activado mediante `@rolldown/plugin-babel` y `reactCompilerPreset()` en `vite.config.ts`. Ver [esta documentación](https://react.dev/learn/react-compiler) para más información. Como el compilador ya memoriza los componentes, no hace falta usar `useMemo`/`useCallback` a mano salvo que un profiling lo justifique.

Nota: esto afecta el rendimiento de Vite en desarrollo y en el build. También se puede probar el [soporte nativo experimental del React Compiler en plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler), usando `compiler: true` en las opciones del plugin en lugar del plugin de Babel.

## Lint y formato

El proyecto usa [Biome](https://biomejs.dev) en lugar de Oxlint. La configuración está en el `biome.json` de la raíz del repositorio y la comparten todos los paquetes: indentación con tabs, comillas dobles, reglas recomendadas, imports ordenados y `noExplicitAny` como error. Biome ignora todo lo que esté en cualquier `.gitignore`.

## Componentes de UI (shadcn/ui) y tema

Los componentes vienen de [shadcn/ui](https://ui.shadcn.com) (estilo `base-nova`, sobre [Base UI](https://base-ui.com)): `button`, `button-group`, `badge`, `card`, `input`, `textarea`, `label`, `alert`, `progress`, `separator` y `scroll-area`. `button.tsx` es el único con cambios: los tamaños del diseño (sm 32 px, default 36 y lg 40) y la variante `primary-gradient` para "Enviar a cocina".

El tema está en `src/index.css`, que solo cambia los **valores** de las variables de shadcn. **No se crean variables nuevas**; los roles propios del KDS reutilizan las existentes:

| Variable                  | Uso en el KDS                  |
| ------------------------- | ------------------------------ |
| `--chart-1`               | Pedido                         |
| `--primary`               | En preparación                 |
| `--destructive`           | Urgente y Demorado             |
| `--chart-2`               | A tiempo y franja de Entregado |
| `--chart-3` y `--chart-5` | Badge y texto de Entregado     |
| `--chart-4`               | Atención                       |
| `--muted`                 | Tiempo total                   |
| `--sidebar`               | Kraft                          |
| `--sidebar-accent`        | Acero                          |
| `--sidebar-primary`       | Dorado de la marca             |
| `--font-serif`            | Lilita One, para los títulos   |

Las superficies del diseño son clases (`tx-papel`, `tx-kraft`, `tx-ticket`, `tx-acero`, `tx-freidora`, `tx-cuadros`, `tx-aceite`); las animaciones son `@keyframes` (`kds-in`, `kds-pop`, `kds-pulse`, `kds-burbuja`, `kds-new`, `kds-panel`) que se usan con `animate-[…]`. Las tipografías son Geist, Geist Mono y Lilita One, instaladas con fontsource.

Para agregar un componente, desde `client/`:

```bash
bunx --bun shadcn@latest add <componente>
```

Los imports usan el alias `@/` → `src/`, definido en `tsconfig.json`, `tsconfig.app.json` y `vite.config.ts`. No se usa `--monorepo`: ese flag crea un monorepo nuevo con `packages/ui` en lugar de agregar shadcn a este.
