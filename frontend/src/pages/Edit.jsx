import React, { useState, useEffect } from 'react';
import '../App.css';
import axios from 'axios';

const Edit = ({ appointment }) => {
    const [appt, setAppt] = useState({ ...appointment });

    useEffect(() => {
        setAppt({ ...appointment });
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "QueueDate") {
            const formattedDateTime = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
            setAppt(prev => ({ ...prev, [name]: formattedDateTime }));
        } else {
            setAppt(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRegion = (e) => {
        setAppt(prev => ({ ...prev, RegionName: e.target.value }));
    }

    const handleUpdateRecord = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8800/central/${appt.apptid}`, appt, {
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
            <h1 className="title">Edit Appointment</h1>
            <p className="instructions">Edit the following details.</p>
            <div className="input-container">
                <label htmlFor="hospitalName">Hospital Name:</label>
                <input id="hospitalName" type="text" placeholder="Hospital Name" value={appt.hospitalname} onChange={handleChange} name="hospitalname" />
            </div>
            <div className="input-container">
                <label htmlFor="queueDate">Queue Date:</label>
                <input id="queueDate" type="datetime-local" placeholder="Queue Date" value={appt.QueueDate} onChange={handleChange} name="QueueDate" />
            </div>
            <div className="input-container">
                <label htmlFor="city">City:</label>
                <input id="city" type="text" placeholder="City" value={appt.City} onChange={handleChange} name="City" />
            </div>
            <div className="input-container">
                <label htmlFor="province">Province:</label>
                <input id="province" type="text" placeholder="Province" value={appt.Province} onChange={handleChange} name="Province" />
            </div>
            <div className="input-container">
                <label htmlFor="region">Region:</label>
                <select id="region" onChange={handleRegion} name="RegionName" value={appt.RegionName}>
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
                <input id="mainSpecialty" type="text" placeholder="Main Specialty" value={appt.mainspecialty} onChange={handleChange} name="mainspecialty" />
            </div>
            <div className="button">
                <button className="submit-btn" onClick={handleUpdateRecord}>Update</button>
            </div>
        </div>
    );
};

export default Edit;
