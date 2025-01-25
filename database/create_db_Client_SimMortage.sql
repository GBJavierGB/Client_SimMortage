.open Client_SimMortage.db

CREATE TABLE IF NOT EXISTS clients(
    DNI TEXT PRIMARY KEY, 
    name TEXT NOT NULL, 
    email TEXT NOT NULL, 
    money_request INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS sim_mortgage (
    id_sim INTEGER PRIMARY KEY AUTOINCREMENT, 
    DNI TEXT NOT NULL,
    TAE REAL NOT NULL,
    amort_time INTEGER NOT NULL,
    monthly_pay REAL NOT NULL,
    total_import REAL NOT NULL,
    FOREIGN KEY (DNI) REFERENCES clients(DNI) ON DELETE CASCADE
);

INSERT INTO clients VALUES ('73426895Q', 'Javier', 'javier@gmail.com', 500)