/**
Class to represent datbase connections.
*/

const mysql = require('mysql');

class database {

  //Creates a database object and takes the json file with connection information.
  constructor(data){

    //Check that login information has been provided
    if(!data){
      throw "Error: no login file given";
    }
    //Set the login variables
    else{
      //Check that all the required fields are completed
      if(!data.host || !data.port || !data.user || !data.password){
        throw "Error: Incomplete database login information";
      }
      //Set the variables required to create a conection.
      else{
        this.user = data.user;
        this.host = data.host;
        this.password = data.password;
        this.port = data.port;
        this.database = data.database
      }
    }
  }

  //A Method to create a connection pool, returns a promise
  createConnPool() {
    return new Promise(function(resolve,reject) {
      //Create a connection pool
      this.pool = mysql.createPool({
        connectionLimit:10,
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      })

      this.pool.getConnection((err, connection) => {
        //Checks the connection for errors
        if(err){
          if(connection){
            try {
              connection.release();
            }
            catch(err) {
              console.log(err);
            }
          }
          reject(err);
          if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            throw "Error: connection to database was closed";
          }
          else if(err.code === 'ER_CON_COUNT_ERROR'){
            throw "Error: too many connections to database";
          }
          else if(err.code === 'ECONNREFUSED' || err.code ==='ER_ACCESS_DENIED_ERROR'){
            throw "Error: connection to database was refused";
          }
          else if (err.code === "ER_DUP_ENTRY") {
            throw "Error: duplicate unique entry" + err;
          }

        }
        else {
          if(connection){
            connection.release();
          }
          resolve(true);
        }
      });
    }.bind(this));
  }
}

module.exports = database;
