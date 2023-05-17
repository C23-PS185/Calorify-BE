const mysql = require('mysql2');

// data user diambil dari database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "calorify",
}); 

module.exports = { db };