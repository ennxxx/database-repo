import express from 'express';
import cors from 'cors';
import { handleDisconnect } from "./helpers.js";
import mysql from 'mysql2/promise';
import { getAllAppointments, searchAppointments, getSingleAppointment, getTotalAppointments } from './routes/app.routes.js';
import { getLuzonRegions, getLuzonProvinces, getLuzonCities } from './routes/app.routes.js';
import { getVisayasRegions, getVisayasProvinces, getVisayasCities } from './routes/app.routes.js';
import { getMindanaoRegions, getMindanaoProvinces, getMindanaoCities } from './routes/app.routes.js';
import { createAppointment, deleteAppointment, editAppointment } from './routes/db.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// Function to get the latest timestamp from a log table
async function getLatestTimestamp(connection) {
    const [rows] = await connection.query('SELECT MAX(timestamp) as maxTimestamp FROM transaction_log');
    console.log('Latest timestamp fetched: ' + rows[0].maxTimestamp, "@", connection.connection.config.database);
    return rows[0].maxTimestamp;
}

// Function to get the operations from a log table after a certain timestamp
async function getOperationsAfterTimestamp(connection, timestamp) {
    const [rows] = await connection.query('SELECT * FROM transaction_log WHERE timestamp > ? ORDER BY timestamp', [timestamp]);
    console.log('Operations after timestamp fetched: ' + rows.length + ' rows.', "FROM ", connection.connection.config.database);
    console.log(rows);

    const [test] = await connection.query('SELECT * FROM transaction_log');
    console.log("OVER HERE IS THE LAMAN NG TRANSACTION LOG: ", test.length, "connection: ", connection.connection.config.database)
    return rows;
}

// Function to replay an operation
async function replayOperation(connection, operation) {
    console.log("operation on connection: ", connection.connection.config.database);
    console.log("operation: ", operation);
    const { operation_type: opType, table_name: table, old_data: oldValue, new_data: newValue } = operation;
    // console.log("OLD DATA: ", oldValue);
    // console.log("NEW DATA: ", newValue)
    
    // const parsedNewValue = JSON.parse(newValue);
    // const parsedOldValue= JSON.parse(oldValue);
    // console.log("PASERD NEW VALUE: ", parsedNewValue)
    
    switch (opType) {
        case 'INSERT':
            const insertQuery = "INSERT INTO appointments (`apptid`, `clinicid`, `doctorid`, `pxid`, `hospitalname`, `QueueDate`, `City`, `Province`, `RegionName`, `mainspecialty`) VALUES (?)";
            await connection.query(insertQuery, [[newValue.apptid, newValue.clinicid, newValue.doctorid, newValue.pxid, newValue.hospitalname, newValue.QueueDate, newValue.City, newValue.Province, newValue.RegionName, newValue.mainspecialty]]);
            console.log(`Inserted new record into ${table}.`);
            break;
        case 'UPDATE':
            const updateQuery = "UPDATE appointments SET `hospitalname` = ?, `QueueDate` = ?, `City` = ?, `Province` = ?, `RegionName` = ?, `mainspecialty` = ? WHERE apptid = ?"
            await connection.query(updateQuery, [newValue.hospitalname, newValue.QueueDate, newValue.City, newValue.Province, newValue.RegionName, newValue.mainspecialty, newValue.apptid]);
            console.log(`Updated record in ${table}.`);
            break;
        case 'DELETE':
            const deleteQuery = `DELETE FROM ${table} WHERE apptid = ?`;
            await connection.query(deleteQuery, [oldValue.apptid]);
            console.log(`Deleted record from ${table}.`);
            break;
        default:
            console.error(`Unknown operation type: ${opType}`);
            break;
    }
}

// Function to perform recovery
async function performRecovery(node1, node2) {
    const timestamp1 = await getLatestTimestamp(node1);
    const timestamp2 = await getLatestTimestamp(node2);
    console.log("node 1: ", node1.connection.config.database, "node 2: ", node2.connection.config.database);
    // node 2 more updated
    if (timestamp1 < timestamp2) {
        // get operations from node 2 after node 1's latest
        console.log("node 2 more updated")
        const operations = await getOperationsAfterTimestamp(node2, timestamp1);
        for (const operation of operations) {
            // execute operations on node 1
            await replayOperation(node1, operation);
        }
    // node 1 more updated
    } else if (timestamp2 < timestamp1) {
        console.log("node 1 more updated")
        const operations = await getOperationsAfterTimestamp(node1, timestamp2);
        for (const operation of operations) {
            await replayOperation(node2, operation);
        }
    } else {
        console.log('Nodes are already synced.');
    }
}

// Connect to the log tables
let centralLog = await mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20219,
    user: "root",
    password: "password1",
    database: "central_node"
});
console.log('Connected to central node.');

let luzonLog = await mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20220,
    user: "root",
    password: "password2",
    database: "luzon_node"
});
console.log('Connected to luzon node.');

let visminLog = await mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: 20221,
    user: "root",
    password: "password3",
    database: "vismin_node"
});
console.log('Connected to vismin node.');

// Perform recovery
console.log('Starting recovery process...');
await performRecovery(centralLog, luzonLog);
await performRecovery(centralLog, visminLog);
console.log('Recovery process completed.');

let { central, luzon, vismin } = handleDisconnect();

app.get('/appointments', getAllAppointments(central, luzon, vismin));
app.get('/search', searchAppointments(central, luzon, vismin));
app.get('/appointment', getSingleAppointment(central, luzon, vismin));
app.get("/total-appointments", getTotalAppointments(central));

app.get("/luzon-regions", getLuzonRegions(central));
app.get("/luzon-provinces", getLuzonProvinces(central));
app.get("/luzon-cities", getLuzonCities(central));

app.get("/visayas-regions", getVisayasRegions(central));
app.get("/visayas-provinces", getVisayasProvinces(central));
app.get("/visayas-cities", getVisayasCities(central));

app.get("/mindanao-regions", getMindanaoRegions(central));
app.get("/mindanao-provinces", getMindanaoProvinces(central));
app.get("/mindanao-cities", getMindanaoCities(central));

app.post('/createAppointment', createAppointment(central, luzon, vismin));
app.delete('/delete/:apptid', deleteAppointment(central, luzon, vismin));
app.put('/edit/:apptid', editAppointment(central, luzon, vismin));

app.listen(8800, () => {
    console.log('Successfully connected!');
});

