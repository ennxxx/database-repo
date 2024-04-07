import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import '../App.css';
import { PiPencilSimpleLine, PiMagnifyingGlassBold } from "react-icons/pi";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const Appointments = () => {
    const [appts, setAppts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchAllAppts = async () => {
            try {
                const res = await axios.get(`http://localhost:8800/central?page=${page}&limit=${itemsPerPage}`)
                setAppts(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log(err);
            }
        }
        fetchAllAppts()
    }, [page, itemsPerPage]);

    const handleItemsPerPageChange = (e) => {
        const value = parseInt(e.target.value);
        setItemsPerPage(value);
        setPage(1);
    };

    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const goToPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const goToFirstPage = () => {
        setPage(1);
    };

    const goToLastPage = () => {
        setPage(totalPages);
    };

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
                        <select id="items-per-page" onChange={handleItemsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div class="pages">
                        {page} of {totalPages}
                    </div>
                    <div class="page-buttons">
                        <button className="first-page-btn" onClick={goToFirstPage} disabled={page === 1} style={{ color: page === 1 ? '#BFBFBF' : 'inherit' }}>
                            <MdFirstPage />
                        </button>
                        <button className="before-page-btn" onClick={goToPreviousPage} disabled={page === 1} style={{ color: page === 1 ? '#BFBFBF' : 'inherit' }}>
                            <MdNavigateBefore />
                        </button>
                        <button className="next-page-btn" onClick={goToNextPage} disabled={page === totalPages} style={{ color: page === totalPages ? '#BFBFBF' : 'inherit' }}>
                            <MdNavigateNext />
                        </button>
                        <button className="last-page-btn" onClick={goToLastPage} disabled={page === totalPages} style={{ color: page === totalPages ? '#BFBFBF' : 'inherit' }}>
                            <MdLastPage />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Appointments