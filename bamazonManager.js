var mysql = require("mysql");
var inquirer = require("inquirer");

var newQuantity = 0;
var userItem = 0;

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "A!rplane1",
    database: "bamazon_clientdb"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connected")
    displayItems();
  });