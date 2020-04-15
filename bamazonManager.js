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
            data.push({Item_ID : res[i].item_id, Product : res[i].product_name, Price : "$ " + res[i].price.toFixed(2), Quantity : res[i].stock_quantity})
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

 function addProduct() {
  inquirer
  .prompt([
    {
      name: "product",
      type: "input",
      message: "What is the product name?",
    },
    {
      name: "department",
      type: "list",
      message: "What department will this product sold in?",
      choices: ["Hardware", "Computers", "Electronics", "Clothing", "Housewares"]
    },
    {
      name: "price",
      type: "input",
      message: "What is the price of the product?(0.00)",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "number",
      type: "input",
      message: "Quantity?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(answer) {
    var x = parseFloat(answer.price);
    y = x.toFixed(2);
    console.log(y);
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.product,
        department_name: answer.department,
        price: y,
        stock_quantity: answer.number
      },
      function (err, res) {
        if (err) throw err;
        console.log("\n---" + res.affectedRows + " product inserted!---")
        displayItems();
      }
    );
  });
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