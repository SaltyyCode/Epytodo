const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const authRoutes = require('./routes/auth/auth');
const userRoutes = require('./routes/user/user');
const usersRoutes = require('./routes/user/users');
const todoRoutes = require('./routes/todos/todos');

app.use(express.json());
app.use(authRoutes);
app.use('/user', userRoutes);
app.use('/users', usersRoutes);
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur EPYTODO API!, par Clément Yanis et Kiks');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
