const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

//Connect to the SQL database using the dotenv package to store sensitive data
const connection = mysql.createConnection({
    host: 'localhost',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const schema = fs.readFileSync('./db/schema.sql', 'utf8');
const seeds = fs.readFileSync('./db/seeds.sql', 'utf8');
const queries = fs.readFileSync('./db/queries.sql', 'utf8').split(';');


//Pulls all departments from the database via the queries.sql file
viewAllDepartments = () => {
    connection.query(queries[0], (err, res) => {
        if (err) throw err;
        console.table(res);
        returnPrompt();
    });
};

//Pulls all roles from the database via the queries.sql file
viewAllRoles = () => {
    connection.query(queries[1], (err, res) => {
        if (err) throw err;
        console.table(res);
        returnPrompt();
    });
}

//Pulls all employees from the database via the queries.sql file
viewAllEmployees = () => {
    connection.query(queries[3], (err, res) => {
        if (err) throw err;
        console.table(res);
        orderPrompt();
    });
}

//Pulls all employees from the database and orders them by manager
orderByManager = () => {
    connection.query(queries[4], (err, res) => {
        if (err) throw err;
        console.table(res);
        orderPrompt();
    });
};

//Pulls all employees from the database and orders them by department
orderByDepartment = () => {
    connection.query(queries[5], (err, res) => {
        if (err) throw err;
        console.table(res);
        orderPrompt();
    });
};

//Prompts the user for how they would like to order the employees
orderPrompt = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'order',
                message: 'Choose an option to order the employees by:',
                choices: [
                    'Manager',
                    'Department',
                    'ID',
                    'Return'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.order) {
                case 'Manager':
                    orderByManager();
                    break;
                case 'Department':
                    orderByDepartment();
                    break;
                case 'ID':
                    viewAllEmployees();
                    break;
                case 'Return':
                    inquire();
                    break;
            }
        });
};

viewByManager = () => {
    connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;

        let managers = res.map(manager => manager.first_name + ' ' + manager.last_name);
    
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Which manager would you like to view employees for?',
                    choices: managers
                }
            ])
            .then((answers) => {
                connection.query(queries[6], [answers.manager], (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    returnPrompt();
                });
            });
    });
};

viewByDepartment = () => {
    connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;

        let departments = res.map(department => department.name);
    
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department would you like to view employees for?',
                    choices: departments
                }
            ])
            .then((answers) => {
                connection.query(queries[7], [answers.department], (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    returnPrompt();
                });
            });
    });
};

//Adds a department to the database
addDepartment = () => {
    //Prompts the user for the name of the department
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the department?'
            }
        ])
        .then((answers) => {
            //Inserts the department into the database
            connection.query('INSERT INTO department (name) VALUES (?)', [answers.name], (err, res) => {
                if (err) throw err;
                console.log('Department added');
                //Calls the viewAllDepartments function to display the updated list of departments
                setTimeout(viewAllDepartments, 1000);
            });
        })
};

//Deletes a department from the database
deleteDepartment = () => {
    //Pulls all departments from the database to use as choices
    connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;

        let departments = res.map(department => department.name);

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Which department would you like to delete?',
                    choices: departments
                }
            ])
            .then((answers) => {
                //Sets the department to null for all employees in the department
                connection.query(queries[8], [answers.name], (err, res) => {
                    if (err) throw err;

                    //Deletes the department from the database
                    connection.query(queries[9], [answers.name], (err, res) => {
                        if (err) throw err;
                        console.log('Department deleted');
                        setTimeout(viewAllDepartments, 1000);
                    });
                });
            });
    });
};

//Adds a role to the database
addRole = () => {
    //Pulls all departments from the database to use as choices
    connection.query('SELECT name FROM department', (err, res) => {
        if (err) throw err;

        let departments = res.map(department => department.name);

        //Prompts the user for the title, salary, and department of the role
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
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departments
            }
        ])
        .then((answers) => {
            //Gets the department id from the department name
            connection.query('SELECT id FROM department WHERE name = ?', [answers.department], (err, res) => {
                if (err) throw err;
                let department_id = res[0].id;
                //Inserts the role into the database
                connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, department_id], (err, res) => {
                    if (err) throw err;
                    console.log('Role added');
                    //Calls the viewAllRoles function to display the updated list of roles
                    setTimeout(viewAllRoles, 1000);
                });
            });
        })
    });
};

//Deletes a role from the database
deleteRole = () => {
    //Pulls all roles from the database to use as choices
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;

        let roles = res.map(role => role.title);

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'title',
                    message: 'Which role would you like to delete?',
                    choices: roles
                }
            ])
            .then((answers) => {
                //Sets the role to null for all employees with the role
                connection.query(queries[10], [answers.title], (err, res) => {
                    if (err) throw err;

                    //Deletes the role from the database
                    connection.query(queries[11], [answers.title], (err, res) => {
                        if (err) throw err;
                        console.log('Role deleted');
                        setTimeout(viewAllRoles, 1000);
                    });
                });
            });
    });
};

//Adds an employee to the database
addEmployee = () => {
    //Pulls all roles from the database to use as choices
    connection.query('SELECT title FROM role', (err, res) => {
        if (err) throw err;
        
        let roles = res.map(role => role.title);
        //Pulls all employees from the database to use as choices for the manager
        connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
            if (err) throw err;

            let managers = res.map(manager => manager.first_name + ' ' + manager.last_name);
            //Prompts the user for the first name, last name, role, and manager of the employee
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: 'What is the first name of the employee?'
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: 'What is the last name of the employee?'
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the role of the employee?',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the manager of the employee?',
                        choices: [...managers, 'null']
                    }
                ])
                .then((answers) => {
                    //Gets the role id from the role title
                    connection.query('SELECT id FROM role WHERE title = ?', [answers.role], (err, res) => {
                        if (err) throw err;
                        let role_id = res[0].id;
                        //Gets the manager id from the manager name
                        connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [answers.manager.split(' ')[0], answers.manager.split(' ')[1]], (err, res) => {
                            if (err) throw err;
                            let manager_id = res[0].id;
                            //Inserts the employee into the database
                            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.first_name, answers.last_name, role_id, manager_id], (err, res) => {
                                if (err) throw err;
                                console.log('Employee added');
                                //Calls the viewAllEmployees function to display the updated list of employees
                                setTimeout(viewAllEmployees, 1000);
                            });
                        });
                    })
                });
        })
    })
};

//Updates the role and manager of an employee
updateEmployeeRole = () => {
    //Pulls all employees from the database to use as choices
    connection.query('SELECT first_name, last_name FROM employee', (err, res) => {
        if (err) throw err;

        let employees = res.map(employee => employee.first_name + ' ' + employee.last_name);
        //Pulls all roles from the database to use as choices
        connection.query('SELECT title FROM role', (err, res) => {
            if (err) throw err;

            let roles = res.map(role => role.title);
            //Prompts the user for the employee, role, and manager
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: employees
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role of the employee?',
                        choices: roles
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the new manager of the employee?',
                        choices: employees
                    }
                ])
                .then((answers) => {
                    //Gets the role id from the role title
                    connection.query('SELECT id FROM role WHERE title = ?', [answers.role], (err, res) => {
                        if (err) throw err;
                        let role_id = res[0].id;
                        //Gets the manager id from the manager name
                        connection.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [answers.manager.split(' ')[0], answers.manager.split(' ')[1]], (err, res) => {
                            if (err) throw err;
                            let manager_id = res[0].id;

                            //Updates the employee in the database
                            connection.query('UPDATE employee SET role_id = ?, manager_id = ? WHERE first_name = ? AND last_name = ?', [role_id, manager_id, answers.employee.split(' ')[0], answers.employee.split(' ')[1]], (err, res) => {
                                if (err) throw err;
                                console.log('Employee role updated');
                                //Calls the viewAllEmployees function to display the updated list of employees
                                setTimeout(viewAllEmployees, 1000);
                            });
                        });
                    });
                });
        });
    });
};


//Quits the application
quit = () => {
    connection.end();
    process.exit();
}

//Main function that prompts the user for what they would like to do
inquire = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View Employees by Manager',
                    'View Employees by Department',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'Delete Role',
                    'View All Departments',
                    'Add Department',
                    'Delete Department',
                    'Quit'
                ]
            }
        ])
        .then((answers) => {
            switch (answers.options) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View Employees by Manager':
                    viewByManager();
                    break;
                case 'View Employees by Department':
                    viewByDepartment();
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
                case 'Delete Role':
                    deleteRole();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Delete Department':
                    deleteDepartment();
                    break;
                case 'Quit':
                    quit();
                    break;
            }
        });
};

//Prompts the user if they would like to return to the main menu
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

startUp = () => {
    console.log('Welcome to the Employee Tracker!');

    // Check if the employees table is empty
    connection.query('SELECT COUNT(*) AS count FROM employee', (err, results) => {
        if (err) throw err;

        // If the employees table is empty, seed the database
        if (results[0].count === 0) {
            connection.query(seeds, (err, res) => {
                if (err) throw err;
            });
        }
    });

    // Clear view from database
    connection.query('DROP VIEW IF EXISTS employee_view', (err, res) => {
        if (err) throw err;
    });

    //Creates the employee view in the database
    connection.query(queries[2], (err, res) => {
        if (err) throw err;
    });

    setTimeout(inquire, 1000);
};


startUp();