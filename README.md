# Reto Técnico Angular

Aplicación de gestión de productos financieros construida con Angular 21.

## Requisitos previos

- Node.js 18 o superior
- Angular CLI (`npm install -g @angular/cli`)

## Instalación

```bash
npm install
```

## Ejecutar el proyecto

### Modo desarrollo

```bash
ng serve
```

Abre el navegador en `http://localhost:4200/`. La aplicación se recarga automáticamente al modificar archivos fuente.

### Modo producción (build)

```bash
ng build
```

Los archivos compilados se generan en el directorio `dist/`. El build de producción aplica optimizaciones de rendimiento automáticamente.

Para compilar en modo desarrollo:

```bash
ng build --configuration=development
```

## Environments

El proyecto tiene dos ambientes configurados:

| Ambiente | Archivo | API URL |
|---|---|---|
| Producción | `src/environments/environment.ts` | Configura tu URL de producción aquí |
| Desarrollo | `src/environments/environment.development.ts` | `http://localhost:3002/bp/products` |

## Ejecutar los tests

```bash
ng test
```

Para ver el reporte de cobertura:

```bash
ng test --coverage
```

## Configuración del backend

El backend debe tener habilitado CORS para que el frontend pueda comunicarse con él. De lo contrario, el navegador bloqueará las peticiones.
Para ello instalamos CORS con los comandos:

```bash
npm install cors
npm install @types/cors
```

Luego en la linea `8` del archivo `main.ts` habilitamos CORS, descomentando la linea, debe quedar asi
```js
const app = createExpressServer({
  cors: true,
  routePrefix: "/bp", 

  controllers: [
    __dirname + "/controllers/*{.js,.ts}",
  ], // we specify controllers we want to use
});
```
