const fs = require('fs');
const path = require('path');
const mysql = require('mysql');
const database = require(path.join(__dirname,'database.js'));
//Initialize the db object as global so it can be passed around through all of the promises.
var db;

//A class for handling Database queries. Returns promises when a query is made.
//Note that the mysql module does automatic escaping inside the format() function. This is it's way of doing some variable binding.
class databaseHandler{
      constructor(dbconfig) {
        console.log("Initializing databaseHandler");
        db = new database(dbconfig);
        console.log("databaseHandler init finished");
      }

      createConnPool() {
        console.log("Creating database connection pool");
        return new Promise(function(resolve,reject) {
          db.createConnPool().then(function(results) {
            console.log("DB Connection pool created successfully");
            resolve(results)
          })
          .catch(function(err) {
            console.log(err);
          });
        });
      }

      queryDatabase(query) {
        console.log("QUERYING DB: " + query);
        return new Promise(function(resolve,reject) {
          //Checkout a connection to use from the pool.
          db.pool.getConnection(function(err, connection) {
            if (err) reject(err); // not connected!

            //Execute a query
            connection.query(query, function (error, results, fields) {

              //Release the connection back to the pool
              connection.release();

              // Handle error after the release.
              if (error) reject(error);

              //If there is no error return the results.
              else resolve(results);
            });
          });
        });
      }

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
      getUserForLogin(email, pass){
        var query = "SELECT * FROM Users WHERE email = ? AND password = ?";
        var variables = [email, pass];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);
      }

      //Checks if the user already exists
      checkUser(email){
        var query = "SELECT email FROM Users WHERE email = ?;";
        var variables = [email];
        query = mysql.format(query, variables);
        return this.queryDatabase(query);
      }

      //Add a new user
      addUser(email, pass, salt, firstName, lastName){
        var query = 'INSERT INTO Users (email, password, salt, FirstName, LastName) VALUES (?, ?, ?, ?, ?)';
        var variables = [email, pass, salt, firstName, lastName];
        query = mysql.format(query, variables);
        return this.queryDatabase(query);
      }

      //Delete a user account
      deleteUser(email, pass){

        var query = 'DELETE FROM Users WHERE email = ? AND password = ?';
        var variables = [email, pass];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);

      }

      //Change a users password
      changeUserPassword(userName, oldPass, newPass){

        var query = 'UPDATE Users SET password = ? WHERE email = ? AND password = ?';
        var variables = [newPass, userName, oldPass];
        query = mysql.format(query, variables);

        this.queryDatabase(query);

      }

      //Get all of the hats.
      getHats() {
        var query = 'SELECT * FROM products;';
        return this.queryDatabase(query);
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

      //Create a new order and send back the last inserted ID
      createOrder(orderTime,isShipped,trackingNumber,userId,orderTotal) {
        var query = 'INSERT INTO ORDERS (timeCreated, isShipped, trackingNumber, userId, total) VALUES (?, ?, ?, ?, ?)';
        var variables = [orderTime,isShipped,trackingNumber,userId,orderTotal];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);
      }

      orderHasItem(order,item,qty) {
        var query = 'INSERT INTO orderHasItem (`order`, item, qty) VALUES (?, ?, ?)';
        var variables = [order,item,qty];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);
      }

      getUserOrders(userId) {
        var query = 'SELECT TAHFT_DB.orders.timeCreated,TAHFT_DB.orders.trackingNumber,TAHFT_DB.orders.total, TAHFT_DB.orderHasItem.qty, TAHFT_DB.products.productID, TAHFT_DB.products.productName FROM TAHFT_DB.orders LEFT JOIN TAHFT_DB.orderHasItem ON orders.id=orderHasItem.`order` LEFT JOIN TAHFT_DB.products ON orderHasItem.item=products.productID WHERE TAHFT_DB.orders.userId=?';
        var variables = [userId];
        query = mysql.format(query, variables);

        return this.queryDatabase(query);
      }


      //Adds a new promotion
      addPromotion(){

      }

      //Deletes a specifc promotion
      deletePromotion(){

      }
}

module.exports = databaseHandler;