import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Helmet } from 'react-helmet';
import Appointments from "./pages/Appointments"
import Report from "./pages/Report"
import Add from "./pages/Add"
import Edit from "./pages/Edit"

import '@mantine/core/styles.css';

function App() {
  return (
    <div className="App">
      <Helmet>
        <link rel="icon" href="/favicon.ico" />
        <title> Appointments</title>
      </Helmet>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Appointments />} />
          <Route path="/report" element={<Report />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:apptid" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
