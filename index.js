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

    const inquirer = require("inquirer");
    const mysql = require("mysql");
   
    const connection = mysql.createConnection({
      host: "localhost",
      port: process.env.PORT || 3306,
      user: 'root',
      password: 'Gkdve123!',
      database: 'employeeDB'
    });

    connection.connect((err) => {
      if (err) throw err;
      runQuery();
    });

    const runQuery = () => {
      console.log("Running query...");

      inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add an Employee",
          "Remove an Employee",
          "Update Employee Role",
          "Update Employee Manager",
        ],
      })
      .then((answer) => {
          switch (answer.menu) {
            case "View All Employees":
                showAllEmp();
                break;
            case "View All Employees By Department":
            case "View All Employees By Manager":
            case "Add an Employee":
            case "Remove an Employee":
            case "Update Employee Role":
            case "Update Employee Manager":
          }
      })
    };

const showAllEmp = () => {
    connection.query(
        'SELECT * FROM employee',
        (err, res) => {
            if (err) throw err;
            else {
                console.log(
                    `Employees: ${res.employee}`
                );
                runQuery();
            }
        }
    )
}

    module.exports = connection;
