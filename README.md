# Client_SimMortage
Prueba tecnica Romas Back-end

El objetivo de esta prueba es crear una API RESTful que permita realizar
simulaciones de hipotecas para diferentes clientes.
● La API debe estar desarrollada en Python o Node.js y usar SQLite como base
  de datos.
● La API debe permitir las siguientes operaciones:
    ○ Crear un nuevo cliente con sus datos personales y financieros
      (nombre, DNI, email, capital solicitado).
    ○ Consultar los datos de un cliente existente por su DNI.
    ○ Solicitar una simulación de hipoteca para un cliente dado, un TAE y un
      plazo de amortización como inputs. La API debe devolver la cuota
      mensual a pagar y el importe total a devolver y el sistema debe
      guardarlo en BBDD.
    ○ Modificar o eliminar los datos de un cliente existente.
● La API debe validar los datos de entrada y manejar los posibles errores o
  excepciones. En particular, debe comprobar que el DNI es verdadero usando
  el algoritmo oficial.
● La API debe documentarse adecuadamente usando alguna herramienta como
  Swagger o Postman.
● El código fuente de la API debe estar disponible en un repositorio público
  como GitHub o Bitbucket con instrucciones claras para su instalación y
  ejecución.
● Para calcular la cuota mensual de la hipoteca se debe usar la siguiente
  fórmula:
    cuota = capital * i / (1 - (1 + i) ^ (-n))

Donde:
● capital es el importe del préstamo hipotecario
● i es el tipo de interés mensual (TAE / 100 / 12)
● n es el número de meses del plazo de amortización (plazo * 12)

SOLUCION

Crear y cargar base de datos
docker run --rm -it -v "$(pwd):/workspace" -w /workspace --user $(id -u):$(id -g) keinos/sqlite3 sqlite3 -cmd ".read /workspace/create_db_Client_SimMortage.sql"

docker run --rm -v "./database:/workspace" -w /workspace --user $(id -u):$(id -g) keinos/sqlite3 sqlite3 -cmd ".read 
/workspace/create_db_Client_SimMortage.sql"