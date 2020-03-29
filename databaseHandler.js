const fs = require('fs');
const mysql = require('mysql');
const database = require(__dirname + '/database.js');
const DBConfig = __dirname + "/config/database.json";

class databaseHandler{
      constructor() {
        fs.readFile(DBConfig, 'utf8', (err,data) => {this.initDB(err,data)});
      }

      //Read the config data and pass it off to the database class
      initDB(err,data) {
        console.log("Initializing databaseHandler from config: " + DBConfig);
        this.db = new database(data);
        this.db.createConnPool();
        console.log("databaseHandler init finished");
      }

      queryDatabase(query){
        //Checkout a connection to use from the pool.
        this.db.pool.getConnection(function(err, connection) {
          if (err) throw err; // not connected!

          //Execute a query
          connection.query(query, function (error, results, fields) {

            //Release the connection back to the pool
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            //If there is no error return the results.
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

        return this.queryDatabase(query);

      }

      //Checks if the user already exists
      checkUser(email){
        var query = "SELECT * FROM Users WHERE email = ?;";
        var variables = [email];
        query = mysql.format(query, variables);
        return this.queryDatabase(query);
      }

      //Add a new user
      addUser(email, pass, salt, firstName, lastName){

        query = `INSERT INTO Users (email, password, salt, FirstName, LastName)
        VALUES (?, ?, ?, ?, ?)`;
        variables = [email, pass, salt, firstName, lastName];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);

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

        return this.queryDatabase(query);

      }

      //Change a users password
      changeUserPassword(userName, oldPass, newPass){

        query = 'UPDATE Users SET password = ? WHERE email = ? AND password = ?';
        variables = [newPass, userName, oldPass];
        query = mysql.format(query, variables);

        this.queryDatabase(query);

      }

      //Find a product in the database by the name or the id.
      getProduct(id){

        query = 'SELECT * WHERE productName = ? OR productId = ?';
        varaibles = [id, id];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);

      }

      //Add a new product to the database
      addProduct(name, desc){

        query = `INSERT INTO Products (productName, productDescription) VALUES
        (?, ?)`;
        variables = [name, desc];
        query = mysl.format(query, variables);

        this.queryDatabase(query);
      }

      //Delte a product from the database by name or id
      deleteProduct(id){

        query = 'DELETE FROM Products WHERE productId = ? OR productName = ?';
        variables = [id, id];
        query = mysql.format(query, variables);

        this.queryDatabase(query);

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

        return this.queryDatabase(query);

      }

      //Creates a new invoice entry
      addInvoice(){

        query = '';

        return this.queryDatabase(query);

      }

      //Updates the Orders table to indicate order is shipped
      markOrderShipped(id){

        query = 'UPDATE Orders SET isShipped = 1 WHERE invoiceNum = ?';
        query = mysql.format(query, id);

        this.queryDatabase(query);

      }

      addTrackingNUmber(id, num){

        query = 'UPDATE Orders SET trackingNumber = ? WHERE invoiceNum = ?';
        variables = [id,num];
        query = mysql.format(query, variables);

        this.queryDatabase(query);
      }

}

module.exports = databaseHandler;