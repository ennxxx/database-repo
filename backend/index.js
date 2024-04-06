import express from "express"
import mysql from "mysql2"

const app = express()

const central = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20219,
    user: "root",
    password: "password1",
    database: "central_node"
})

const luzon = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20220,
    user: "root",
    password: "password2",
    database: "luzon_node"
})

const vismin = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20221,
    user: "root",
    password: "password3",
    database: "vismin_node"
})

app.get("/", (req, res) => {
    res.json("Homepage")
})

app.get("/central", (req, res) => {
    const q = "SELECT * FROM appointments LIMIT 10";
    central.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get("/luzon", (req, res) => {
    const q = "SELECT * FROM appointments LIMIT 10";
    luzon.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.get("/vismin", (req, res) => {
    const q = "SELECT * FROM appointments LIMIT 10";
    vismin.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

app.listen(8800, () => {
    console.log("Successfully connected!")
})