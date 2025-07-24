import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const generateAvailability = (count) => {
  return Array.from({ length: count }, () => Math.random() > 0.5);
};

const Concierge = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meetingRooms, setMeetingRooms] = useState(generateAvailability(18));
  const [phoneBooths, setPhoneBooths] = useState(generateAvailability(9));
  const [facilities, setFacilities] = useState(generateAvailability(4));
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', weekday: 'short' };
    const formatted = date.toLocaleDateString('en-GB', options).replace(',', '');
    return formatted.replace(/^(\d+)/, (d) => {
      if (d.endsWith('1') && d !== '11') return d + 'st';
      if (d.endsWith('2') && d !== '12') return d + 'nd';
      if (d.endsWith('3') && d !== '13') return d + 'rd';
      return d + 'th';
    });
  };

  const renderButton = (label, isAvailable, type = 'default') => {
    const gradient = isAvailable
      ? 'linear-gradient(45deg, #55BC7E, #7DCA8B)'
      : 'linear-gradient(45deg, #E67A69, #EB9F94)';

    const sizeClass =
      type === 'meeting' || type === 'facility'
        ? 'w-[150px] h-[80px] sm:w-[160px] sm:h-[85px]'
        : 'w-[120px] h-[70px]';

    return (
      <div className="p-1 sm:p-1.5">
        <button
          key={label}
          className={`rounded-lg text-white text-sm sm:text-base font-medium ${sizeClass}`}
          style={{ background: gradient }}
        >
          {label}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Header */}
      <header className="bg-[#fbfbfb] h-16 lg:h-20 fixed top-0 left-0 w-full z-10 flex items-center justify-between shadow-md px-6 sm:px-10">
        <div className="flex items-center h-full">
          <button
            className={`flex flex-col justify-center items-start space-y-1 ${
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

      {/* Main Content */}
      <div className="w-full px-6 sm:px-10 mt-2 sm:mt-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-800">Concierge</h1>
          <div className="text-right">
            <div className="text-xl font-semibold leading-tight">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-gray-500">{formatDate(time)}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Meeting Rooms */}
          <div className="bg-white p-6 rounded-xl shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-4">Meeting Rooms</h2>
            <div className="flex flex-wrap justify-center gap-y-3 gap-x-3">
              {meetingRooms.map((isAvailable, idx) =>
                renderButton(`Room ${idx + 1}`, isAvailable, 'meeting')
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-[40%]">
            {/* Phone Booths */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Phone Booths</h2>
              <div className="flex flex-wrap justify-center gap-y-3 gap-x-3">
                {phoneBooths.map((isAvailable, idx) =>
                  renderButton(`Booth ${idx + 1}`, isAvailable)
                )}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Facilities</h2>
              <div className="flex flex-wrap justify-center gap-y-3 gap-x-3">
                {['A', 'B', 'C', 'D'].map((label, idx) =>
                  renderButton(`Facility ${label}`, facilities[idx], 'facility')
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Concierge;
