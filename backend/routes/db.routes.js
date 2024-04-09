import mysql from 'mysql2';
import { determineRegion, isCentralConnected, isLuzonConnected, isVisMinConnected } from '../helpers.js';

export const createAppointment = (central, luzon, vismin) => (req, res) => {
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

    if (isCentralConnected()){
        central.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            if (!(isLuzonConnected() && isVisMinConnected())){  // when other node is down, need to ensure it queries successfully to central node
                return res.json("Successfully created appointment!")
            }
        });
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            // wheter or not this errors still need to execute, cuz in case error, it will log 
            luzon.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        } else {
            // wheter or not this errors still need to execute, cuz in case error, it will log 
            vismin.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        }
    } else {    // central node is down, no need to check if others are down bcuz specs say only 1 can be down
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            luzon.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                // return res.json("Successfully created appointment!")
            });
        } else {
            vismin.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                // return res.json("Successfully created appointment!")
            });
        }
        // this will error, but needed for logs
        central.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json("Successfully created appointment!")
        });
    }
}

export const deleteAppointment = (central) => (req, res) => {
    const apptId = req.params.apptid;
    const q = "DELETE FROM appointments WHERE apptid = ?"

    central.query(q, [apptId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Succesfully deleted appoinment!");
    })
}

export const editAppointment = (central) => (req, res) => {
    const apptId = req.params.apptid;
    const q = "UPDATE appointments SET `hospitalname` = ?, `QueueDate` = ?, `City` = ?, `Province` = ?, `RegionName` = ?, `mainspecialty` = ? WHERE apptid = ?"

    const values = [
        req.body.hospitalname,
        req.body.QueueDate,
        req.body.City,
        req.body.Province,
        req.body.RegionName,
        req.body.mainspecialty
    ];

    central.query(q, [...values, apptId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Succesfully edited appoinment!");
    })
}
