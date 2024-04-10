import mysql from 'mysql2';

export function handleDisconnect() {
    const central = mysql.createConnection({
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

    const luzon = mysql.createConnection({
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

    const vismin = mysql.createConnection({
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

    return { central, luzon, vismin };
}

// Function to check where does the region belong to
export function determineRegion(regionName) {
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
export function isCentralConnected(central) {
    return central && central.authorized === true;
}

// Function to check if the Luzon server is connected
export function isLuzonConnected(luzon) {
    return luzon && luzon.authorized === true;
}

// Function to check if the VisMin server is connected
export function isVisMinConnected(vismin) {
    return vismin && vismin.authorized === true;
}
