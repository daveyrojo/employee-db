// Minimum Requirements
// Functional application.
// GitHub repository with a unique name and a README describing the project.
// The command-line application should allow users to:
// Add departments, roles, employees
// View departments, roles, employees
// Update employee roles
//on load get a list of choices
//in the prompt of choices need a name of what to do
//value will be something descrptive
//create a switch case function that goes with all the choices
//then runs a function accordingly

//questions for Dominique:
//auto increment doesn't seem to actually work - i have to assign values
//how do you have lists show and not disappear super fast

const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: process.env.PORT || 3306,
  user: "root",
  password: "Gkdve123!",
  database: "employeeDB",
});

connection.connect((err) => {
  if (err) throw err;
  runQuery();
});

connection.query = util.promisify(connection.query);

//arrays to add to

let depArr = [];
let roleArr = [];
let managerArr = [];


module.exports = connection;
