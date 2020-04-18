# bamazon

## Overview

This app is an Amazon-like storefront utilizing MySQL techniques recently earned.  It is the 12 assignment in my coding bootcamp class. The app will take in orders from customers and deplete stock from the store's inventory.

## Steps to complete in order to use App

1. Clone repository

2. Install required node packages
    * mysql
    * inquirer
    * columnify

## Commands for bamazonCustomer.js

* node bamazonCustomer.js

* If everything connected properly you will receive a welcome message and then the items will be displayed

* You will be prompted to enter an item id and then an amount.

* If there is enough quantity it will give you a total cost and ask if you want to continue or leave.  Behind the scenes it will also update the database's inventory.

* If there isn't enough quantity it will tell you and ask if you want to leave or stay.

## Commands for bamazonManager.js

  * If a manager selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, it will display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it will allow the manager to add a completely new product to the store.

### Demo video here

https://drive.google.com/file/d/192cEdER_zKHqrcd4UCFKnwSBYcvkNEPC/view

### Repo for cloning here

https://github.com/cshanebrown78/bamazon