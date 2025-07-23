import React, { useState, useEffect, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [progressIntervalId, setProgressIntervalId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = ['PAGIM', 'PAG-S', 'PAG Japan', 'Common'];
  const iaqPercentage = 93;

  const meetingRoomsData = {
    0: ['London', 'New York', 'Delhi', 'War Room', 'Brisbane', 'Melbourne', 'Los Angeles', 'PB1', 'PB2', 'PB3', 'PB4', 'PB5', 'PB6', 'PB7', 'PB8'],
    1: ['Tokyo', 'Paris', 'Singapore', 'Conference A', 'Sydney', 'Mumbai', 'Berlin', 'Room 401', 'Room 402', 'Room 403', 'Room 404', 'Room 405', 'Room 406', 'Room 407', 'Room 408'],
    2: ['Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Sendai', 'Hiroshima', 'Kitakyushu', 'Chiba', 'Sakai', 'Niigata', 'Hamamatsu', 'Kumamoto', 'Sagamihara'],
    3: ['Boardroom', 'Training Room', 'Meeting Hub', 'Focus Room', 'Collaboration', 'Innovation Lab', 'Think Tank', 'Brainstorm', 'Project Room', 'Discussion', 'Workshop', 'Seminar', 'Executive', 'Client Meeting', 'Team Space']
  };

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      time,
      date: `${day} ${month}, ${weekday}`,
    };
  };

  const startTimer = () => {
    if (intervalId) clearInterval(intervalId);
    if (progressIntervalId) clearInterval(progressIntervalId);
    setProgress(0);
    const progressId = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    const timerId = setInterval(() => {
      setActiveTab(prev => (prev + 1) % tabs.length);
      setProgress(0);
    }, 10000);
    setProgressIntervalId(progressId);
    setIntervalId(timerId);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
    setProgress(0);
    startTimer();
  };

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    startTimer();
    return () => {
      clearInterval(clockInterval);
      if (intervalId) clearInterval(intervalId);
      if (progressIntervalId) clearInterval(progressIntervalId);
    };
  }, []);

  const { time, date } = formatDateTime(currentTime);
  const currentRooms = meetingRoomsData[activeTab];

  const occupancyStatus = useMemo(() => {
    const status = {};
    Object.entries(meetingRoomsData).forEach(([tabIndex, rooms]) => {
      status[tabIndex] = rooms.map(() => Math.random() < 0.5);
    });
    return status;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Header */}
      <header className="bg-white custom-shadow h-14 lg:h-20 xl:h-[100px] fixed top-0 left-0 w-full z-10 flex items-center justify-between px-6">
        <div className="flex items-center h-full">
          <button
            className={`flex flex-col justify-center items-start space-y-1 ${isSidebarOpen ? "hidden" : ""}`}
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

      <div className="pt-20 lg:pt-28 px-4 md:px-8">
        {/* Title & Time */}
        <div className="pb-4 flex justify-between items-center px-2 sm:px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-[40px]">Dashboard</h1>
          <div className="text-right">
            <div className="text-[40px] font-extrabold text-gray-700">{time}</div>
            <div className="text-lg font-semibold text-gray-800">{date}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-6 px-2 py-4">
          {tabs.map((tab, index) => (
            <div key={tab} className="flex flex-col items-center">
              <button
                onClick={() => handleTabClick(index)}
                      className={`px-12 py-4 rounded-2xl font-bold text-xl ${
                                  activeTab === index
                                    ? 'text-white'
                                    : 'bg-gray-300 text-black'
                                }`}

                style={activeTab === index ? { backgroundColor: '#929292' } : {}}
              >
                {tab}
              </button>
              {activeTab === index && (
                <div className="w-full h-1 mt-2 bg-gray-300 rounded overflow-hidden">
                  <div
                    className="h-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%`, backgroundColor: '#929292' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rooms Grid */}
        <main className="px-2 pt-8 pb-8">
          <div className="grid gap-x-6 gap-y-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 px-2 sm:px-4">
            {currentRooms.slice(0, 15).map((room, index) => {
              const isOccupied = occupancyStatus[activeTab]?.[index];
              const bgStyle = {
                background: isOccupied
                  ? 'linear-gradient(45deg, #E67A69, #EB9F94)'
                  : 'linear-gradient(45deg, #55BC7E, #7DCA8B)',
              };
              return (
                <div
                  key={`${activeTab}-${index}`}
                  style={bgStyle}
                  className="text-white rounded-xl p-4 sm:p-6 text-center font-medium cursor-pointer min-h-[100px] flex items-center justify-center text-sm sm:text-lg"
                >
                  {room}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* IAQ Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          style={{ background: getIAQGradient(iaqPercentage) }}
          className="text-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center shadow-lg cursor-pointer"
          title={`Indoor Air Quality: ${iaqPercentage >= 90 ? 'Excellent' : iaqPercentage >= 70 ? 'Moderate' : 'Poor'}`}
        >
          <span className="text-lg sm:text-xl font-bold">{iaqPercentage}%</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wide">IAQ</span>
        </div>
      </div>
    </div>
  );
};

const getIAQGradient = (iaq) => {
  if (iaq >= 90) {
    return 'linear-gradient(45deg, #55BC7E, #7DCA8B)';
  } else if (iaq >= 70) {
    return 'linear-gradient(45deg, #F09F5C, #EDAF7D)';
  } else {
    return 'linear-gradient(45deg, #E67A69, #EB9F94)';
  }
};

export default Dashboard;
