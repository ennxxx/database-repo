import express from 'express';
import { isCentralConnected } from '../helpers.js';

export const getAllAppointments = (central, luzon, vismin) => (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM appointments LIMIT ${limit} OFFSET ${offset}`;
    if (isCentralConnected()){  // remove central to simulate central node down
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
    } else { console.log("getAll: central node is down");
        let dataL, dataVM, totalCountL, totalCountVM;
        const offset = (page - 1) * (limit/2);
        const q2 = `SELECT * FROM appointments LIMIT ${limit/2} OFFSET ${offset}`;
        // Query appointments from Luzon
        luzon.query(q2, (err, resultL) => {
            if (err) return res.json(err);

            dataL = resultL;
            const countQuery = "SELECT COUNT(*) AS totalCount FROM appointments";
            luzon.query(countQuery, (err, countData) => {
                if (err) return res.json(err);
                totalCountL = countData[0].totalCount;
                checkAndRespond();
            });
        });

        // Query appointments from VisMin
        vismin.query(q2, (err, resultVM) => {
            if (err) return res.json(err);

            dataVM = resultVM;
            const countQuery = "SELECT COUNT(*) AS totalCount FROM appointments";
            vismin.query(countQuery, (err, countData) => {
                if (err) return res.json(err);
                totalCountVM = countData[0].totalCount;
                checkAndRespond();
            });
        });

        // Function to check if all queries are completed and then respond
        function checkAndRespond() {
            if (dataL && dataVM && totalCountL && totalCountVM) {
                const data = [...dataL, ...dataVM];
                console.log("total counts: ", totalCountL, totalCountVM)
                const totalPages = Math.ceil((totalCountL + totalCountVM) / limit);
                return res.json({ data, totalPages });
            }
        }
    }
    
}

export const searchAppointments = (central, luzon, vismin) => (req, res) => {
    const { searchTerm, page, limit } = req.query;
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%' LIMIT ${limit} OFFSET ${offset}`;
    if (isCentralConnected(central)){   // remove central to simulate central node down
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
    } else { console.log("search: central node is down");
        let dataL, dataVM, totalCountL, totalCountVM;
        const offset = (page - 1) * (limit/2);
        const q2 = `SELECT * FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%' LIMIT ${limit} OFFSET ${offset}`;
        // Query appointments from Luzon
        luzon.query(q2, (err, resultL) => {
            if (err) return res.json(err);

            dataL = resultL;
            const countQuery = `SELECT COUNT(*) AS totalCount FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%'`;
            luzon.query(countQuery, (err, countData) => {
                if (err) return res.json(err);
                totalCountL = countData[0].totalCount;
                checkAndRespond();
            });
        });

        // Query appointments from VisMin
        vismin.query(q2, (err, resultVM) => {
            if (err) return res.json(err);

            dataVM = resultVM;
            const countQuery = `SELECT COUNT(*) AS totalCount FROM appointments WHERE apptid LIKE '%${searchTerm}%' OR hospitalname LIKE '%${searchTerm}%' OR QueueDate LIKE '%${searchTerm}%' OR City LIKE '%${searchTerm}%' OR Province LIKE '%${searchTerm}%' OR RegionName LIKE '%${searchTerm}%' OR mainspecialty LIKE '%${searchTerm}%'`;
            vismin.query(countQuery, (err, countData) => {
                if (err) return res.json(err);
                totalCountVM = countData[0].totalCount;
                checkAndRespond();
            });
        });

        // Function to check if all queries are completed and then respond
        function checkAndRespond() {
            if (dataL && dataVM && totalCountL && totalCountVM) {
                const data = [...dataL, ...dataVM];
                console.log("total counts: ", totalCountL, totalCountVM)
                const totalPages = Math.ceil((totalCountL + totalCountVM) / limit);
                return res.json({ data, totalPages });
            }
        }

    }
    
}

export const getSingleAppointment = (central, luzon, vismin) => (req, res) => {
    const { appointmentID } = req.query;
    const q = `SELECT * FROM appointments WHERE apptid LIKE '%${appointmentID}%'`;
    if (isCentralConnected()) {
        central.query(q, (err, data) => {
            if (err) return res.json(err);
            if (data.length > 0) {
                const appointmentData = data[0];
                return res.json(appointmentData);
            } else {
                return res.json({});
            }
        });
    } else {
        luzon.query(q, (err, data) => {
            if (err) return res.json(err);
            if (data.length > 0) {
                const appointmentData = data[0];
                return res.json(appointmentData);
            } else {
                vismin.query(q, (err, data) => {
                    if (err) return res.json(err);
                    if (data.length > 0) {
                        const appointmentData = data[0];
                        return res.json(appointmentData);
                    } else {
                        return res.json({});
                    }
                });
            }
        });
    }

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

export const getLuzonRegions = (central) => (req, res) => {
    const q = `
        SELECT 
            RegionName,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Ilocos Region (I)', 
                'Cagayan Valley (II)', 
                'Central Luzon (III)', 
                'CALABARZON (IV-A)', 
                'MIMAROPA (IV-B)', 
                'Bicol Region (V)', 
                'National Capital Region (NCR)', 
                'Cordillera Administrative Region (CAR)'
            )
        GROUP BY 
            RegionName
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getLuzonProvinces = (central) => (req, res) => {
    const q = `
        SELECT 
            Province,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Ilocos Region (I)', 
                'Cagayan Valley (II)', 
                'Central Luzon (III)', 
                'CALABARZON (IV-A)', 
                'MIMAROPA (IV-B)', 
                'Bicol Region (V)', 
                'National Capital Region (NCR)', 
                'Cordillera Administrative Region (CAR)'
            )
        GROUP BY 
            Province
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getLuzonCities = (central) => (req, res) => {
    const q = `
        SELECT 
            City,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Ilocos Region (I)', 
                'Cagayan Valley (II)', 
                'Central Luzon (III)', 
                'CALABARZON (IV-A)', 
                'MIMAROPA (IV-B)', 
                'Bicol Region (V)', 
                'National Capital Region (NCR)', 
                'Cordillera Administrative Region (CAR)'
            )
        GROUP BY 
            City
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getVisayasRegions = (central) => (req, res) => {
    const q = `
        SELECT 
            RegionName,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Western Visayas (VI)', 
                'Central Visayas (VII)', 
                'Eastern Visayas (VIII)' 
            )
        GROUP BY 
            RegionName
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getVisayasProvinces = (central) => (req, res) => {
    const q = `
        SELECT 
            Province,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Western Visayas (VI)', 
                'Central Visayas (VII)', 
                'Eastern Visayas (VIII)' 
            )
        GROUP BY 
            Province
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getVisayasCities = (central) => (req, res) => {
    const q = `
        SELECT 
            City,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Western Visayas (VI)', 
                'Central Visayas (VII)', 
                'Eastern Visayas (VIII)' 
            )
        GROUP BY 
            City
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getMindanaoRegions = (central) => (req, res) => {
    const q = `
        SELECT 
            RegionName,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Zamboanga Peninsula (IX)', 
                'Northern Mindanao (X)', 
                'Davao Region (XI)', 
                'SOCCSKSARGEN (Cotabato Region) (XII)', 
                'Caraga (XIII)', 
                'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)' 
            )
        GROUP BY 
            RegionName
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getMindanaoProvinces = (central) => (req, res) => {
    const q = `
        SELECT 
            Province,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Zamboanga Peninsula (IX)', 
                'Northern Mindanao (X)', 
                'Davao Region (XI)', 
                'SOCCSKSARGEN (Cotabato Region) (XII)', 
                'Caraga (XIII)', 
                'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
            )
        GROUP BY 
            Province
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};

export const getMindanaoCities = (central) => (req, res) => {
    const q = `
        SELECT 
            City,
            COUNT(*) AS totalCount
        FROM 
            appointments 
        WHERE 
            RegionName IN (
                'Zamboanga Peninsula (IX)', 
                'Northern Mindanao (X)', 
                'Davao Region (XI)', 
                'SOCCSKSARGEN (Cotabato Region) (XII)', 
                'Caraga (XIII)', 
                'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)' 
            )
        GROUP BY 
            City
    `;

    central.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
};