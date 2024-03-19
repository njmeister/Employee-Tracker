const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const queries = fs.readFileSync('./db/queries.sql', 'utf8').split(';');

viewAllDepartments = () => {
    connection.query(queries[0], (err, res) => {
        if (err) throw err;
        console.table(res);
        returnPrompt();
    });
};

viewAllRoles = () => {
    connection.query(queries[1], (err, res) => {
        if (err) throw err;
        console.table(res);
        returnPrompt();
    });
}

viewAllEmployees = () => {
    connection.query(queries[2], (err, res) => {
        if (err) throw err;
        console.table(res);
        returnPrompt();
    });
}

addDepartment = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ])
        .then((answers) => {
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.name], (err, res) => {
                if (err) throw err;
                console.log('Department added');
                setTimeout(viewAllDepartments, 1000);
            });
        })
};

addRole = () => {
    connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;

        let departments = res.map(department => department.name);


    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ])
        .then((answers) => {
            connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added');
                setTimeout(viewAllRoles, 1000);
            });
        })
    });
};

addRole();


inquire = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.options) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
            }
        });
};

returnPrompt = () => {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'return',
                message: 'Return'
            }
        ])
        .then((answers) => {
            if (answers.return) {
                inquire();
            } else {
                quit();
            }
        });
};

// inquire();