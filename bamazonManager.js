var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');

var newQuantity = 0;
var managerItem = 0;

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
    console.log("\n---Welcome to the Manager's Terminal---")
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
    // console.log("\n")
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        var data = [];
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            // console.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: " + res[i].price + " Quantity: " + res[i].stock_quantity);
            data.push({Item_ID : res[i].item_id, Product : res[i].product_name, Price : "$ " + res[i].price, Quantity : res[i].stock_quantity})
        }
        var columns = (columnify(data, {minWidth: 20}));
        console.log("\n");
        console.log(columns);
        continueOn();
    });
 }

 function lowInventory() {
    // console.log("\n")
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        var data = [];
        console.log("\n---Items low on inventory---");
        for (var i = 0; i < res.length; i++) {
            if (parseInt(res[i].stock_quantity) < 5) {
                // nodeconsole.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: " + res[i].price + " Quantity: " + res[i].stock_quantity);
                data.push({Item_ID : res[i].item_id, Product : res[i].product_name, Price : "$ " + res[i].price, Quantity : res[i].stock_quantity})
            }
        }
        var columns = (columnify(data, {minWidth: 20}));
        console.log("\n");
        console.log(columns);
        continueOn();
    });
 }

 function addInventory(){
  console.log("\n")
  inquirer
  .prompt([
    {
      name: "productId",
      type: "input",
      message: "What is the Item ID of the product you wish to add inventory to?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How much would you like to add?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(answer) {
    var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE ?";
    connection.query(query, {item_id: answer.productId}, function(err, res) {
    
      newQuantity = parseInt(res[0].stock_quantity) + parseInt(answer.quantity);
      managerItem = answer.productId;
      updateItems();
      
    });
  });
}

 function updateItems() {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
        {
            stock_quantity: newQuantity
        },
        {
            item_id: managerItem
        }
    ],
    function(err,res) {
        if(err) throw err;
        // console.log(res.affectedRows + " quantity changed.");
        // connection.end();
        displayItems();
    }
    );
 }

 function continueOn() {
  console.log("\n")
inquirer
.prompt([
  {
    name: "continue",
    type: "list",
    message: "Continue or Exit?",
    choices: [
        "Continue",
        "Exit"
    ]
  },
])
.then(function(user) {
      
  switch (user.continue) {
      case "Continue":
          managerChoice();
          break;

      case "Exit":
          console.log("\nLogged Out");
          connection.end();
          break;
      
  }
});
}