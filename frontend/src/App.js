import { BrowserRouter, Routes, Route } from "react-router-dom"
import Appointments from "./pages/Appointments"
import Add from "./pages/Add"
import Edit from "./pages/Edit"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Appointments />} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
