import express from 'express';

export const getAllAppointments = (central) => (req, res) => {
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
}

export const searchAppointments = (central) => (req, res) => {
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
}

export const getSingleAppointment = (central) => (req, res) => {
    const { appointmentID } = req.query;
    const q = `SELECT * FROM appointments WHERE apptid LIKE '%${appointmentID}%'`;
    central.query(q, (err, data) => {
        if (err) return res.json(err);
        if (data.length > 0) {
            const appointmentData = data[0];
            return res.json(appointmentData);
        } else {
            return res.json({});
        }
    });
}

export const getTotalAppointments = (central) => (req, res) => {
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
}