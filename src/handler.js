// const { nanoid } = require('nanoid');
const util = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./database');

const loginHandler = (req, res) => {
    const { username, password } = req.body;
  
    const queryPromise = util.promisify(db.query).bind(db);
    // Cari informasi pengguna di database
    queryPromise('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
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
  };

module.exports = { 
    loginHandler
};