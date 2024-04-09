import express from 'express';
import cors from 'cors';
import { handleDisconnect } from "./helpers.js";
import { getAllAppointments, searchAppointments,  getSingleAppointment } from './routes/app.routes.js';
import { createAppointment, deleteAppointment, editAppointment } from './routes/db.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

let { central, luzon, vismin } = handleDisconnect();

app.get('/appointments', getAllAppointments(central));
app.get('/search', searchAppointments(central));
app.get('/appointment', getSingleAppointment(central));
app.post('/createAppointment', createAppointment(central, luzon, vismin));
app.delete('/delete/:apptid', deleteAppointment(central));
app.put('/edit/:apptid', editAppointment(central));



app.listen(8800, () => {
    console.log('Successfully connected!');
});
// View Records
/****************** GENERATE REPORT ******************/

// Get total number of appointments per region
app.get("/total-appointments", (req, res) => {
    const { tab } = req.query;
    let q = "";
    if (tab === "Overall") {
        q = "SELECT COUNT(*) AS totalCount FROM appointments";
    } else if (tab == "Luzon") {
        q = "SELECT COUNT(*) AS totalCount FROM appointments WHERE RegionName IN ('Ilocos Region (I)', 'Cagayan Valley (II)', 'Central Luzon (III)', 'CALABARZON (IV-A)', 'MIMAROPA (IV-B)', 'Bicol Region (V)', 'National Capital Region (NCR)', 'Cordillera Administrative Region (CAR)')";
    } else if (tab == "Visayas") {
        q = "SELECT COUNT(*) AS totalCount FROM appointments WHERE RegionName IN ('Western Visayas (VI)', 'Central Visayas (VII)', 'Eastern Visayas (VIII)')";
    } else {
        q = "SELECT COUNT(*) AS totalCount FROM appointments WHERE RegionName IN ('Zamboanga Peninsula (IX)', 'Northern Mindanao (X)', 'Davao Region (XI)', 'SOCCSKSARGEN (Cotabato Region) (XII)', 'Caraga (XIII)', 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)')";
    }
    central.query(q, (err, data) => {
        if (err) return res.json(err);
        const totalCount = data[0].totalCount;
        return res.json({ totalCount });
    });
});