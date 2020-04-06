# CSCI3172 - Web-Centric
Step 1:
To install the application do a git clone from:
https://git.cs.dal.ca/patriquin/csci3172-web-centric.git

Step 2:
Import the database file into MySQL. The file is:
db/TAHFT_DB_Create_FilledTables.sql

This contains some already created accounts. Right now there is only one admin account:
k.pineo@dal.ca
montrealcanadiens

If you wish to change an account to admin simply set the admin field in the Users table to 1.

If for some reason there is a need to change database connection configuration, it is stored in: 
config/database.json 

It looks something like:
{
	"host":"localhost",
	"port":1111,
	"user":"root",
	"password":"MapleLeafsSuck",
	"database":"TAHFT_DB"
}

Step 3:
Install node modules. There is a package.json included with the project. It should be as simple as navigating to the main app directory and doing an npm install.

If that doesn’t work the application only uses three modules not bundled with Node by default:
npm install cookies
npm install formidable
npm install mysql

Step 4:
Configure HTTP server if needed. Mainly the port the server is using. This option is found in AHatForThat.js on line 13:
const serverPort = 80;

Step 5:
Start the server from the directory above the main application directory:
node csci3172-web-centric

or from the main application directory:
node AHatForThat.js

Step 6:
If something breaks on boot please contact Keith: k.pineo@dal.ca
Chances are it is something like a path error or OS specific problem not found during testing. Anything like this should be a one line code fix.

