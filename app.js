const express = require('express')
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const cors = require('cors')


// create connection - local environment
// var db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     database : 'expensetracker'
// });
// create connection - hostinger hosting
var db = mysql.createConnection({
    host     : 'sql6.freesqldatabase.com',
    user     : 'sql6635398',
    password: 'pfc6ZG5BFb',
    database : 'sql6635398'
});
// connect db
 db.connect((err) => {
    if(err) throw err;
    console.log("MySql connected...")
})

const app = express()
app.use(cors({ origin: 'https://reactexpensetracker.000webhostapp.com' })) // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// registration
app.post("/register", (req, res) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
        if(err){
            console.log(err);
        }

        const sql = `INSERT INTO users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${hashedPassword}');`
        const query = db.query(sql, (err, result) => {
            if(err) res.send(err)
            console.log(result);
        })
    });
})

// get transactions
app.get("/transactions", (req, res) => {
    let sql = "SELECT * FROM transactions ORDER BY id DESC LIMIT 5"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get all transactions
app.get("/alltransactions", (req, res) => {
    let sql = "SELECT * FROM transactions ORDER BY id DESC"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})

// get selected transactions
app.get("/gettransaction/:id", (req, res) => {
    let sql = `SELECT * FROM transactions WHERE id = ${req.params.id}`
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        //const message = result.affectedRows > 0 ? "Record fetched" : "Record not found";
        res.send({result});
    })
})

// update selected transaction
app.put("/updatetransaction/:id", (req, res) => {
    console.log({formData: req.body})
    let sql = `UPDATE transactions SET type = "${req.body.type}", category = "${req.body.category}", description = "${req.body.description}", amount = "${req.body.amount}" WHERE id = "${req.params.id}"`
    let query = db.query(sql, (err, result) => {
        if (err) res.send(err);
        console.log(result)
        res.send("Updated successfully")
    })
})

// delete selected transaction
app.delete('/deletetransaction/:id', (req, res) => {
    let sql = `DELETE FROM transactions WHERE id = "${req.params.id.substring(1)}"`
    let query = db.query(sql, (err, result) => {
        if (err) res.send(err);
        const message = result.affectedRows > 0 ? "Record deleted" : "Record not found";
        res.send(result.message = message);
    })
})
// post transaction
app.post("/addTransaction", (req, res) => {
    console.log(req.body)
    let sql = `INSERT INTO transactions (type, category, description, amount) VALUES ("${req.body.type}", "${req.body.category}", "${req.body.description}", "${req.body.amount}")`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        res.send("Transaction added successfully")
        console.log(results)
    })
})

// get total expense amount
app.get("/totalexpense", (req, res) => {
    let sql = "SELECT type, SUM(amount) AS total_sum FROM transactions WHERE type = 'expense' GROUP BY type;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get total income amount
app.get("/totalincome", (req, res) => {
    let sql = "SELECT type, SUM(amount) AS total_sum FROM transactions WHERE type = 'income' GROUP BY type;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get total by food
app.get("/totalfood", (req, res) => {
    let sql = "SELECT category, SUM(amount) AS total FROM transactions WHERE category = 'food' GROUP BY category;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get total by shopping
app.get("/totalshopping", (req, res) => {
    let sql = "SELECT category, SUM(amount) AS total FROM transactions WHERE category = 'shopping' GROUP BY category;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get total by medical
app.get("/totalmedical", (req, res) => {
    let sql = "SELECT category, SUM(amount) AS total FROM transactions WHERE category = 'medical' GROUP BY category;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// get total by food
app.get("/totalother", (req, res) => {
    let sql = "SELECT category, SUM(amount) AS total FROM transactions WHERE category = 'other' GROUP BY category;"
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        console.log(results)
        res.send(results)
    })
})
// run server
app.listen('3306', () => {
    console.log("Server started running on PORT 3306")
})