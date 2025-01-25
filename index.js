const express = require('express')
const back = express()

back.use(express.json());

const sqlite = require('sqlite3');
const db = new sqlite.Database('./database/Client_SimMortgage.db');
db.run("PRAGMA foreign_keys = ON");


back.post('/api/client', (request, response) => {
  const {DNI, name, email, money_request} = request.body;

  if (verify_dni(DNI)){
    db.run("INSERT INTO clients (DNI, name, email, money_request) VALUES (?, ?, ?, ?)",
      [DNI, name, email, money_request],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return response.status(400).json({ error: "El DNI ya está registrado." });
          } else if (err.message.includes("NOT NULL constraint failed")) {
            return response.status(400).json({ error: "Todos los campos son obligatorios." });
          } else {
            return response.status(500).json({ error: "Error desconocido en la base de datos.", details: err.message });
          }
        }
        response.json({ message: "Cliente agregado correctamente", id: this.lastID });
      }
    );
  } else {
    response.status(400).json({ message: "DNI no es correcto" });
  }
  
})

back.get('/api/client', (request, response) => {
  const {DNI} = request.body;

  if (!DNI) {
    return response.status(400).json({ error: "El DNI es obligatorio" });
  }

  if (verify_dni(DNI)) {
    db.get("SELECT * FROM clients WHERE DNI = ?", [DNI], (err, row) => {
      if (err) {
        return response.status(500).json({ error: "Error en la base de datos", details: err.message });
      } else if (!row) {
          response.status(404).json({ message: "Cliente no encontrado" });
      } else {
          response.json(row);
      }
    });
  } else {
    response.status(400).json({ message: "DNI no es correcto" });
  }
  
})

back.put('/api/client', (request, response) => {
  const { DNI, name, email, money_request } = request.body;

  if (!DNI) {
    return response.status(400).json({ error: "El DNI es obligatorio" });
  }
  
  if (!verify_dni(DNI)) {
    return response.status(400).json({ message: "DNI no es correcto" });
  }

  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (money_request !== undefined) {
    fields.push("money_request = ?");
    values.push(money_request);
  }

  if (fields.length === 0) {
    return response.status(400).json({ error: "No hay datos para actualizar" });
  }

  const sql = `UPDATE clients SET ${fields.join(", ")} WHERE DNI = ?`;
  values.push(DNI);

  db.run(sql, values, function (err) {
    if (err) {
      return response.status(500).json({ error: "Error en la base de datos", details: err.message });
    } else if (this.changes === 0) {
        return response.status(404).json({ message: "Cliente no encontrado" });
    } else {
        response.json({ message: "Cliente actualizado correctamente" });
    }
   
  });
})

back.delete('/api/client', (request, response) => {
  const {DNI} = request.body;
  
  if (!DNI) {
    return response.status(400).json({ error: "El DNI es obligatorio" });
  }
  
  if (!verify_dni(DNI)) {
    return response.status(400).json({ message: "DNI no es correcto" });
  } else {
    db.run("DELETE FROM clients WHERE DNI = ?", [DNI], 
      function (err) {
        if (err) {
          return response.status(500).json({ error: "Error al eliminar el cliente", details: err.message });
        } else if (this.changes === 0) {
            return response.status(404).json({ message: "Cliente no encontrado" });
        } else {
            response.json({ message: `Cliente con DNI ${DNI} eliminado correctamente` });
        }
    });
  }
})

back.post('/api/sim_mortgage', (request, response) => {
  const {DNI, TAE, amort_time} = request.body;
  
  if (!DNI) {
    return response.status(400).json({ error: "El DNI es obligatorio" });
  }
  
  if (!verify_dni(DNI)) {
    return response.status(400).json({ message: "DNI no es correcto" });
  }

  if (TAE === undefined || TAE === null) {
    return response.status(400).json({ error: "El TAE es obligatorio" });
  } 
  
  if (TAE <= 0) {
    return response.status(400).json({ error: "El TAE tiene que ser mayor que 0" });
  }

  if (amort_time === undefined || amort_time === null) {
    return response.status(400).json({ error: "El tiempo de amortización es obligatorio" });
  }

  if (amort_time <= 0) {
    return response.status(400).json({ error: "El tiempo de amortización tiene que ser mayor que 0" });
  }
  
  db.get("SELECT money_request FROM clients WHERE DNI = ?", [DNI], (err, row) => {
    if (err) {
      return response.status(500).json({ error: "Error en la base de datos", details: err.message });
    } else if (!row) {
      return response.status(404).json({ error: "Cliente no encontrado" });
    } else {
      const money_request = row.money_request;

      const TAE_monthly = TAE / 12;
      const monthly_pay = TAE_monthly === 0
          ? money_request / amort_time
          : (money_request * TAE_monthly) / (1 - Math.pow(1 + TAE_monthly, -amort_time));

      const total_import = monthly_pay * amort_time;

      db.run("INSERT INTO sim_mortgage (DNI, TAE, amort_time, monthly_pay, total_import) VALUES (?, ?, ?, ?, ?)",
        [DNI, TAE, amort_time, monthly_pay.toFixed(2), total_import.toFixed(2)],
        function (insertErr) {
          if (insertErr) {
            return response.status(500).json({ error: "Error al guardar la simulación", details: insertErr.message });
          }
          return response.json({ 
            message: "Simulación guardada correctamente",
            id_sim: this.lastID,
            monthly_pay: monthly_pay.toFixed(2), 
            total_import: total_import.toFixed(2) 
          });
        }
      );
    }
  });
})

function verify_dni (DNI) {

  const dni_numbers = DNI.match(/\d+/)[0];
  const letter = DNI.match(/[A-Za-z]+/)[0];
  const resto = dni_numbers%23;

  if (dni_numbers.length !== 8){
    return false;
  }

  let letter_calculated;
  
  switch (resto) {
    case 0: letter_calculated = "T"; break;
    case 1: letter_calculated = "R"; break;
    case 2: letter_calculated = "W"; break;
    case 3: letter_calculated = "A"; break;
    case 4: letter_calculated = "G"; break;
    case 5: letter_calculated = "M"; break;
    case 6: letter_calculated = "Y"; break;
    case 7: letter_calculated = "F"; break;
    case 8: letter_calculated = "P"; break;
    case 9: letter_calculated = "D"; break;
    case 10: letter_calculated = "X"; break;
    case 11: letter_calculated = "B"; break;
    case 12: letter_calculated = "N"; break;
    case 13: letter_calculated = "J"; break;
    case 14: letter_calculated = "Z"; break;
    case 15: letter_calculated = "S"; break;
    case 16: letter_calculated = "Q"; break;
    case 17: letter_calculated = "V"; break;
    case 18: letter_calculated = "H"; break;
    case 19: letter_calculated = "L"; break;
    case 20: letter_calculated = "C"; break;
    case 21: letter_calculated = "K"; break;
    case 22: letter_calculated = "E"; break;
    default: letter_calculated = null;
  }

  if (letter_calculated === letter){
    return true;
  } else{
    return false;
  }

}

const PORT = 3000
back.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})