import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';

import '../App.css';
import { PiTrashFill, PiPencilSimpleLine, PiMagnifyingGlassBold } from 'react-icons/pi';
import {
    MdFirstPage,
    MdLastPage,
    MdNavigateBefore,
    MdNavigateNext,
    MdCancel,
} from 'react-icons/md';

import Add from './Add.jsx';
import Edit from './Edit.jsx';

const AddPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="add-popup-overlay">
            <div className="popup">
                <button className="close-btn" onClick={onClose}>X</button>
                <Add />
            </div>
        </div>

    )
}

const Appointments = () => {
    const [appts, setAppts] = useState([]);
    const [activeLink, setActiveLink] = useState('view');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTriggered, setSearchTriggered] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = `http://localhost:8800/appointments?page=${page}&limit=${itemsPerPage}`;
                if (searchTerm && searchTriggered) {
                    url = `http://localhost:8800/search?searchTerm=${searchTerm}&page=${page}&limit=${itemsPerPage}`;
                }
                const res = await axios.get(url);
                setAppts(res.data.data);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [page, itemsPerPage, searchTerm, searchTriggered]);

    const handleSearch = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setSearchTriggered(true);
        }
    };

    const handleCancel = () => {
        setSearchTerm("");
        setPage(1);
        setSearchTriggered(false);
    };

    const handleDelete = async (apptid) => {
        try {
            await axios.delete("http://localhost:8800/delete/" + apptid);
            window.location.reload();
        } catch (err) {
            console.log(err)
        }
    }

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

    const toggleAddPopup = () => {
        setIsAddPopupOpen(!isAddPopupOpen);
    };

    const toggleEditPopup = () => {
        setIsEditPopupOpen(!isEditPopupOpen);
    };

    const EditPopup = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="edit-popup-overlay">
                <div className="popup">
                    <button className="close-btn" onClick={onClose}>X</button>
                    <Edit apptId={selectedAppointmentId} />
                </div>
            </div>
        );
    };

    return (
        <div className="body">

            <div className="navbar">
                <div className="navlogo">
                    <img src="/logo.png" id="logo" alt="logo" />
                </div>
                <div className="navlinks">
                    <p className={`navlink ${activeLink === 'view' ? 'active' : ''}`}>
                        <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActiveLink('view')}>View Records</Link>
                    </p>
                    <p className="navlink">
                        <Link to={`/report`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActiveLink('report')}>Generate Report</Link>
                    </p>
                </div>
            </div>

            <div className="header">
                <h3 className="subtitle">RECORD LIST</h3>
                <h1 className="title">Appointments</h1>
            </div>

            <div className="search-add">
                <div className="search-bar">
                    <PiMagnifyingGlassBold className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for an appointment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    {searchTerm && (
                        <button className="cancel-icon" onClick={handleCancel}>
                            <MdCancel />
                        </button>
                    )}
                </div>
                <div className="button">
                    <button className="add-record-btn" onClick={toggleAddPopup}>Add Record</button>
                    <AddPopup isOpen={isAddPopupOpen} onClose={toggleAddPopup} />
                </div>
            </div>

            <table className="appt-table">
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
                    {appts.map((appt) => (
                        <tr key={appt.apptid}>
                            <td>
                                <button className="edit-button" onClick={() => { setSelectedAppointmentId(appt.apptid); toggleEditPopup(); }}>
                                    <PiPencilSimpleLine />
                                </button>
                                <button className="delete-button" onClick={() => handleDelete(appt.apptid)}>
                                    <PiTrashFill />
                                </button>
                            </td>
                            <td>{appt.apptid}</td>
                            <td>{appt.hospitalname ? appt.hospitalname : '-'}</td>
                            <td>{new Date(appt.QueueDate).toLocaleDateString()}</td>
                            <td>{appt.City}</td>
                            <td>{appt.Province}</td>
                            <td>{appt.RegionName}</td>
                            <td>{appt.mainspecialty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EditPopup isOpen={isEditPopupOpen} onClose={toggleEditPopup} selectedAppointmentId={selectedAppointmentId} />

            <div className="navigate">
                <div className="navigate-content">
                    <div className="items">
                        Items per page:
                        <select id="items-per-page" onChange={handleItemsPerPageChange}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div className="pages">
                        {page} of {totalPages}
                    </div>
                    <div className="page-buttons">
                        <button
                            className="first-page-btn"
                            onClick={goToFirstPage}
                            disabled={page === 1}
                            style={{ color: page === 1 ? '#BFBFBF' : 'inherit' }}
                        >
                            <MdFirstPage />
                        </button>
                        <button
                            className="before-page-btn"
                            onClick={goToPreviousPage}
                            disabled={page === 1}
                            style={{ color: page === 1 ? '#BFBFBF' : 'inherit' }}
                        >
                            <MdNavigateBefore />
                        </button>
                        <button
                            className="next-page-btn"
                            onClick={goToNextPage}
                            disabled={page === totalPages}
                            style={{ color: page === totalPages ? '#BFBFBF' : 'inherit' }}
                        >
                            <MdNavigateNext />
                        </button>
                        <button
                            className="last-page-btn"
                            onClick={goToLastPage}
                            disabled={page === totalPages}
                            style={{ color: page === totalPages ? '#BFBFBF' : 'inherit' }}
                        >
                            <MdLastPage />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
