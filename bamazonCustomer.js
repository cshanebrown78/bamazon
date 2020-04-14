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

  function displayItems(){
    var query = "SELECT item_id,product_name,price FROM products";
    connection.query(query, function(err, res) {
        if(err) throw err;
        // console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " Product: " + res[i].product_name + " Price: " + res[i].price);
        }
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
          console.log(res[0].stock_quantity);
          console.log(answer.quantity)
        if(parseInt(res[0].stock_quantity) >= parseInt(answer.quantity)) {
            var totalCost = parseInt(answer.quantity)*(res[0].price);           
            console.log("Order in process.  Your cost will be $" + totalCost.toFixed(2));
            newQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
            userItem = answer.productId;
            console.log(newQuantity)
            updateItems()
        } else {
            console.log("Sorry we do not have enough inventory to fill your order");
            // displayItems();
        }
      });
      });
  };

  function updateItems() {
      console.log(newQuantity)
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
            connection.end;
        }
        );
  }

