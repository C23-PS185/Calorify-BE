const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const port = 3000;

app.use(express.json());

// data user diambil dari database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "calorify",
}); 

// Endpoint untuk login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Cari informasi pengguna di database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan saat mencari pengguna' });
      }
  
      if (results.length === 0) {
        return res.status(401).json({ error: true, message: 'Username atau password salah' });
      }
  
      // Lakukan validasi password
      const isValidPassword = await bcrypt.compare(password, results[0].password);
      if (!isValidPassword) {
        return res.status(401).json({ error: true, message: 'Username atau password salah' });
      }
  
      // Buat token akses
      const token = jwt.sign({ id: results[0].id }, 'rahasia', { expiresIn: '1h' });
      const loginResult = {
            userId: results[0].id,
            name: results[0].name,
            token: token
        };

        res.status(200).json({ error: false, message: 'success', loginResult });
    });
  });
  

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
