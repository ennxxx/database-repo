import express from 'express';
import cors from 'cors';
import { handleDisconnect } from "./helpers.js";
import { getAllAppointments, searchAppointments,  getSingleAppointment, getTotalAppointments } from './routes/app.routes.js';
import { createAppointment, deleteAppointment, editAppointment } from './routes/db.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

let { central, luzon, vismin } = handleDisconnect();

app.get('/appointments', getAllAppointments(central));
app.get('/search', searchAppointments(central));
app.get('/appointment', getSingleAppointment(central));
app.get("/total-appointments", getTotalAppointments(central));

app.post('/createAppointment', createAppointment(central, luzon, vismin));
app.delete('/delete/:apptid', deleteAppointment(central));
app.put('/edit/:apptid', editAppointment(central));

app.listen(8800, () => {
    console.log('Successfully connected!');
});

