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
      
      case "View All Employees by Roles":
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

const viewAllEmp = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      runQuery();
    }
  );
};

const viewByDepartment = () => {
    connection.query(
      "SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY department.name;",
      (err, res) => {
        if (err) throw err;
        console.table(res);
        runQuery();
      }
    );
}

const viewEmpByRole = () => {
  connection.query(
    "SELECT  role.title, employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role ON (role.id = employee.role_id) LEFT JOIN department ON (department.id = role.department_id) ORDER BY role.title;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      runQuery();
    }
  );
};

const addEmp = () => {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "What's the employee's first name?",
    },
    {
      name: "lastname",
      type: "input",
      message: "What's the employee's last name?",
    },
    {
      name: "role",
      type: "list",
      message: "What's the employee's role?",
      choices: role(),
    },
    {
      name: "choice",
      type: "rawlist",
      message: "What's the employee's managers name?",
      choices: manager(),
    },
  ])
  .then((val) => {
    let roleId = role().indexOf(va.role) + 1;
    let managerId = manager().indexOf(val.manager) + 1;
    connection.query(
      "INSERT INTO employee SET ? ",
      {
        first_name: val.firstname,
        last_name: val.lastname,
        manager_id: managerId,
        role_id: roleId,
      },
      (err) => {
        if (err) throw err;
        run();
      }
    );
  })
}



module.exports = connection;
