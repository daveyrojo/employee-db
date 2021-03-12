const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.PORT ||  3306, 
    user: 'root',
    password: 'Gkdve123!',
    database: 'employeeDB'
});

connection.connect();
connection.query = util.promisify(connection.query);


module.exports = connection;
