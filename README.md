# Prueba técnica Roams Back-end

El objetivo de esta prueba es crear una API RESTful que permita realizar simulaciones de hipotecas para diferentes clientes.

## Requisitos

- La API debe estar desarrollada en **Python** o **Node.js** y utilizar **SQLite** como base de datos.
  
## Operaciones requeridas

1. **Crear un nuevo cliente** con sus datos personales y financieros:
   - **Datos**: nombre, DNI, email, capital solicitado.
   
2. **Consultar los datos de un cliente existente** por su DNI.

3. **Solicitar una simulación de hipoteca** para un cliente dado, un TAE y un plazo de amortización como entradas:
   - La API debe devolver:
     - La cuota mensual a pagar.
     - El importe total a devolver.
   - Los datos deben guardarse en la base de datos.
   
4. **Modificar o eliminar los datos de un cliente existente.**

## Validación de Datos

- La API debe validar los datos de entrada, especialmente el DNI, verificando que sea correcto usando el algoritmo oficial.

## Cálculo de la cuota mensual
La fórmula para calcular la cuota mensual de la hipoteca es:
cuota = capital * i / (1 - (1 + i) ^ (-n))

**Donde:**
- **capital** es el importe del préstamo hipotecario.
- **i** es el tipo de interés mensual (**TAE / 100 / 12**).
- **n** es el número de meses del plazo de amortización (**plazo * 12**).

## Documentación

- La API debe estar documentada adecuadamente usando herramientas como **Swagger** o **Postman**.

## Repositorio Público

- El código fuente de la API debe estar disponible en un repositorio público como **GitHub** o **Bitbucket**, con instrucciones claras para su instalación y ejecución.

---

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