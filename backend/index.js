import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express();

app.use(express.json());
app.use(cors());

let central, luzon, vismin;

function handleDisconnect() {
    central = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: 20219,
        user: "root",
        password: "password1",
        database: "central_node"
    });

    central.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });

    luzon = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: 20220,
        user: "root",
        password: "password2",
        database: "luzon_node"
    });

    luzon.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });

    vismin = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: 20221,
        user: "root",
        password: "password3",
        database: "vismin_node"
    });

    vismin.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

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
    });
});

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
    });
});

app.post("/central", (req, res) => {
    const q = "INSERT INTO appointments (`apptid`, `clinicid`, `doctorid`, `pxid`, `hospitalname`, `QueueDate`, `City`, `Province`, `RegionName`, `mainspecialty`) VALUES (?)";

    const values = [
        req.body.apptid,
        req.body.clinicid,
        req.body.doctorid,
        req.body.pxid,
        req.body.hospitalname,
        req.body.QueueDate,
        req.body.City,
        req.body.Province,
        req.body.RegionName,
        req.body.mainspecialty
    ];

    central.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("Successfully created appointment!")
    });
});

app.delete("/central/:apptid", (req, res) => {
    const apptId = req.params.apptid;
    const q = "DELETE FROM appointments WHERE apptid = ?"

    central.query(q, [apptId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Succesfully deleted appoinment!");
    })
})

app.listen(8800, () => {
    console.log("Successfully connected!");
});