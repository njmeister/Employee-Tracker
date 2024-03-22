-- Display all departments
SELECT * FROM department;

-- Display all roles
SELECT role.id, role.title, role.salary, department.name AS department
FROM role
JOIN department ON role.department_id = department.id
ORDER BY role.id;

-- Create a table to display all employees
CREATE VIEW employee_view AS
SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id;

-- Display all employees
SELECT * FROM employee_view ORDER BY employee.id;

-- Display all employees by manager
SELECT * FROM employee_view ORDER BY manager;

-- Display all employees by department
SELECT * FROM employee_view ORDER BY department;

-- Display all employees of entered manager
SELECT * FROM employee_view WHERE manager = ?;

-- Display all employees of entered department
SELECT * FROM employee_view WHERE department = ?;

-- Delete a department
UPDATE role SET department_id = null WHERE department_id IN (SELECT id FROM department WHERE name = ?);
DELETE FROM department WHERE name = ?;

-- Delete a role
UPDATE employee SET role_id = null WHERE role_id IN (SELECT id FROM role WHERE title = ?);
DELETE FROM role WHERE title = ?;
