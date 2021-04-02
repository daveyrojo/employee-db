DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL               
);

CREATE TABLE role (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    Index dep_id (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    Index role_id (role_id), 
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE, 
    manager_id INT UNSIGNED,
    Index man_id (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE 
);

INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("IT");
INSERT INTO department (name)
VALUE ("Human Resources");
INSERT INTO department (name)
VALUE ("Sales");

INSERT INTO role (title, salary, department_id)
VALUE ("Engineer Manager", 180000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("IT Manager", 250000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("HR Manager", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Manager", 350000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Joanie", "Uni de Corn", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Susan", "Coolidge", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Richard", "Dumby", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("David", "El Rojo", 4, null);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;




