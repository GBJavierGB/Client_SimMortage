# Prueba técnica Roams Back-end

## Solución

La solucion se ha realizado con: 
- Node.js 22.12.0
- Docker 27.5.0

### Crear base de datos

Para crear la base de datos se ha utilizado docker. Se ha utilizado una imagen con SQLite3 que atraves del fichero **create_db_Client_SimMortage.sql** crea la base de datos.

1. **Descarga de la imagen con SQLite3**

    ```bash
    docker pull keinos/sqlite3:latest

2. **Para crear la base de datos:**

   ```bash
   docker run --rm -v "./database:/workspace" -w /workspace --user $(id -u):$(id -g) keinos/sqlite3 sqlite3 -cmd ".read /workspace/create_db_Client_SimMortage.sql"

### Instalacion de dependencias y ejecución de la API

1. **Instalacion de dependencias**

    ```bash
    npm install

2. **Ejecución de la API**

    ```bash
    npm run dev