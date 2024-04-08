import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

function generateUniqueID(existingIDs, length) {
    let id = generateRandomID(length);
    while (existingIDs.has(id)) {
        id = generateRandomID(length);
    }
    return id;
}

const Add = () => {

    const [appt, setAppt] = useState({
        apptid: generateUniqueID(new Set(), 33),
        clinicid: generateUniqueID(new Set(), 33),
        doctorid: generateUniqueID(new Set(), 33),
        pxid: generateUniqueID(new Set(), 33),
        hospitalname: "",
        QueueDate: "",
        City: "",
        Province: "",
        RegionName: "",
        mainspecialty: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "QueueDate") {
            const formattedDate = new Date(value).toISOString().slice(0, 10);
            setAppt(prev => ({ ...prev, [name]: formattedDate }));
        } else {
            setAppt(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRegion = (e) => {
        setAppt(prev => ({ ...prev, RegionName: e.target.value }));
    }

    const handleAddRecord = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8800/central`, appt, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="add-record-form">

            <h1 className="title">Book Appointment</h1>
            <p className="instructions">Fill up the following details.</p>

            <div className="input-container">
                <label htmlFor="hospitalName">Hospital Name:</label>
                <input id="hospitalName" type="text" placeholder="Hospital Name" onChange={handleChange} name="hospitalname" />
            </div>
            <div className="input-container">
                <label htmlFor="queueDate">Queue Date:</label>
                <input id="queueDate" type="date" placeholder="Queue Date" onChange={handleChange} name="QueueDate" />
            </div>
            <div className="input-container">
                <label htmlFor="city">City:</label>
                <input id="city" type="text" placeholder="City" onChange={handleChange} name="City" />
            </div>
            <div className="input-container">
                <label htmlFor="province">Province:</label>
                <input id="province" type="text" placeholder="Province" onChange={handleChange} name="Province" />
            </div>
            <div className="input-container">
                <label htmlFor="region">Region:</label>
                <select id="region" onChange={handleRegion} name="RegionName" >
                    <option value="" disabled selected>Region</option>
                    <option value="National Capital Region (NCR)">National Capital Region (NCR)</option>
                    <option value="Central Visayas (VII)">Central Visayas (VII)</option>
                    <option value="SOCCSKSARGEN (Cotabato Region) (XII)">SOCCSKSARGEN (Cotabato Region) (XII)</option>
                    <option value="CALABARZON (IV-A)">CALABARZON (IV-A)</option>
                    <option value="Northern Mindanao (X)">Northern Mindanao (X)</option>
                    <option value="IIlocos Region (I)">Ilocos Region (I)</option>
                    <option value="Bicol Region (V)">Bicol Region (V)</option>
                    <option value="Eastern Visayas (VIII)">Eastern Visayas (VIII)</option>
                    <option value="Western Visayas (VI)">Western Visayas (VI)</option>
                    <option value="Central Luzon (III)">Central Luzon (III)</option>
                </select>
            </div>
            <div className="input-container">
                <label htmlFor="mainSpecialty">Main Specialty:</label>
                <input id="mainSpecialty" type="text" placeholder="Main Specialty" onChange={handleChange} name="mainspecialty" />
            </div>

            <div className="button">
                <button className="submit-btn" onClick={handleAddRecord}>Submit</button>
            </div>


        </div >
    );
};

export default Add;
