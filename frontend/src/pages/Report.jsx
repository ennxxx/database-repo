import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { MantineProvider, Tabs } from '@mantine/core';
import axios from 'axios';

import '../App.css';

const Report = () => {

    const [activeLink, setActiveLink] = useState('report');
    const [activeTab, setActiveTab] = useState('Overall');
    const [totalAppts, setTotalAppts] = useState(null);
    const [luzonTotal, setLuzonTotal] = useState(null);
    const [visayasTotal, setVisayasTotal] = useState(null);
    const [mindanaoTotal, setMindanaoTotal] = useState(null);

    const handleTabChange = (value) => {
        setActiveTab(value);
        fetchTotalAppointments(value);
    };

    const fetchTotalAppointments = async (tab) => {
        try {
            const response = await axios.get(`http://localhost:8800/total-appointments?tab=${tab}`);
            switch (tab) {
                case 'Overall':
                    setTotalAppts(response.data.totalCount.toLocaleString());
                    break;
                case 'Luzon':
                    setLuzonTotal(response.data.totalCount.toLocaleString());
                    break;
                case 'Visayas':
                    setVisayasTotal(response.data.totalCount.toLocaleString());
                    break;
                case 'Mindanao':
                    setMindanaoTotal(response.data.totalCount.toLocaleString());
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching total appointments:', error);
        }
    }

    const overall_total = fetchTotalAppointments("Overall");
    const luzon_total = fetchTotalAppointments("Luzon");
    const visayas_total = fetchTotalAppointments("Visayas");
    const mindanao_total = fetchTotalAppointments("Mindanao");

    useEffect(() => {
        fetchTotalAppointments(activeTab);
    }, [activeTab]);

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
                    <p className="card-num" id="total">
                        {activeTab === 'Overall' ? totalAppts :
                            activeTab === 'Luzon' ? luzonTotal :
                                activeTab === 'Visayas' ? visayasTotal :
                                    activeTab === 'Mindanao' ? mindanaoTotal : null}
                    </p>
                    <p className="card-text">{activeTab}</p>
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
                    <Tabs variant="pills" color="rgba(98, 104, 240, 1)" radius="md" defaultValue="Overall" value={activeTab} onChange={handleTabChange}>
                        <Tabs.List>
                            <Tabs.Tab value="Overall">
                                <p className="island-tabs">Summary</p>
                            </Tabs.Tab>
                            <Tabs.Tab value="Luzon">
                                <p className="island-tabs">Luzon</p>
                            </Tabs.Tab>
                            <Tabs.Tab value="Visayas">
                                <p className="island-tabs">Visayas</p>
                            </Tabs.Tab>
                            <Tabs.Tab value="Mindanao">
                                <p className="island-tabs">Mindanao</p>
                            </Tabs.Tab>
                        </Tabs.List>

                        <hr className="line" />

                        <Tabs.Panel value="Overall" >
                            <div className="table-info">
                                <h2>Total Number of Appointments</h2>
                                <table className="table-summary">
                                    <tbody>
                                        <tr>
                                            <td className="table-location">Luzon</td>
                                            <td className="table-num-appts">{luzonTotal}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-location">Visayas</td>
                                            <td className="table-num-appts">{visayasTotal}</td>
                                        </tr>
                                        <tr>
                                            <td className="table-location">Mindanao</td>
                                            <td className="table-num-appts">{mindanaoTotal}</td>
                                        </tr>
                                        <tr className="table-total">
                                            <td>Total</td>
                                            <td className="table-num-appts">{totalAppts}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="Luzon" >

                        </Tabs.Panel>

                        <Tabs.Panel value="Visayas" >

                        </Tabs.Panel>

                        <Tabs.Panel value="Mindanao" >

                        </Tabs.Panel>
                    </Tabs>
                </div>

            </MantineProvider>

        </div >
    );
};

export default Report;