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


//last couple problems - department_id is sending department name when adding role
//manager id is registering as 0
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
let deptArr = [];
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

      case "Add Department":
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
      type: "list",
      message: "What's the employee's managers name?",
      choices: manager(),
    },
  ])
  .then((val) => {
    let roleId = role().indexOf(val.role) + 1;
    let managerId = manager().indexOf(val.manager) + 1;
    console.log("ROLE ID: " + roleId);
    console.log("MANAGER ID: " + managerId);
    connection.query(
      "INSERT INTO employee SET ? ",
      {
        first_name: val.firstname,
        last_name: val.lastname,
        role_id: roleId,
        manager_id: managerId,
      },
      (err) => {
        if (err) throw err;
        runQuery();
      }
    );
  })
};

const role = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });

  return roleArr;
};

const manager = () => {
  connection.query(
    "SELECT first_name, last_name, role_id FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log('\n');
        console.log("Manager Loop: " + res[i].first_name);
        console.log("Manager Loop: " + res[i].last_name);
        console.log("Manager Loop: " + res[i].role_id);
        console.log("\n");
        let mgmt = res[i];
        managerArr.push({
          choice: mgmt.first_name,
          value: mgmt.role_id,
        });
      }
    }
  );
  return managerArr;
}

const addDepartment = () => {
  inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is the departments name?"
    },
  ])
  .then((res) => {
    connection.query(
      "INSERT INTO department SET ? ",
      {
        name: res.name,
      },
      (err) => {
        if (err) throw err;
        runQuery();
      }
    );
  })
};

const addRole = () => {
  connection.query(
    "SELECT role.title AS Title, role.salary AS Salary, role.department_id AS Department FROM role",
    (err, res) => {
      inquirer
        .prompt([
          {
            name: "role",
            type: "input",
            message: "What's the position's role?",
          },
          {
            name: "salary",
            type: "input",
            message: "What's the Salary?",
          },
          {
            name: "department",
            type: "rawlist",
            message: "What's the role's department?",
            choices: department(),
          },
        ])
        .then((res) => {
          connection.query(
            "INSERT INTO role SET ? ",
            {
              title: res.role,
              salary: res.salary,
              department_id: res.department,
            },
            (err) => {
              if (err) throw err;
              runQuery();
            }
          );
        });
    }
  );
};



const department = () => {
  connection.query("SELECT * FROM department", (err, res) => {
   
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      let dept = res[i];
      // console.log("\n\n\n" + "DEPARTMENT: " + res[i].name + res[i].id + "\n\n\n");
      deptArr.push({
        name: dept.name, 
        value: dept.id});
    }
  });
  return deptArr;
};


const updateEmp = () => {
  connection.query(
    "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    (err, res) => {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastName",
            type: "rawlist",
            message: "What's the Employee's last name? ",
            choices: () => {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
          },
          {
            name: "role",
            type: "rawlist",
            message: "What's the Employees new title? ",
            choices: role(),
          },
        ])
        .then((val) => {
          var roleId = role().indexOf(val.role) + 1;
          connection.query(
            "UPDATE employee SET WHERE ? ",
            {
              last_name: val.lastName,
            },
            {
              role_id: roleId,
            },
            function (err) {
              if (err) throw err;
              runQuery();
            }
          );
        });
    }
  );
};



module.exports = connection;
