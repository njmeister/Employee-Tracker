# UTA Coding Bootcamp Challenge  -- Employee Tracker

## Description

This is my submission for the Employee Tracker challenge in the UTA/EdX Coding Bootcamp. This challenge aimed to create a program that can be run on Node.js to connect to and interact with an SQL database.

<a href="https://drive.google.com/file/d/1h2JJ7GN0AKrOoPkvKU-220O51RlcawdA/view?usp=sharing">Link to video demonstration</a>



## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory and fill it with your own values. Use `.env.example` as a template.
4. Start the database with `SOURCE db/schema.sql` in MySQL.



## Usage

Start the program with the command `node index.js.`

The program presents the user with a list of its functions:  
                    *'View All Employees',   
                    *'View Employees by Manager',   
                    *'View Employees by Department',   
                    'Add Employee',   
                    'Update Employee Role',   
                    'View All Roles',   
                    'Add Role',   
                    'Delete Role',   
                    'View All Departments',   
                    'Add Department',   
                    'Delete Department',   
After finishing any of the functions, the program presents a 'Return' option. Choosing yes brings the main list of functions back up for selection while choosing no quits the program.   
Choosing any 'view' option will pull up a table with the appropriate information from the database. The 'View All Employees' function also has sub-options to order the table.   
Choosing any 'add' or 'update' option will pull up a series of inquirer prompts to collect entries for each column of the chosen table. Once they have all been answered, the program will display the updated table.   
Choosing any 'delete' option will pull up a list of entries for the respective table. Selecting one will remove it from the database. The program then displays the updated table.   
Choosing 'quit' stops the program.  


## Credits

N/A

## License

This repo uses an MIT License. See above for details.
