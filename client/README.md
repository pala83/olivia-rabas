# Cliente del KDS

Frontend del sistema de comandas para cocina (KDS), hecho con React 19 + TypeScript + Vite. Es una pantalla única: el tablero de cocina ocupa el área principal y el panel de carga de comandas queda a la derecha. El diseño sale del lienzo «KDS · Sistema de diseño» de Claude Design; el alcance del producto está descrito en `client/CLAUDE.md` y el modelo de datos en `docs/er-diagram.md`.

## La pantalla

Una sola pantalla con dos vistas, como los artboards «03 · Recepción» y «04 · Tablero» del diseño:

- **Recepción (por defecto):**
  - `main`: los productos. Tocar un producto suma uno. Las comidas tienen "Con sal" y "Sin sal" (`withSalt`) y las bebidas se agrupan por `containsAlcohol`.
  - `aside` "En cocina": un **resumen**. Muestra cuántas comandas hay pendientes (no entregadas) y las 4 más recientes en versión compacta (estado, número, cliente y reloj), con el botón "Ver tablero de cocina".
  - Barra inferior: la comanda que se está armando, con chips para quitar uno, "Mesa o cliente" (se envía como `customerName`), la nota y "Enviar a cocina". El combo del diseño no está porque la API no lo soporta.
- **Tablero de cocina:** el sidebar maximizado. Muestra cuatro columnas, una por estado (Pedido, En preparación, Urgente y Entregado, que en la API son `ORDERED`, `IN_PREPARATION`, `DELAYED` y `FINISHED`), con scroll horizontal. Cada comanda se mueve arrastrándola a otra columna ([Pragmatic drag and drop](https://atlassian.design/components/pragmatic-drag-and-drop)) o con el botón de la tarjeta. "Volver a recepción" vuelve a la otra vista. La URL `#tablero` abre esta vista directamente, útil para la pantalla de la cocina.
- **Reloj de cada comanda:** cuenta desde `createdAt`. Es verde hasta los 5 minutos, amarillo hasta los 10 y rojo con fuego después; además del color, cambian la palabra y la cantidad de barras. No mueve la comanda a Urgente: `DELAYED` se marca a mano.
- **Tiempo real:** el cliente carga `GET /api/orders` y escucha `/ws`. Si la conexión se corta, reintenta y recarga la lista al reconectar.
- **Limitación:** la API no guarda cuándo se entregó una comanda. El "Total" de una comanda entregada solo se conoce si el cambio de estado ocurrió con la página abierta; después de recargar se muestra "Entregada --:--".

### Estructura

- `src/app/App.tsx`: layout y cambio de vista (recepción/tablero).
- `src/features/orders/`:
  - tipos y cliente de la API de comandas;
  - `useOrders` (carga + WebSocket + cambio de estado optimista) y `useNow`;
  - los estados del diseño (`order-status.ts`) y el arrastrar y soltar (`order-dnd.ts`);
  - los componentes `KitchenSummary` (sidebar), `KitchenBoard`, `BoardColumn`, `DraggableOrder`, `OrderCard` (con variante `compact`) y `OrderTimer`.
- `src/features/catalog/`:
  - el catálogo de productos;
  - `useOrderDraft` (la comanda en armado y su envío);
  - `ProductPicker` (`main` de recepción) y `OrderDraftBar` (barra inferior).
- `src/components/ui/`: componentes de shadcn/ui adaptados al diseño.
- `src/lib/`: `cn` y `requestJson` (los errores de la API llegan como `ApiError`).

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

## Componentes de UI (shadcn/ui)

Los estilos usan Tailwind CSS v4 (plugin `@tailwindcss/vite`, sin `tailwind.config`) y los componentes vienen de [shadcn/ui](https://ui.shadcn.com), con estilo `base-nova` sobre [Base UI](https://base-ui.com). La configuración está en `components.json`: los componentes se copian a `src/components/ui/` y las variables del tema viven en `src/index.css`.

Los colores, la tipografía (Atkinson Hyperlegible), los bordes de 3 px, el radio de 12 px y las animaciones del diseño son tokens en `src/index.css` (`bg-status-ordered`, `bg-timer-late`, `text-ink-2`, `animate-kds-in`, etc.), y las variables de shadcn apuntan a ellos. `button.tsx` y `scroll-area.tsx` están adaptados: botones de 64 px con borde marcado y estado `aria-disabled` punteado, y un `ScrollArea` que expone su viewport (`viewportRef`) y admite scroll horizontal.

Para agregar un componente, desde `client/`:

```bash
bunx --bun shadcn@latest add <componente>
```

Los imports usan el alias `@/` → `src/`, definido en `tsconfig.json`, `tsconfig.app.json` y `vite.config.ts`. No se usa `--monorepo`: ese flag crea un monorepo nuevo con `packages/ui` en lugar de agregar shadcn a este.
