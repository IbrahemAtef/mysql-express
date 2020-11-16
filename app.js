const express = require('express');
const mysql = require('mysql'); 

// create connection to db 
const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: '',
    database: 'test'
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
        // console.log(result);
        res.send('Database created...')
    })
})

// create table
app.get('/createpoststable', (req, res) => {
    let sql = 'CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('Posts table created...')
        res.send(result);
    })
})

// for adding a post
app.post('/addpost', (req, res)=>{
    const {title, body} = req.body;
    let post = { title , body};
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('post added...')
        res.send(result);
    })
})

// for fetching all posts 
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        // console.log(results);
        // res.send('Posts fetched...')
        res.send(results);
    })
})

// for fetching single post
app.get('/getposts/:id', (req, res) => {
    const {id} = req.params;
    let sql = `SELECT * FROM posts WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('Post fetched...')
        res.send(result);
    })
})

// for update single post 
app.get('/updatepost/:id', (req, res) => {
    const newTitle = 'Updated Title';
    const {id} = req.params;
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('Post updated...')
        res.send(result);
    })
})

// for delete single post 
app.get('/deletepost/:id', (req, res) => {
    const {id} = req.params;
    let sql = `DELETE FROM posts WHERE id = ${id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(result);
        // res.send('Post deleted...')       
        res.send(result);
    })
})

app.listen('3000', ()=>{
    console.log(`Server started on prot 3000`);
})