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

const runQuery = () => {
  console.log("Running query...");

  inquirer
    .prompt({
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
          showDepart();
          break;
        case "View All Employees By Manager":
        case "Add an Employee":
          addEmp();
          break;
        case "Remove an Employee":
        case "Update Employee Role":
        case "Update Employee Manager":
      }
    });
};

const showAllEmp = () => {
  const query = `SELECT * FROM employee`;
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    } else {
      res.forEach(({ id, first_name, last_name, role_id, manager_id }) =>
        console.log(
          `ID: ${id} || First Name: ${first_name} || Last Name: ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
        )
      );
    }
  });
};

const showDepart = () => {
  inquirer
    .prompt({
      name: "depList",
      type: "list",
      message: "What department would you like to choose?",
      choices: [{ name: "Sales", value: "1" }], //"Human Resources", "Development", "Accounting"]
    }) //need to find out how to query the search
    .then((answer) => {
        console.log(`---------------`);
        console.log(`${answer.depList} `);
        console.log(`---------------`);
      const query = `SELECT 1 FROM employee`; //not the right statement
      
      connection.query(query, (err, res) => {
        if (err) {
          throw err;
        } else {
            res.forEach(({ id, first_name, last_name, role_id, manager_id }) =>
              console.log(
                `ID: ${id} || First Name: ${first_name} || Last Name: ${last_name} || Role ID: ${role_id} || Manager ID: ${manager_id}`
              )
            );
        }
      });
    });
};

//do i need to use .thens to insert multiple tables or can I do it all at once?
const addEmp = () => {
    inquirer.prompt(
      {
        name: "addDep",
        type: "list",
        message: "What department is the employee in?",
        choices: ["Sales", "Huma Resources", "Development"],
      },
      {
        name: "title",
        type: "list",
        message: "What position do they have?",
        choices: ["Manager", "Senior Level", "Junior Level"],
      },
      {
        name: "salary",
        type: "list",
        message: "What is their salary?",
        choices: ["100,000", "80,000", "60,000"],
      },
      {
        name: "first",
        type: "input",
        message: "What is their first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is their last name?",
      },
      {
        name: "roleID",
        type: "input",
        message: "What is their role id",
        validate: (answer) => {
          if (isNaN(answer)) {
            return "Please enter a number.";
          } else {
            return;
          }
        },
      },
      {
        name: "manID",
        type: "input",
        message: "If they're a manager what is there manager id?",
        validate: (answer) => {
            if (answer != 'Manager') {
                return 'This employee is not a manager.'
            } else {
                return;
            }
        }
      }
    ).then((answer) => {
         connection.query(`INSERT INTO department (name) VALUES (${answer.addDep})`, (err) => {
             if (err) throw err;
         }).then((answer) => {
             connection.query(`INSERT INTO role (title, salary, department_id) VALUES (${answer.title}, ${answer.salary})`, (err) => {
                 if (err) throw err;
             }).then((answer) => {
                 connection.query(
                     "INSERT INTO employee SET ? ",
                     {
                         first_name: answer.first,
                         last_name: answer.last,
                         role_id: answer.roleID,
                         manager_id: answer.manID
                     }
                 )
             })
         });

    });
    
    // ...need to finish code here - need to know how to insert
}

module.exports = connection;
