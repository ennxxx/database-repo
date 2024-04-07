import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../App.css';
import { PiPencilSimpleLine, PiMagnifyingGlassBold } from "react-icons/pi";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const Appointments = () => {
    const [appts, setAppts] = useState([])

    useEffect(() => {
        const fetchAllAppts = async () => {
            try {
                const res = await axios.get("http://localhost:8800/central")
                setAppts(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllAppts()
    }, [])

    return (
        <div class="body">

            <img src="/logo.png" id="logo"></img>


            <div class="header">
                <h3 id="subtitle">RECORD LIST</h3>
                <h1 id="title">Appointments</h1>
            </div>

            <div class="search-add">
                <div class="search-bar">
                    <input type="text" placeholder="Search for an appointment..." />
                    <PiMagnifyingGlassBold class="search-icon" />
                </div>
                <div class="button">
                    <button class="add-record-btn">
                        Add Record
                    </button>
                </div>
            </div>

            <table class="appt-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Appointment ID</th>
                        <th>Hospital Name</th>
                        <th>Queue Date</th>
                        <th>City</th>
                        <th>Province</th>
                        <th>Region</th>
                        <th>Main Specialty</th>
                    </tr>
                </thead>
                <tbody>
                    {appts.map(appt => (
                        <tr key={appt.apptid}>
                            <td>
                                <button class="edit-button">
                                    <PiPencilSimpleLine />
                                </button>
                            </td>
                            <td>{appt.apptid}</td>
                            <td>{appt.hospitalname ? appt.hospitalname : "-"}</td>
                            <td>{new Date(appt.QueueDate).toLocaleDateString()}</td>
                            <td>{appt.City}</td>
                            <td>{appt.Province}</td>
                            <td>{appt.RegionName}</td>
                            <td>{appt.mainspecialty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div class="navigate">
                <div class="navigate-content">
                    <div class="items">
                        Items per page:
                        <select id="items-per-page">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div class="pages">
                        1 of 300
                    </div>
                    <div class="buttons">
                        <button class="first-page-btn">
                            <MdFirstPage />
                        </button>
                        <button class="before-page-btn">
                            <MdNavigateBefore />
                        </button>
                        <button class="next-page-btn">
                            <MdNavigateNext />
                        </button>
                        <button class="last-page-btn">
                            <MdLastPage />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Appointments