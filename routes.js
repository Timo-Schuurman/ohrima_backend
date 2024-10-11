const conn = require("./conn");
const express = require('express');

module.exports = function (app) {
    // Middleware to parse JSON data
    app.use(express.json()); // For parsing application/json
    app.use(express.urlencoded({ extended: false })); // For parsing application/x-www-form-urlencoded


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

    // Create a new tour (INSERT)
    app.post("/tours", function (req, res) {
        console.log("req.body:", req.body); // Log the received request body

        let sql = `INSERT INTO tours (event_name, event_date, location, ticket) VALUES (?, ?, ?, ?)`;

        conn.query(sql, [req.body.event_name, req.body.event_date, req.body.location, req.body.ticket], function (err, result) {
            if (err) {
                console.error(err); // Log error for better debugging
                res.status(500).send("Error adding the tour");
            } else {
                console.log("Insert ID:", result.insertId);
                res.send("Tour succesvol toegevoegd!");
            }
        });
    });

    // Update an existing tour (UPDATE)
    app.put("/tours/:id", function (req, res) {
        let { event_name, event_date, location, ticket } = req.body;
        let sql = "UPDATE tours SET event_name = ?, event_date = ?, location = ?, ticket = ? WHERE id = ?";
        conn.query(sql, [event_name, event_date, location, ticket, req.params.id], function (err, result) {
            if (err) {
                res.status(500).send("Error updating data");
            } else if (result.affectedRows === 0) {
                res.status(404).send("Tour not found");
            } else {
                res.send({ id: req.params.id, ...req.body });
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