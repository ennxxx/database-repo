import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import { getAllAppointments, searchAppointments, getSingleAppointment, getTotalAppointments } from './routes/app.routes.js';
import { getLuzonRegions, getLuzonProvinces, getLuzonCities } from './routes/app.routes.js';
import { getVisayasRegions, getVisayasProvinces, getVisayasCities } from './routes/app.routes.js';
import { getMindanaoRegions, getMindanaoProvinces, getMindanaoCities } from './routes/app.routes.js';
import { createAppointment, deleteAppointment, editAppointment } from './routes/db.routes.js';

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
        console.log('central db error', err); 
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
        console.log('luzon db error', err); 
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
        console.log('vismin db error', err); 
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect(); 
        } else { 
            throw err; 
        } 
    }); 
} 
 
handleDisconnect(); 


app.get('/appointments', getAllAppointments(central));
app.get('/search', searchAppointments(central));
app.get('/appointment', getSingleAppointment(central, luzon, vismin));
app.get("/total-appointments", getTotalAppointments(central));

app.post('/createAppointment', createAppointment(central, luzon, vismin));
app.delete('/delete/:apptid', deleteAppointment(central, luzon, vismin));
app.put('/edit/:apptid', editAppointment(central, luzon, vismin));


app.get("/luzon-regions", getLuzonRegions(central));
app.get("/luzon-provinces", getLuzonProvinces(central));
app.get("/luzon-cities", getLuzonCities(central));

app.get("/visayas-regions", getVisayasRegions(central));
app.get("/visayas-provinces", getVisayasProvinces(central));
app.get("/visayas-cities", getVisayasCities(central));

app.get("/mindanao-regions", getMindanaoRegions(central));
app.get("/mindanao-provinces", getMindanaoProvinces(central));
app.get("/mindanao-cities", getMindanaoCities(central));

app.listen(8800, () => {
    console.log('Successfully connected!');
});

