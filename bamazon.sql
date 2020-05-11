DROP DATABASE IF EXISTS bamazon_clientdb;

CREATE DATABASE bamazon_clientdb;

USE bamazon_clientdb;

CREATE TABLE products (
	item_id INTEGER auto_increment NOT NULL,
    product_name VARCHAR (30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL (10,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	values ("Hammer", "Hardware", "29.99", "50"),
    ("Screwdriver", "Hardware", "9.99", "80"),
    ("Laptop", "Computers", "799.99", "15"),
    ("Monitor", "Computers", "299.99", "10"),
    ("Shorts", "Clothing", "24.99", "15"),
    ("Shirt", "Clothing", "15.99", "30"),
    ("TV", "Electronics", "999.99", "10"),
    ("Camera", "Electronics", "499.99", "20"),
    ("Vacuum", "Housewares", "199.99", "25"),
    ("Blender", "Housewares", "39.99", "25");
    
select * from auction_items;
