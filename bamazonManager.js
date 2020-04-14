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
    managerChoice();
  });


  function managerChoice() {
    console.log("\n")
  inquirer
  .prompt([
    {
      name: "choice",
      type: "list",
      message: "Please choose from the list below.",
      choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
      ]
    },
  ])
  .then(function(answer) {
    
    switch (answer.choice) {
        case "View Products for Sale":
            displayItems();
            break;

        case "View Low Inventory":
            lowInventory();
            break;
        
        case "Add to Inventory":
            addInventory();
            break;

        case "Add New Product":
            addProduct();
            break;
    }
  });
 }

 function displayItems() {
    console.log("\n")
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: " + res[i].price + " Quantity: " + res[i].stock_quantity);
        }
        managerChoice();
    });
 }
