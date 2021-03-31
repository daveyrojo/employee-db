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
let managerArr = [];
let depArr = [];
let roleArr = [];

//functions for inquirer

const runQuery = () => {
  inquirer.prompt([
    {
      name: "intro",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Roles",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee",
      ],
    },
  ])
  .then((answer) => {
    switch (answer.intro) {
      case "View All Employees":
        viewAllEmp();
        break;
      
      case "View All Employees by Department":
        viewByDepartment();
        break;
      
      case "View All Employees by Role":
        viewEmpByRole();
        break;
      
      case "Add Employee":
        addEmp();
        break;

      case "Add Deparment":
        addDepartment();
        break;
      
      case "Add Role":
        addRole();
        break;

      case "Update Employee":
        updateEmp();
        break;
      
      default:
        console.log(`Invalid choice: ${answer.intro}`);
        break;
    }
  });
};





module.exports = connection;
