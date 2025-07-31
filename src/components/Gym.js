import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import IAQAnalytics from "./HistoricalIAQ";
import HistoricalOccupancy from "./HistoricalOccupancy";
import Bookings from "./Bookings"; // Import the Bookings component
import axios from "axios";

function Gym() {
  const [facilities, setFacilities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

const gymLabels = [
  'Adjustable Bench 1',
  'Adjustable Bench 2',
  'Dual Cable Cross',
  'Elliptical Trainer',
  'Flat Bench',
  'Heat Performance Row',
  'Lat Pull Down',
  'Olympic Flat Bench',
  'Power Rack',
  'Skill Mill',
  'Smith Machine',
  'Spin Bike 1',
  'Spin Bike 2',
  'Station Combo',
  'Treadmill 1',
  'Treadmill 2',
  'Upright Bike',
];

const areaMap = {
  'Gym Room - Adjustable Bench 1': 'Adjustable Bench 1',
  'Gym Room - Adjustable Bench 2': 'Adjustable Bench 2',
  'Gym Room - Dual Cable Cross': 'Dual Cable Cross',
  'Gym Room - Elliptical Trainer': 'Elliptical Trainer',
  'Gym Room - Flat Bench': 'Flat Bench',
  'Gym Room - Heat Performance Row': 'Heat Performance Row',
  'Gym Room - Lat Pull Down': 'Lat Pull Down',
  'Gym Room - Olympic Flat Bench': 'Olympic Flat Bench',
  'Gym Room - Power Rack': 'Power Rack',
  'Gym Room - Skill Mill': 'Skill Mill',
  'Gym Room - Smith Machine': 'Smith Machine',
  'Gym Room - Spin Bike 1': 'Spin Bike 1',
  'Gym Room - Spin Bike 2': 'Spin Bike 2',
  'Gym Room - Station Combo': 'Station Combo',
  'Gym Room - Treadmill 1': 'Treadmill 1',
  'Gym Room - Treadmill 2': 'Treadmill 2',
  'Gym Room - Upright Bike': 'Upright Bike',
};


  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://njs-01.optimuslab.space/pag/occupancy_live',
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.oP7kkrdaVmSrAdVHgyd9tBOomUgGPhVEE6FAUzGqdRtuSTMqhSpv72X2Oj0ljfDQ4Wj2TCQ6r8o0V13xHwNYb05vMgBQrDyG.ckEuTOKB68aidCewnbKL3w.BJHzaVpyewDVPKhVoM60x2JUqdSKpsHwcfLWZYOH2_tEW-XTM-V5B3VT03CEHUEBDtiQDrlkB3mLOymGYM28zRZTxXounHcWSXI61GEafBeciRY19JwZs8ytIooac1lnXfWxH3O8LSOntptdyD2cTA.OinO8SyOB7fLPUQ9dKE7U5tHsDwFqWm1CdcYe55-sAc',
          },
        }
      );

      const data = await response.json();

      const filtered = data
  .filter(item => areaMap[item.areaId])
  .map(item => ({
    name: areaMap[item.areaId],
    inUse: item.occupancy === 1,
  }));

      setFacilities(filtered);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 30000); // auto-refresh every 5s
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
            className={`flex flex-col justify-center items-start space-y-1 pl-8 ${isSidebarOpen ? 'hidden' : ''}`}
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
              <span className="text-xl text-gray-400">/{facilities.length}</span>
            </div>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="w-full px-4 sm:px-8 mt-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
            {facilities.map((facility, index) => (
              <div className="flex justify-center" key={index}>
                <button
                  className="w-[90%] h-24 sm:h-28 rounded-xl shadow-md font-semibold text-white text-base sm:text-lg"
                  style={{
                    background: facility.inUse
                      ? 'linear-gradient(45deg, #E67A69, #EB9F94)' // Red gradient
                      : 'linear-gradient(45deg, #55BC7E, #7DCA8B)', // Green gradient
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
