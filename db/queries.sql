-- Display all departments
SELECT * FROM department;

-- Display all roles
SELECT role.id, role.title, role.salary, department.name AS department
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role.id;

-- Display all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id
ORDER BY employee.id;