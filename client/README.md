# Cliente del KDS

Frontend del sistema de comandas para cocina (KDS), hecho con React 19 + TypeScript + Vite. Por ahora `src/` sigue siendo la plantilla inicial de Vite; el alcance del producto está descrito en `client/CLAUDE.md` y el modelo de datos en `docs/er-diagram.md`.

## Comandos

Se ejecutan desde `client/`. También se pueden correr desde la raíz del repositorio con `bun --filter @olivia-rabas/client <script>`; `bun dev` en la raíz levanta el cliente y la api juntos.

| Comando                         | Qué hace                                                  |
| ------------------------------- | --------------------------------------------------------- |
| `bun run dev`                   | Servidor de desarrollo de Vite con recarga en caliente (HMR) |
| `bun run build`                 | Chequea los tipos (`tsc -b`) y genera el build de producción |
| `bun run preview`               | Sirve el build de producción                              |
| `bun run check` / `check:fix`   | Lint + formato + orden de imports con Biome               |
| `bun run lint` / `lint:fix`     | Solo el linter de Biome                                   |
| `bun run format` / `format:check` | Solo el formateador de Biome                            |

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
