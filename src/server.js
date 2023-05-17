const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

app.use(express.json());

// Register routes
routes.forEach((route) => {
    const { method, path, handler } = route;
    app[method.toLowerCase()](path, handler);
});

// Start the server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
