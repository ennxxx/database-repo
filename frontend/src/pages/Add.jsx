import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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
            const formattedDateTime = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
            setAppt(prev => ({ ...prev, [name]: formattedDateTime }));
        } else {
            setAppt(prev => ({ ...prev, [name]: value }));
        }
    };

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
                <input id="queueDate" type="datetime-local" placeholder="Queue Date" onChange={handleChange} name="QueueDate" required />
            </div>
            <div className="input-container">
                <label htmlFor="city">City:</label>
                <input id="city" type="text" placeholder="City" onChange={handleChange} name="City" required />
            </div>
            <div className="input-container">
                <label htmlFor="province">Province:</label>
                <input id="province" type="text" placeholder="Province" onChange={handleChange} name="Province" required />
            </div>
            <div className="input-container">
                <label htmlFor="region">Region:</label>
                <input id="region" type="text" placeholder="Region" onChange={handleChange} name="RegionName" required />
            </div>
            <div className="input-container">
                <label htmlFor="mainSpecialty">Main Specialty:</label>
                <input id="mainSpecialty" type="text" placeholder="Main Specialty" onChange={handleChange} name="mainspecialty" required />
            </div>

            <div className="button">
                <button className="submit-btn" onClick={handleAddRecord}>Submit</button>
            </div>


        </div>
    );
};

export default Add;
