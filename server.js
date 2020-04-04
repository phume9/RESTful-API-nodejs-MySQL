const express = require('express');
const app = express(); //After install express framework 
const mysql = require('mysql'); //Install mysql package by using node package manager

//Becaue Express can't really recieve request 
//body so the default will be undefined.
//In order to fix this, body-parser middleware will be used.
app.use(express.json());

//create and declare connection to the database (MySQL workbench and server)
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'node-api-101', //database schema name
    multipleStatements: true
});

//This will tell that if database connected successfully then display
//DB connection succeeded but if not then display DB connection failed with error message
mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.'); //This will display in terminal
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

//To show all products that is available in the database 
app.get('/products', (req, res) => {
    ////This line below will read and select from database name called products
    mysqlConnection.query('SELECT * FROM products', (err, rows, fields) => { 
        if (!err)
            res.send(rows); //respond back the results
        else
            console.log(err); //Display error
    })
});

//To show products by id whihc is available in the database
app.get('/products/:id', (req, res) => {
    //Connect to database and scan through ids 
    mysqlConnection.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);// If the id is valid then display results
        else
            console.log(err);// If not throw in error
    })
});

//Delete products by id from the database
app.delete('/products/:id', (req, res) => {
    //Connect to database and find the id to delete it 
    mysqlConnection.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.'); //If the id match then delete
        else
            console.log(err);// If the id is invalid then display the error
    })
});

//Insert the products into database
app.post('/products', (req, res) => {
    let prod = req.body; //Declare prod to request body
    // Below line will SET varible = value1, value2 ,etc to insert new info according typed in
    var sql = "SET @id = ?;SET @product_name = ?;SET @product_number = ?;SET @category = ?;SET @price = ?; \
    CALL productsAddOrEdit(@id,@product_name,@product_number,@category,@price);";
    //Here below will connect to the database and request body by using prod that delcared
    mysqlConnection.query(sql, [prod.id, prod.product_name, prod.product_number, prod.category, prod.price], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                //If insert success then show message follow by new id
                res.send('Inserted product id : '+element[0].id);
            });
        else
            console.log(err);//If failed then show error
    })
});

//To updaing products
app.put('/products', (req, res) => {
    let prod = req.body; //Declare prod to request body
    // Below line will SET varible = value1, value2 ,etc to update new info according typed in
    var sql = "SET @id = ?;SET @product_name = ?;SET @product_number = ?;SET @category = ?;SET @price = ?; \
    CALL productsAddOrEdit(@id,@product_name,@product_number,@category,@price);"; //productsAddOrEdit is a stored procedures created in mysql workbench
    //Here below will connect to the database and request body by using prod that delcared
    mysqlConnection.query(sql, [prod.id, prod.product_name, prod.product_number, prod.category, prod.price], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully'); //Display message if updated successfully
        else
            console.log(err);// Display message if failed to update
    })
});

app.listen(3000, () => {   //Declare port to 3000 so it will be localhost:3000
    console.log('Application is running on port 3000') //Display message when running in terminal
});