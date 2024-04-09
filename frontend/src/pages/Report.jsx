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

    const [luzonRegions, setLuzonRegions] = useState([]);
    const [luzonProvinces, setLuzonProvinces] = useState([]);
    const [luzonCities, setLuzonCities] = useState([]);

    const [visayasRegions, setVisayasRegions] = useState([]);
    const [visayasProvinces, setVisayasProvinces] = useState([]);
    const [visayasCities, setVisayasCities] = useState([]);

    const [mindanaoRegions, setMindanaoRegions] = useState([]);
    const [mindanaoProvinces, setMindanaoProvinces] = useState([]);
    const [mindanaoCities, setMindanaoCities] = useState([]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        fetchTotalAppointments(value);
    };

    const fetchTotalAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:8800/total-appointments?tab=Overall`);
            setTotalAppts(response.data.totalCount.toLocaleString());

            const luzonResponse = await axios.get(`http://localhost:8800/total-appointments?tab=Luzon`);
            setLuzonTotal(luzonResponse.data.totalCount.toLocaleString());

            const visayasResponse = await axios.get(`http://localhost:8800/total-appointments?tab=Visayas`);
            setVisayasTotal(visayasResponse.data.totalCount.toLocaleString());

            const mindanaoResponse = await axios.get(`http://localhost:8800/total-appointments?tab=Mindanao`);
            setMindanaoTotal(mindanaoResponse.data.totalCount.toLocaleString());
        } catch (error) {
            console.error('Error fetching total appointments:', error);
        }
    };

    const fetchLuzonRegionAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/luzon-regions');
            setLuzonRegions(response.data.map(region => ({
                ...region,
                totalCount: region.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Luzon regions:', error);
        }
    };

    const fetchLuzonProvinceAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/luzon-provinces');
            setLuzonProvinces(response.data.map(province => ({
                ...province,
                totalCount: province.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Luzon provinces:', error);
        }
    };

    const fetchLuzonCityAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/luzon-cities');
            setLuzonCities(response.data.map(city => ({
                ...city,
                totalCount: city.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Luzon cities:', error);
        }
    };

    const fetchVisayasRegionAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/visayas-regions');
            setVisayasRegions(response.data.map(region => ({
                ...region,
                totalCount: region.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Visayas regions:', error);
        }
    };

    const fetchVisayasProvinceAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/visayas-provinces');
            setVisayasProvinces(response.data.map(province => ({
                ...province,
                totalCount: province.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Visayas provinces:', error);
        }
    };

    const fetchVisayasCityAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/visayas-cities');
            setVisayasCities(response.data.map(city => ({
                ...city,
                totalCount: city.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Visayas cities:', error);
        }
    };

    const fetchMindanaoRegionAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/mindanao-regions');
            setMindanaoRegions(response.data.map(region => ({
                ...region,
                totalCount: region.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Mindanao regions:', error);
        }
    };

    const fetchMindanaoProvinceAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/mindanao-provinces');
            setMindanaoProvinces(response.data.map(province => ({
                ...province,
                totalCount: province.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Mindanao provinces:', error);
        }
    };

    const fetchMindanaoCityAppts = async () => {
        try {
            const response = await axios.get('http://localhost:8800/mindanao-cities');
            setMindanaoCities(response.data.map(city => ({
                ...city,
                totalCount: city.totalCount.toLocaleString()
            })));
        } catch (error) {
            console.error('Error fetching Mindanao cities:', error);
        }
    };

    useEffect(() => {
        fetchTotalAppointments();
        fetchLuzonRegionAppts();
        fetchLuzonProvinceAppts();
        fetchLuzonCityAppts();
        fetchVisayasRegionAppts();
        fetchVisayasProvinceAppts();
        fetchVisayasCityAppts();
        fetchMindanaoRegionAppts();
        fetchMindanaoProvinceAppts();
        fetchMindanaoCityAppts();
    }, []);

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

                <div className="appt-card" style={{ backgroundColor: activeTab === 'Overall' ? '#BFBFBF' : '#0B9F94' }}>
                    {activeTab !== 'Overall' && <p className="card-title">Highest per Region</p>}
                    <p className="card-num" id="region">
                        {activeTab === 'Luzon' ? luzonRegions[0].totalCount :
                            activeTab === 'Visayas' ? visayasRegions[0].totalCount :
                                activeTab === 'Mindanao' ? mindanaoRegions[0].totalCount : null}
                    </p>
                    <p className="card-text">
                        {activeTab === 'Luzon' ? luzonRegions[0].RegionName :
                            activeTab === 'Visayas' ? visayasRegions[0].RegionName :
                                activeTab === 'Mindanao' ? mindanaoRegions[0].RegionName : null}
                    </p>
                </div>

                <div className="appt-card" style={{ backgroundColor: activeTab === 'Overall' ? '#BFBFBF' : '#0B9F94' }}>
                    {activeTab !== 'Overall' && <p className="card-title">Highest per Province</p>}
                    <p className="card-num" id="province">
                        {activeTab === 'Luzon' ? luzonProvinces[0].totalCount :
                            activeTab === 'Visayas' ? visayasProvinces[0].totalCount :
                                activeTab === 'Mindanao' ? mindanaoProvinces[0].totalCount : null}
                    </p>
                    <p className="card-text">
                        {activeTab === 'Luzon' ? luzonProvinces[0].Province :
                            activeTab === 'Visayas' ? visayasProvinces[0].Province :
                                activeTab === 'Mindanao' ? mindanaoProvinces[0].totalCount : null}
                    </p>
                </div>

                <div className="appt-card" style={{ backgroundColor: activeTab === 'Overall' ? '#BFBFBF' : '#0B9F94' }}>
                    {activeTab !== 'Overall' && <p className="card-title">Highest per City</p>}
                    <p className="card-num" id="city">
                        {activeTab === 'Luzon' ? luzonCities[0].totalCount :
                            activeTab === 'Visayas' ? visayasCities[0].totalCount :
                                activeTab === 'Mindanao' ? mindanaoCities[0].totalCount : null}
                    </p>
                    <p className="card-text">
                        {activeTab === 'Luzon' ? luzonCities[0].City :
                            activeTab === 'Visayas' ? visayasCities[0].City :
                                activeTab === 'Mindanao' ? mindanaoCities[0].City : null}
                    </p>
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
                            <div className="table-info">
                                <h2>Appointments per Region</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {luzonRegions.map(region => (
                                            <tr key={region.RegionName}>
                                                <td className="table-location">{region.RegionName}</td>
                                                <td className="table-num-appts">{region.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per Province</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {luzonProvinces.map(province => (
                                            <tr key={province.Province}>
                                                <td className="table-location">{province.Province}</td>
                                                <td className="table-num-appts">{province.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per City</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {luzonCities.map(city => (
                                            <tr key={city.City}>
                                                <td className="table-location">{city.City}</td>
                                                <td className="table-num-appts">{city.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="Visayas" >
                            <div className="table-info">
                                <h2>Appointments per Region</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {visayasRegions.map(region => (
                                            <tr key={region.RegionName}>
                                                <td className="table-location">{region.RegionName}</td>
                                                <td className="table-num-appts">{region.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per Province</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {visayasProvinces.map(province => (
                                            <tr key={province.Province}>
                                                <td className="table-location">{province.Province}</td>
                                                <td className="table-num-appts">{province.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per City</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {visayasCities.map(city => (
                                            <tr key={city.City}>
                                                <td className="table-location">{city.City}</td>
                                                <td className="table-num-appts">{city.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="Mindanao" >
                            <div className="table-info">
                                <h2>Appointments per Region</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {mindanaoRegions.map(region => (
                                            <tr key={region.RegionName}>
                                                <td className="table-location">{region.RegionName}</td>
                                                <td className="table-num-appts">{region.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per Province</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {mindanaoProvinces.map(province => (
                                            <tr key={province.Province}>
                                                <td className="table-location">{province.Province}</td>
                                                <td className="table-num-appts">{province.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <hr className="line" />
                            <div className="table-info">
                                <h2>Appointments per City</h2>
                                <table className="table-summary">
                                    <tbody>
                                        {mindanaoCities.map(city => (
                                            <tr key={city.City}>
                                                <td className="table-location">{city.City}</td>
                                                <td className="table-num-appts">{city.totalCount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Tabs.Panel>
                    </Tabs>
                </div>

            </MantineProvider>

        </div >
    );
};

export default Report;