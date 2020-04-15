var mysql = require("mysql");
var inquirer = require("inquirer");
var columnify = require('columnify');

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
    console.log("\n----Welcome to Bamazon!!!----")
    displayItems();
  });

  function displayItems(){
    var query = "SELECT item_id,product_name,price FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        // console.log(res);
        var data = [];
        
        for (var i = 0; i < res.length; i++) {
            // console.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: " + res[i].price);
            data.push({Item_ID : res[i].item_id, Product : res[i].product_name, Price : "$ " + res[i].price});
            
        }
        // console.table(display);
        // var columns = (columnify(data, {columns: ['Item_ID', 'Product', 'Price']},{minWidth: 60}));
        var columns = (columnify(data, {minWidth: 20}));
        console.log("\n");
        console.log(columns);
        customerChoice();
    });
  }

  function customerChoice() {
      console.log("\n")
    inquirer
    .prompt([
      {
        name: "productId",
        type: "input",
        message: "What is the Item ID of the product you wish to purchase?",
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
        message: "How many would you like to buy?",
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
        //   console.log(res[0].stock_quantity);
        //   console.log(answer.quantity)
        if(parseInt(res[0].stock_quantity) >= parseInt(answer.quantity)) {
            var totalCost = parseInt(answer.quantity)*(res[0].price);           
            console.log("\nOrder in process.  Your cost will be $" + totalCost.toFixed(2));
            newQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
            userItem = answer.productId;
            // console.log(newQuantity)
            updateItems();
            continueOn();
        } else {
            console.log("Sorry we do not have enough inventory to fill your order");
            continueOn();
            // connection.end();
        }
      });
      });
  };

  function updateItems() {
    //   console.log(newQuantity)
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: userItem
            }
        ],
        function(err,res) {
            if(err) throw err;
            // console.log(res.affectedRows + " quantity changed.");
            // connection.end();
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
      message: "Would you like to place another order?",
      choices: [
          "Yes",
          "No"
      ]
    },
  ])
  .then(function(user) {
        
    switch (user.continue) {
        case "Yes":
            displayItems();
            break;

        case "No":
            console.log("\nThank you for shopping with Bamazon!");
            connection.end();
            break;
        
    }
  });
 }
  

