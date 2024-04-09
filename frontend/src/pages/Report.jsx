import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { MantineProvider, Tabs } from '@mantine/core';

import '../App.css';

const Report = () => {

    const [activeLink, setActiveLink] = useState('report');

    return (
        <div className="body">
            <div className="navbar">
                <div className="navlogo">
                    <img src="/logo.png" id="logo" alt="logo" />
                </div>
                <div className="navlinks">
                    <p className="navlink">
                        <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActiveLink('view')}>View Records</Link>
                    </p>
                    <p className={`navlink ${activeLink === 'report' ? 'active' : ''}`}>
                        <Link to={`/report`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setActiveLink('report')}>Generate Report</Link>
                    </p>
                </div>
            </div>

            <div className="header">
                <h3 className="subtitle">SUMMARY REPORT</h3>
                <h1 className="title">Appointments</h1>
            </div>

            <div className="appt-cards">
                <div className="appt-card">
                    <p className="card-title">Total Appointments</p>
                    <p className="card-num" id="total">268,143</p>
                    <p className="card-text">Luzon</p>
                </div>
                <div className="appt-card">
                    <p className="card-title">Highest per Region</p>
                    <p className="card-num" id="region">123,382</p>
                    <p className="card-text">National Capital Region (NCR)</p>
                </div>
                <div className="appt-card">
                    <p className="card-title">Highest per Province</p>
                    <p className="card-num" id="province">58,234</p>
                    <p className="card-text">Manila</p>
                </div>
                <div className="appt-card">
                    <p className="card-title">Highest per City</p>
                    <p className="card-num" id="city">23,072</p>
                    <p className="card-text">Muntinlupa</p>
                </div>
            </div>

            <MantineProvider>
                <div className="summary-report">
                    <Tabs variant="pills" color="rgba(98, 104, 240, 1)" radius="md" defaultValue="summary">
                        <Tabs.List>
                            <Tabs.Tab value="summary">
                                <p className="island-tabs">Summary</p>
                            </Tabs.Tab>
                            <Tabs.Tab value="luzon">
                                <p className="island-tabs">Luzon</p>
                            </Tabs.Tab>
                            <Tabs.Tab value="visayas">
                                <p className="island-tabs">Visayas</p>
                            </Tabs.Tab>
                            <Tabs.Tab size="{14}" value="mindanao">
                                <p className="island-tabs">Mindanao</p>
                            </Tabs.Tab>
                        </Tabs.List>

                        <hr className="line" />

                        <Tabs.Panel value="summary" >
                            <div className="table-info">
                                <h3>Total Number of Appointments</h3>
                                <table className="table-summary">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Luzon</td>
                                            <td>200,000</td>
                                        </tr>
                                        <tr>
                                            <td>Visayas</td>
                                            <td>200,000</td>
                                        </tr>
                                        <tr>
                                            <td>Mindanao</td>
                                            <td>200,000</td>
                                        </tr>
                                        <tr>
                                            <td>Total</td>
                                            <td>200,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="luzon" >
                            Luzon
                        </Tabs.Panel>

                        <Tabs.Panel value="visayas" >
                            Visayas
                        </Tabs.Panel>

                        <Tabs.Panel value="mindanao" >
                            Mindanao
                        </Tabs.Panel>
                    </Tabs>
                </div>

            </MantineProvider>

        </div >
    );
};

export default Report;