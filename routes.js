const conn = require("./conn");
const express = require('express');
const { registerUser } = require("./userController");
const { loginUser } = require("./login");

module.exports = function (app) {
    // Middleware to parse JSON data
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded


// // Login and register // //

    // Registration route
    app.post('/signup', registerUser); 

    // Login route
    app.post("/login", loginUser);
    
    

// // TOURS // //

    // Get all tours
    app.get("/tours", function (req, res) {
        let sql = "SELECT * FROM tours";
        conn.query(sql, function (err, rows) {
            if (err) {
                res.status(500).send("Error retrieving data");
            } else {
                res.send(rows);
            }
        });
    });

    // 3 newest tours

    app.get("/tours/new", function (req, res) {
        let sql = "SELECT * FROM tours ORDER BY event_date DESC LIMIT 3";  
        conn.query(sql, function (err, rows) {
            if (err) {
                console.error(err);  
                res.status(500).send("Error retrieving data");
            } else {
                res.send(rows);
            }
        });
    });

    // Create a new tour (INSERT)
    app.post("/tours", function (req, res) {
        console.log("req.bodytje:", req.body); // Log the received request body
        let obj1 = req.body[0]
        var arr1 = Object.keys(obj1).map((key) => [obj1[key]]);
        console.log("arr1=", arr1)
        let sql = `INSERT INTO tours (event_name, event_date, location, ticket) VALUES (?, ?, ?, ?)`;
        conn.query(sql, arr1, function (err, result) {
            if (err) {
                console.error(err); // Log error for better debugging

                res.status(500).send("Error adding the tour");
            } else {
                console.log("Insert IDtje:", result.insertId)
                res.send("Tour succesvol toegevoegd!")
            }
        });
    });

    app.put("/tours/:id", function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => obj1[key]); // Reuse the same mapping approach for consistency
    
        let sql = "UPDATE tours SET event_name = ?, event_date = ?, location = ?, ticket = ? WHERE id = ?";
        conn.query(sql, [...arr1, req.params.id], function (err, result) {
            if (err) {
                console.error("Database error:", err); // Log error for better debugging
                res.status(500).send("Error updating the tour");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Tour not found");
            } else {
                console.log("Updated ID:", req.params.id);
                res.send({ id: req.params.id, ...req.body[0] }); // Respond with the updated resource
            }
        });
    });
    // Delete a tour (DELETE)
    app.delete("/tours/:id", function (req, res) {
        let sql = "DELETE FROM tours WHERE id = ?";
        conn.query(sql, [req.params.id], function (err, result) {
            if (err) {
                res.status(500).send("Error deleting data");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Tour not found");
            } else {
                res.send({ message: "Tour deleted successfully" });
            }
        });
    });

// // MUSIC // //

    // Get all music entries
    app.get("/music", function (req, res) {
        let sql = "SELECT * FROM music";
        conn.query(sql, function (err, rows) {
        if (err) {
            res.status(500).send("Error retrieving data");
        } else {
            res.send(rows);
        }
        });
    });

    // Create a new music (INSERT)
    app.post("/music", function (req, res) {
        console.log("req.bodytje:", req.body); // Log the received request body
        let obj1 = req.body[0]
        var arr1 = Object.keys(obj1).map((key) => [obj1[key]]);
        console.log("arr1=", arr1)
        let sql = `INSERT INTO tours (name, music_path) VALUES (?, ?, ?, ?)`;
        conn.query(sql, arr1, function (err, result) {
            if (err) {
                console.error(err); // Log error for better debugging

                res.status(500).send("Error adding the music");
            } else {
                console.log("Insert IDtje:", result.insertId)
                res.send("Music succesvol toegevoegd!")
            }
        });
    });

    app.put("/music/:id", function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => obj1[key]); // Reuse the same mapping approach for consistency
    
        let sql = "UPDATE tours SET name = ?, music_path = ? WHERE id = ?";
        conn.query(sql, [...arr1, req.params.id], function (err, result) {
            if (err) {
                console.error("Database error:", err); // Log error for better debugging
                res.status(500).send("Error updating the tour");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Tour not found");
            } else {
                console.log("Updated ID:", req.params.id);
                res.send({ id: req.params.id, ...req.body[0] }); // Respond with the updated resource
            }
        });
    });

    // Delete a music entry (DELETE)
    app.delete("/music/:id", function (req, res) {
        let sql = "DELETE FROM music WHERE id = ?";
        conn.query(sql, [req.params.id], function (err, result) {
        if (err) {
            res.status(500).send("Error deleting data");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Music entry not found");
        } else {
            res.send({ message: "Music entry deleted successfully" });
        }
        });
    });
};