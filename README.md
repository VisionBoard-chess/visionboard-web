# VisionBoard Web

VisionBoard Web es una aplicación web que permite a los usuarios crear y retransmitir torneos de ajedrez reales de forma virtual. La aplicación web está diseñada para crear torneos, administrar rondas y partidas. Permitiendo la visualización de torneos enteros en cualquier momento y desde cualquier lugar. Los creadores de los torneos pueden editar y añadir movimientos en las partidas en caso de una mala predicción por parte del servicio de detección de movimientos. Además, los usuarios pueden ver las partidas en tiempo real y seguir el progreso del torneo.

## Características principales
- Creación de torneos de ajedrez en línea.
- Administración de rondas y partidas.
- Visualización de torneos en tiempo real.
- Edición de movimientos en partidas.
- Integración con Firebase para autenticación de usuarios.

## Instalación
1. Clona el repositorio:
    ```bash
    git clone URL_DEL_REPOSITORIO
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd visionboard-web
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Configura las variables de entorno en un archivo `.env` (si es necesario siguiendo `.env.example`).
5. Inicia la aplicación:
    ```bash
    npm start
    ```

## Ejecución de tests
1. Ejecutar el siguiente comando:
```bash
    npx vitest
```

## Ejecución de tests e2e
1. Añadir un correo y contraseña verificados previamente.
2. Ejecutar el siguiente comando:
   ```bash
   npx playwright test src/tests/e2e
   ```

## Despliegue
Para desplegar la aplicación, en tu servidor copia los archivos de la carpeta /dist del proyecto al hacer:
```bash
    npm run build
```
