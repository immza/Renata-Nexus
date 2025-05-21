import fs from "fs";
import csvParser from "csv-parser";
import db from "./db.js";

const results = [];

fs.createReadStream("./customers.csv")
  .pipe(csvParser())
  .on("data", (data) => {
    console.log(data);
    results.push(data);
  })
  .on("end", () => {
    db.run("DELETE FROM customers", (err) => {
      if (err) {
        console.error("Error clearing customers table:", err.message);
        return;
      }
      console.log("Customers table cleared. Ready to re-insert data.");

      results.forEach(
        ({
          ID,
          "Customer Name": CustomerName,
          Division,
          Gender,
          MaritalStatus,
          Age,
          Income,
        }) => {
          console.log(
            "Inserting:",
            ID,
            CustomerName,
            Division,
            Gender,
            MaritalStatus,
            Age,
            Income
          );

          db.run(
            `INSERT OR IGNORE INTO customers (id, customer_name, division, gender, marital_status, age, income) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              ID,
              CustomerName,
              Division,
              Gender,
              MaritalStatus,
              parseInt(Age),
              parseInt(Income),
            ],
            (err) => {
              if (err) {
                console.error(`Error inserting ${CustomerName}:`, err.message);
              } else {
                console.log(`Inserted customer: ${CustomerName}`);
              }
            }
          );
        }
      );
    });
  });
