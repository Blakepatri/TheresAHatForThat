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

      //Creates a new session entry
      addSession(){

      };

      //Deletes a session entry
      delteSession(){

      };

      //Finds a specific session entry
      findSession(){

      };

      //Verify user for log in
      getUser(email, pass){

        query = "SELECT * FROM Users WHERE email = ? AND password = ?";
        variables = [email, pass];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Checks if the user already exists
      checkUser(){
        
      }

      //Add a new user
      addUser(email, pass, salt, firstName, lastName){

        query = `INSERT INTO Users (email, password, salt, FirstName, LastName)
        VALUES (?, ?, ?, ?, ?)`;
        variables = [email, pass, salt, firstName, lastName];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Creates a new admin entry
      addAdmin(){

      }

      //Deletes specified admin entry
      deleteAdmin(){

      }

      //Verifies that a user is present in the admin table
      checkAdmin(){

      }

      //Checks an admins permission level
      checkPermissions(){

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

        queryDatabase(query);

      }

      //Find a product in the database by the name or the id.
      getProduct(id){

        query = 'SELECT * WHERE productName = ? OR productId = ?';
        varaibles = [id, id];
        query = mysql.format(query, variables);

        return queryDatabase(query);

      }

      //Add a new product to the database
      addProduct(name, desc){

        query = `INSERT INTO Products (productName, productDescription) VALUES
        (?, ?)`;
        variables = [name, desc];
        query = mysl.format(query, variables);

        queryDatabase(query);
      }

      //Delte a product from the database by name or id
      deleteProduct(id){

        query = 'DELETE FROM Products WHERE productId = ? OR productName = ?';
        variables = [id, id];
        query = mysql.format(query, variables);

        queryDatabase(query);

      }

      //Adds a new product variant
      addNewVariant(){

      };

      //Deletes a product variant
      delteVariant(){

      };

      //Adds a new product image
      addImage(){

      }

      //Deletes specified product image
      deleteImage(){

      }

      //Allows for the image to be chnaged or updated
      changeImage(){

      }

      //Adds a new promotion
      addPromotion(){

      }

      //Deletes a specifc promotion
      deletePromotion(){

      }

      //Retrieves a specific invoice from the database
      getInvoice(id){

        query = 'SELECT * FROM Orders WHERE invoiceNum = ?';
        query = mysql.format(query, id);

        return queryDatabase(query);

      }

      //Creates a new invoice entry
      addInvoice(){

        query = '';

        return queryDatabase(query);

      }

      //Updates the Orders table to indicate order is shipped
      markOrderShipped(id){

        query = 'UPDATE Orders SET isShipped = 1 WHERE invoiceNum = ?';
        query = mysql.format(query, id);

        queryDatabase(query);

      }

      addTrackingNUmber(id, num){

        query = 'UPDATE Orders SET trackingNumber = ? WHERE invoiceNum = ?';
        variables = [id,num];
        query = mysql.format(query, variables);

        queryDatabase(query);
      }

}
