var mysql = require("mysql");
var inquirer = require("inquirer");
// npm module for making columns
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
    // message to display when connected
    console.log("\n----Welcome to Bamazon!!!----")
    displayItems();
  });

  // function that displays the items for sale
  function displayItems(){
    var query = "SELECT item_id,product_name,price FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        // var that holds the array for displaying the items for sale
        var data = [];
        // loop to push each item into the data array
        for (var i = 0; i < res.length; i++) {
            data.push({Item_ID : res[i].item_id, Product : res[i].product_name, Price : "$ " + res[i].price.toFixed(2)});
        }
        
        var columns = (columnify(data, {minWidth: 20}));
        console.log("\n");
        console.log(columns);
        customerChoice();
    });
  }

  // function that uses inquirer to prompt customer for item and amount to purchase
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
        // if statement to determine if there is enough quantity and if so calculates the cost for the customer 
        if(parseInt(res[0].stock_quantity) >= parseInt(answer.quantity)) {
            var totalCost = parseInt(answer.quantity)*(res[0].price);           
            console.log("\nOrder in process.  Your cost will be $" + totalCost.toFixed(2));
            newQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
            // stores the new quantity to be used later
            userItem = answer.productId;

            updateItems();
            continueOn();
        } else {
            console.log("Sorry we do not have enough inventory to fill your order");
            continueOn();
            
        }
      });
      });
  };

  // function that updates the item quantities in the database
  function updateItems() {
    
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
            
        }
        );
  }

  // function that lets the user decide whether to order more or leave
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
  

