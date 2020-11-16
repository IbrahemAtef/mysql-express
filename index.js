const express = require('express');
const mysql = require('mysql'); 

// create connection to db 
const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'test2'
})

// connect db
db.connect((err)=>{
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
})

const app = express();

app.use(express.json({ extended: false }));

// Create DB
app.get('/createdb', (req, res)=>{
    let sql = 'CREATE DATABASE test'
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send('Database created...')
    })
})

// create table
app.get('/createCustomersTable', (req, res) => {
    let sql = 'CREATE TABLE customers(customer_id int, first_name VARCHAR(50), last_name VARCHAR(50), email_address VARCHAR(50),number_of_complaints int, PRIMARY KEY (customer_id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})
// create table
app.get('/createSalesTable', (req, res) => {
    let sql = 'CREATE TABLE sales(purchase_number int, date_of_purchase VARCHAR(25), customer_id int, item_code VARCHAR(10), PRIMARY KEY (purchase_number))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('Posts table created...')
        res.send(result);
    })
})
// create table
app.get('/createItemsTable', (req, res) => {
    let sql = 'CREATE TABLE items(item_code VARCHAR(10), item VARCHAR(50), unit_price_usd int, company_id int, company text, headquarters_phone_number VARCHAR(100), PRIMARY KEY (item_code))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// for adding a customer
app.post('/addCustomer', (req, res)=>{
    const {customer_id, first_name, last_name, email_address, number_of_complaints} = req.body;
    let customer = { customer_id, first_name, last_name, email_address, number_of_complaints};
    let sql = 'INSERT INTO customers SET ?';
    let query = db.query(sql, customer, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// for fetching all customers 
app.get('/getCustomers', (req, res) => {
    let sql = 'SELECT * FROM customers';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

// for adding a sale
app.post('/addSale', (req, res)=>{
    const {purchase_number, date_of_purchase, customer_id, item_code} = req.body;
    let sale = { purchase_number, date_of_purchase, customer_id, item_code};
    let sql = 'INSERT INTO sales SET ?';
    let query = db.query(sql, sale, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// for fetching all sales 
app.get('/getSales', (req, res) => {
    let sql = 'SELECT * FROM sales';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

// for adding a item
app.post('/addItem', (req, res)=>{
    const { item_code, item, unit_price_usd, company_id, company, headquarters_phone_number} = req.body;
    let item_obj = { item_code, item, unit_price_usd, company_id, company, headquarters_phone_number };
    let sql = 'INSERT INTO items SET ?';
    let query = db.query(sql, item_obj, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// for fetching all items 
app.get('/getItems', (req, res) => {
    let sql = 'SELECT * FROM items';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    })
})

// fetch the customers with the total of price for everyone
app.get('/getCustomersWithTotalPrice', (req, res) => {
    let sql = `SELECT c.first_name, c.last_name, sum(i.unit_price_usd) as 'Total' from customers c JOIN items i JOIN sales s WHERE c.customer_id = s.customer_id AND s.item_code = i.item_code GROUP BY c.first_name
    `;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

app.get('/getCustomersWithItemsTheyBuyAndDate', (req, res) => {
    let sql = `SELECT c.first_name, c.last_name, s.date_of_purchase, i.item from customers c JOIN items i JOIN sales s WHERE c.customer_id = s.customer_id AND s.item_code = i.item_code
    `;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

app.listen('3000', ()=>{
    console.log(`Server started on prot 3000`);
})