import express from 'express';
import cors from 'cors';
import { handleDisconnect } from "./helpers.js";
import { getAllAppointments, searchAppointments, getSingleAppointment, getTotalAppointments } from './routes/app.routes.js';
import { getLuzonRegions, getLuzonProvinces, getLuzonCities } from './routes/app.routes.js';
import { getVisayasRegions, getVisayasProvinces, getVisayasCities } from './routes/app.routes.js';
import { getMindanaoRegions, getMindanaoProvinces, getMindanaoCities } from './routes/app.routes.js';
import { createAppointment, deleteAppointment, editAppointment } from './routes/db.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

let { central, luzon, vismin } = handleDisconnect();

app.get('/appointments', getAllAppointments(central));
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

