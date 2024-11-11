const express = require('express');

const { registerUser } = require("./userController");
const { loginUser } = require("./login");
const { protect, admin } = require('./authMiddleware'); 
const { merch } = require('./controllers/merchController');


const conn = require("./conn");

module.exports = function (app) {
    // Middleware to parse JSON data
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: false }));

    // // Login and register // //
    app.post('/signup', registerUser); 
    app.post("/login", loginUser);

    // Route to Merch
    app.use('/merch', merch);

    // // TOURS // //
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

    // // MUSIC // //
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

    // // ADMIN ONLY ENDPOINTS // //
    app.post("/tours", protect, admin, function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => [obj1[key]]);
        let sql = `INSERT INTO tours (event_name, event_date, location, ticket) VALUES (?, ?, ?, ?)`;
        conn.query(sql, arr1, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).send("Error adding the tour");
            } else {
                res.send("Tour successfully added!");
            }
        });
    });

    app.put("/tours/:id", protect, admin, function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => obj1[key]);

        let sql = "UPDATE tours SET event_name = ?, event_date = ?, location = ?, ticket = ? WHERE id = ?";
        conn.query(sql, [...arr1, req.params.id], function (err, result) {
            if (err) {
                console.error("Database error:", err);
                res.status(500).send("Error updating the tour");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Tour not found");
            } else {
                res.send({ id: req.params.id, ...req.body[0] });
            }
        });
    });

    app.delete("/tours/:id", protect, admin, function (req, res) {
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

    // MUSIC ADMIN ENDPOINTS
    app.post("/music", protect, admin, function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => [obj1[key]]);
        let sql = `INSERT INTO music (name, music_path) VALUES (?, ?)`;
        conn.query(sql, arr1, function (err, result) {
            if (err) {
                console.error(err);
                res.status(500).send("Error adding the music");
            } else {
                res.send("Music successfully added!");
            }
        });
    });

    app.put("/music/:id", protect, admin, function (req, res) {
        let obj1 = req.body[0];
        let arr1 = Object.keys(obj1).map((key) => obj1[key]);

        let sql = "UPDATE music SET name = ?, music_path = ? WHERE id = ?";
        conn.query(sql, [...arr1, req.params.id], function (err, result) {
            if (err) {
                console.error("Database error:", err);
                res.status(500).send("Error updating the music");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Music entry not found");
            } else {
                res.send({ id: req.params.id, ...req.body[0] });
            }
        });
    });

    app.delete("/music/:id", protect, admin, function (req, res) {
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