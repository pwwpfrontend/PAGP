import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; 
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function Gym() {
  const initialFacilities = [
    { id: 1, name: 'Adjustable Bench 1', inUse: false },
    { id: 2, name: 'Adjustable Bench 2', inUse: false },
    { id: 3, name: 'Dual Cable Cross', inUse: false },
    { id: 4, name: 'Elliptical Trainer', inUse: false },
    { id: 5, name: 'Heat Performance Row', inUse: false },
    { id: 6, name: 'Lat Pull Down', inUse: false },
    { id: 7, name: 'Power Rack', inUse: true },
    { id: 8, name: 'Power Rack', inUse: false },
    { id: 9, name: 'Flat Bench', inUse: false },
    { id: 10, name: 'Spin Bike 1', inUse: true },
    { id: 11, name: 'Adjustable Bench 2', inUse: false },
    { id: 12, name: 'Station Combo', inUse: false },
    { id: 13, name: 'Power Rack', inUse: false },
  ];

  const [facilities, setFacilities] = useState(initialFacilities);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {

      setFacilities(prevFacilities =>
        prevFacilities.map(f => ({
          ...f,
          inUse: Math.random() > 0.75,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const inUseCount = facilities.filter(f => f.inUse).length;

  return (
    <div className="min-h-screen bg-gray-100 pt-20" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Header */}
      <header className="bg-[#fbfbfb] h-16 lg:h-20 fixed top-0 left-0 w-full z-10 flex items-center justify-between shadow-lg">
        <div className="flex items-center h-full">
          <button
            className={`flex flex-col justify-center items-start space-y-1 pl-8 ${
              isSidebarOpen ? 'hidden' : ''
            }`}
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
          </button>
        </div>
        <img
          src="/PAG.png"
          alt="Logo"
          className="h-8 lg:h-12 mx-auto"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </header>

    {/* Top White Box */}
<div className="w-full px-4 sm:px-8 mt-6">
  <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-[40px] mb-4 sm:mb-0 text-left pl-6">
      Gym
    </h1>

    <div className="text-center sm:text-center sm:flex sm:flex-col sm:items-center">
      <p className="text-gray-600 mb-1">Facilities In Use</p>
      <div className="flex items-baseline justify-center">
        <span className="text-2xl font-bold text-gray-900">{inUseCount}</span>
        <span className="text-xl text-gray-400">/13</span>
      </div>
    </div>

    <div className="w-20" /> {/* Right spacing */}
  </div>
</div>


      {/* Facilities Grid */}
      <div className="w-full px-4 sm:px-8 mt-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
            {facilities.map(facility => (
              <div className="flex justify-center" key={facility.id}>
       <button
  className="w-[90%] h-24 sm:h-28 rounded-xl shadow-md font-semibold text-white text-base sm:text-lg"
  style={{
    background: facility.inUse
      ? 'linear-gradient(45deg, #E67A69, #EB9F94)'  // Red gradient
      : 'linear-gradient(45deg, #55BC7E, #7DCA8B)'  // Green gradient
  }}
>
  {facility.name}
</button>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gym;
