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

    // // original
    // central.query(q, [values], (err, data) => {
    //     if (err) return res.json(err);
    //     return res.json("Successfully created appointment!")
    // });

    if (isCentralConnected(central)){
        central.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            if (!(isLuzonConnected(luzon) && isVisMinConnected(vismin))){  // when other node is down, need to ensure it queries successfully to central node
                return res.json("Successfully created appointment!")
            }
        });
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            // whether or not this errors still need to execute, cuz in case error, it will log 
            luzon.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        } else {
            // whether or not this errors still need to execute, cuz in case error, it will log 
            vismin.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        }
    } else { console.log("add: central node is down");   // central node is down, no need to check if others are down bcuz specs say only 1 can be down
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

export const deleteAppointment = (central, luzon, vismin) => (req, res) => {
    const apptId = req.params.apptid;
    const q = "DELETE FROM appointments WHERE apptid = ?"

    // // original
    // central.query(q, [apptId], (err, data) => {
    //     if (err) return res.json(err);
    //     return res.json("Succesfully deleted appoinment!");
    // })

    if (isCentralConnected()){
        central.query(q, [apptId], (err, data) => {
            if (err) return res.json(err);
            if (!(isLuzonConnected() && isVisMinConnected())){  // when other node is down, need to ensure it queries successfully to central node
                return res.json("Successfully deleted appointment!")
            }
        });
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            // whether or not this errors still need to execute, cuz in case error, it will log 
            luzon.query(q, [apptId], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully deleted appointment!")
            });
        } else {
            // whether or not this errors still need to execute, cuz in case error, it will log 
            vismin.query(q, [apptId], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully deleted appointment!")
            });
        }
    } else {    // central node is down, no need to check if others are down bcuz specs say only 1 can be down
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            luzon.query(q, [apptId], (err, data) => {
                if (err) return res.json(err);
            });
        } else {
            vismin.query(q, [apptId], (err, data) => {
                if (err) return res.json(err);
            });
        }
        // this will error, but needed for logs
        central.query(q, [apptId], (err, data) => {
            if (err) return res.json(err);
            return res.json("Successfully deleted appointment!")
        });
    }

}

export const editAppointment = (central, luzon, vismin) => (req, res) => {
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

    // // original 
    // central.query(q, [...values, apptId], (err, data) => {
    //     if (err) return res.json(err);
    //     return res.json("Succesfully edited appoinment!");
    // })

    if (isCentralConnected()){
        central.query(q, [...values, apptId], (err, data) => {
            if (err) return res.json(err);
            if (!(isLuzonConnected() && isVisMinConnected())){  // when other node is down, need to ensure it queries successfully to central node
                return res.json("Successfully edited appointment!")
            }
        });
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            // whether or not this errors still need to execute, cuz in case error, it will log 
            luzon.query(q, [...values, apptId], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully edited appointment!")
            });
        } else {
            // whether or not this errors still need to execute, cuz in case error, it will log 
            vismin.query(q, [...values, apptId], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully edited appointment!")
            });
        }
    } else {    // central node is down, no need to check if others are down bcuz specs say only 1 can be down
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            luzon.query(q, [...values, apptId], (err, data) => {
                if (err) return res.json(err);
            });
        } else {
            vismin.query(q, [...values, apptId], (err, data) => {
                if (err) return res.json(err);
            });
        }
        // this will error, but needed for logs
        central.query(q, [...values, apptId], (err, data) => {
            if (err) return res.json(err);
            return res.json("Successfully edited appointment!")
        });
    }

}
