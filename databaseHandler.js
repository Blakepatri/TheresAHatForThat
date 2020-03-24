const db = require(__dirname + '/database.js');
const mysql = require('mysql');

class databaseHandler{

      const db = database('database.json');

      let pool = db.createConnPool();

      queryDatabase(query){

        //Checkout a connection to use from the pool.
        pool.getConnection(function(err, connection) {
          if (err) throw err; // not connected!

          //Execute a query
          connection.query(query, function (error, results, fields) {

            //Release the connection back to the pool
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            //If there is no error return thre results.
            else return results;


          });
        });
      };

      //Verify user for log in
      getUser(email, pass){

        query = "SELECT * FROM Users WHERE email = ? AND password = ?";
        variables = [email, pass];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Add a new user
      addUser(email, pass, salt, firstName, lastName){

        query = `INSERT INTO Users (email, password, salt, FirstName, LastName)
        VALUES (?, ?, ?, ?, ?)`;
        variables = [email, pass, salt, firstName, lastName];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Delete a user account
      deleteUser(email, pass){

        query = 'DELETE FROM Users WHERE email = ? AND password = ?';
        variables = [email, pass];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Change a users password
      changeUserPassword(userName, oldPass, newPass){

        query = 'UPDATE Users SET password = ? WHERE email = ? AND password = ?';
        variables = [newPass, userName, oldPass];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Find a product in the database
      getProduct(product){

        query = '';

        return queryDatabase(query);

      }

      //Add a new product to the database
      addProduct(product){

        query = '';

        return queryDatabase(query);

      }

      //Delte a product from the database
      deleteProduct(product){

        query = '';

        return queryDatabase(query);

      }

      //Retrieves an specific invoice from the database
      getInvoice(invoice){

        query = '';

        return queryDatabase(query);

      }

      //Creates a new invoice entry
      addInvoice(invoice){

        query = '';

        return queryDatabase(query);

      }

}
