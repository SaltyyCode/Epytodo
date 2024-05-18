const mysql = require('mysql2/promise');

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log(`Successfully connected to the ${process.env.MYSQL_DATABASE} database.`);
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database: ' + err.message);
    });

module.exports = pool;
