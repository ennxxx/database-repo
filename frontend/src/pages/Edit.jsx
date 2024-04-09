import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';

const Edit = ({ apptId }) => {

    const [appt, setAppt] = useState({
        apptid: "",
        clinicid: "",
        doctorid: "",
        pxid: "",
        hospitalname: "",
        QueueDate: "",
        City: "",
        Province: "",
        RegionName: "",
        mainspecialty: ""
    });

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/appointment?appointmentID=` + apptId);
                let appointmentData = res.data;
                const date = new Date(appointmentData.QueueDate);
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                const formattedDate = localDate.toISOString().slice(0, 10);
                appointmentData = { ...appointmentData, QueueDate: formattedDate };
                setAppt(appointmentData);
            } catch (error) {
                console.error('Error fetching appointment data:', error);
            }
        };
        fetchAppointmentData();
    }, [apptId]);

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

    const handleEditRecord = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8800/central/` + apptId, appt, {
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
        <div className="record-form">

            <h1 className="title">Edit Appointment</h1>
            <p className="instructions">Edit the following details.</p>

            <div className="input-container">
                <label htmlFor="hospitalName">Hospital Name:</label>
                <input id="hospitalName" type="text" placeholder={appt.hospitalname} onChange={handleChange} name="hospitalname" />
            </div>
            <div className="input-container">
                <label htmlFor="queueDate">Queue Date:</label>
                <input id="queueDate" type="date" value={appt.QueueDate} onChange={handleChange} name="QueueDate" />
            </div>
            <div className="input-container">
                <label htmlFor="city">City:</label>
                <input id="city" type="text" placeholder={appt.City} onChange={handleChange} name="City" />
            </div>
            <div className="input-container">
                <label htmlFor="province">Province:</label>
                <input id="province" type="text" placeholder={appt.Province} onChange={handleChange} name="Province" />
            </div>
            <div className="input-container">
                <label htmlFor="region">Region:</label>
                <select id="region" onChange={handleRegion} name="RegionName" >
                    <option value="" disable selected>{appt.RegionName}</option>
                    <option value="IIlocos Region (I)">Ilocos Region (I)</option>
                    <option value="Cagayan Valley (II)">Cagayan Valley (II)</option>
                    <option value="Central Luzon (III)">Central Luzon (III)</option>
                    <option value="CALABARZON (IV-A)">CALABARZON (IV-A)</option>
                    <option value="MIMAROPA (IV-B)">MIMAROPA (IV-B)</option>
                    <option value="Bicol Region (V)">Bicol Region (V)</option>
                    <option value="Western Visayas (VI)">Western Visayas (VI)</option>
                    <option value="Central Visayas (VII)">Central Visayas (VII)</option>
                    <option value="Eastern Visayas (VIII)">Eastern Visayas (VIII)</option>
                    <option value="Zamboanga Peninsula (IX)">Zamboanga Peninsula (IX)</option>
                    <option value="Northern Mindanao (X)">Northern Mindanao (X)</option>
                    <option value="Davao Region (XI)">Davao Region (XI)</option>
                    <option value="SOCCSKSARGEN (Cotabato Region) (XII)">SOCCSKSARGEN (Cotabato Region) (XII)</option>
                    <option value="Caraga (XIII)">Caraga (XIII)</option>
                    <option value="National Capital Region (NCR)">National Capital Region (NCR)</option>
                    <option value="Cordillera Administrative Region (CAR)">Cordillera Administrative Region (CAR)</option>
                    <option value="Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)">Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)</option>
                </select>
            </div>
            <div className="input-container">
                <label htmlFor="mainSpecialty">Main Specialty:</label>
                <input id="mainSpecialty" type="text" placeholder={appt.mainspecialty} onChange={handleChange} name="mainspecialty" />
            </div>

            <div className="button">
                <button className="submit-btn" onClick={handleEditRecord}>Update</button>
            </div>

        </div >
    );
};

export default Edit;
