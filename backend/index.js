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

app.get("/central", (req, res) => {
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    const q = `SELECT * FROM appointments LIMIT ${limit} OFFSET ${offset}`;
    if (isCentralConnected() == false){     // cange to false to test if central node down
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
    } else { console.log("fake central node down");
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
    } // brachet for the else
    
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

    if (isCentralConnected()){
        central.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            if (!(isLuzonConnected() && isVisMinConnected())){
                return res.json("Successfully created appointment!")
            }
        });
        if (determineRegion(req.body.RegionName) == 'Luzon'){
            // weter or not tis errors still need to execute, cuz in case error, it will log 
            luzon.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        } else {
            // weter or not tis errors still need to execute, cuz in case error, it will log 
            vismin.query(q, [values], (err, data) => {
                if (err) return res.json(err);
                return res.json("Successfully created appointment!")
            });
        }
    } else {    // central node is down, no need to ceck if oters are down bcuz specs say only 1 can be down
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
        // tis will error, but needed for logs
        central.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json("Successfully created appointment!")
        });
    }
    
});

app.delete("/central/:apptid", (req, res) => {
    const apptId = req.params.apptid;
    const q = "DELETE FROM appointments WHERE apptid = ?"

    central.query(q, [apptId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Succesfully deleted appoinment!");
    })
})

app.get("/appointment", (req, res) => {
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
});

app.put("/central/:apptid", (req, res) => {
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
})

app.listen(8800, () => {
    console.log("Successfully connected!");
});

// Function to check where does the region belong to
function determineRegion(regionName) {
    const luzonRegions = [
        "Ilocos Region (I)",
        "Cagayan Valley (II)",
        "Central Luzon (III)",
        "CALABARZON (IV-A)",
        "MIMAROPA (IV-B)",
        "Bicol Region (V)",
        "Cordillera Administrative Region (CAR)", 
        "National Capital Region (NCR)" 
    ];
    const visminRegions = [
        "Western Visayas (VI)",
        "Central Visayas (VII)",
        "Eastern Visayas (VIII)",
        "Zamboanga Peninsula (IX)",
        "Northern Mindanao (X)",
        "Davao Region (XI)",
        "SOCCSKSARGEN (Cotabato Region) (XII)",
        "Caraga (XIII)",
        "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)" 
    ];

    if (luzonRegions.includes(regionName)) {
        return "Luzon";
    } else if (visminRegions.includes(regionName)) {
        return "VisMin"
    } else {
        return "Unknown";
    }
}

// Function to check if the central server is connected
function isCentralConnected() {
    return central && central.authorized === true;
}

// Function to check if the Luzon server is connected
function isLuzonConnected() {
    return luzon && luzon.authorized === true;
}

// Function to check if the VisMin server is connected
function isVisMinConnected() {
    return vismin && vismin.authorized === true;
}
