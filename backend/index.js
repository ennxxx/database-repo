import express from "express"
import mysql from "mysql2"
import cors from "cors"

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

app.use(cors())

app.get("/", (req, res) => {
    res.json("Homepage")
})

app.get("/central", (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM appointments LIMIT ${limit} OFFSET ${offset}`;
    central.query(q, (err, data) => {
        if (err) return res.json(err);

        const countQuery = "SELECT COUNT(*) AS totalCount FROM appointments";
        central.query(countQuery, (err, countData) => {
            if (err) return res.json(err);
            const totalCount = countData[0].totalCount;
            const totalPages = Math.ceil(totalCount / limit);
            return res.json({ data, totalPages });
        });
    })
})

app.get("/search", (req, res) => {
    const { searchTerm, page, limit } = req.query;
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%' LIMIT ${limit} OFFSET ${offset}`;
    central.query(q, (err, data) => {
        if (err) return res.json(err);
        const countQuery = `SELECT COUNT(*) AS totalCount FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%'`;
        central.query(countQuery, (err, countData) => {
            if (err) return res.json(err);
            const totalCount = countData[0].totalCount;
            const totalPages = Math.ceil(totalCount / limit);
            return res.json({ data, totalPages });
        });
    })
})

app.listen(8800, () => {
    console.log("Successfully connected!")
})