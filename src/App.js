import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IAQ from "./components/IAQ"
import MainAnalytics from "./components/Historical";
import Dashboard from "./components/Dashboard";
import Gym from "./components/Gym";
import Concierge from "./components/Concierge";
import FloorPlan from "./components/FloorPlan";
import AccessRole from "./components/user";
import DeviceManagement from "./components/DeviceMangement";





const App = () => {
  return (
    <BrowserRouter>
      <Routes>
 
     
        <Route path="/" element={<IAQ />} />
        <Route path="/iaq" element={<IAQ />} />
        <Route path="/historical" element={<MainAnalytics />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/concierge" element={<Concierge />} />
        <Route path="/floorplan" element={<FloorPlan />} />
        <Route path="/roles" element={<AccessRole />} />
        <Route path="/devices" element={<DeviceManagement />} />
        
        

    
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;