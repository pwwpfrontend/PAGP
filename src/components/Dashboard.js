import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react"; // Import User icon from lucide-react
import Sidebar from "./Sidebar";
import IAQAnalytics from "./HistoricalIAQ";
import HistoricalOccupancy from "./HistoricalOccupancy";
import Bookings from "./Bookings"; // Import the Bookings component
import { FaWind, FaUsers, FaCalendarAlt } from "react-icons/fa"; // Added FaCalendarAlt for bookings icon
// import axios from "axios"; // Not needed for this implementation

// Occupancy Icon Component
const OccupancyIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [progressIntervalId, setProgressIntervalId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [occupancyData, setOccupancyData] = useState([]);
  const [totalOccupancy, setTotalOccupancy] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  const tabs = ['PAGIM', 'PAG-S', 'PAG Japan', 'Common'];

  const meetingRoomsData = {
    0: ['War Room', 'Brisbane', 'Melbourne', 'Los Angeles', 'Delhi', 'London', 'New York', 'PB1', 'PB2', 'PB3', 'PB4', 'PB5', 'PB6', 'PB7', 'PB8'],
    1: ['Shenzhen', 'Taipei', 'PB9', 'PB10'],
    2: ['Beijing', 'Mumbai', 'PB11'],
    3: ['Auckland', 'Shanghai', 'Sydney', 'Tokyo', 'Hong Kong', 'Singapore', 'Seoul', 'Nursing Room', 'Nap Pod R', 'Gym', 'Cafe']
  };

  const areaMap = {
  // Phone Booths (1:1 mapping)
  PB1: "PB1",
  PB2: "PB2",
  PB3: "PB3",
  PB4: "PB4",
  PB5: "PB5",
  PB6: "PB6",
  PB7: "PB7",
  PB8: "PB8",
  PB9: "PB9",
  PB10: "PB10",
  PB11: "PB11",

  // Facilities 
  "Gym": [
    "Gym Room - Treadmill 1",
    "Gym Room - Treadmill 2",
    "Gym Room - Skill Mill",
    "Gym Room - Elliptical Trainer",
    "Gym Room - Upright Bike",
    "Gym Room - Spin Bike 1",
    "Gym Room - Spin Bike 2",
    "Gym Room - Heat Performance Row",
    "Gym Room - Lat Pull Down",
    "Gym Room - Station Combo",
    "Gym Room - Dual Cable Cross",
    "Gym Room - Smith Machine",
    "Gym Room - Flat Bench",
    "Gym Room - Olympic Flat Bench",
    "Gym Room - Adjustable Bench 1",
    "Gym Room - Adjustable Bench 2",
    "Gym Room - Power Rack"
  ],
  "Nursing Room": "Nursing Room",
  "Nap Pod R": "Nap Pod R",
 "Cafe": [
    "PAG-33F-CAFE-01",
    "PAG-33F-CAFE-02", 
    "PAG-33F-CAFE-03",
    "PAG-33F-CAFE-04",
    "PAG-33F-CAFE-05"
  ], 
  
  "War Room": "PAG-33F-WARROOM",
  "Beijing": "PAG-33F-BEIJING",
  "Mumbai": "PAG-33F-MUMBAI",
  "Shenzhen": "PAG-33F-SHENZHEN",
  "Auckland": "PAG-33F-AUCKLAND",
  "Shanghai": "PAG-33F-SHANGHAI",
  "Taipei": "PAG-33F-TAIPEI",
  "Brisbane": "PAG-33F-BRISBANE",
  "Melbourne": "PAG-33F-MELBOURNE",
  "Los Angeles": "PAG-33F-LOSANGELES",
  "Sydney": "PAG-33F-SYDNEY", 
  "Delhi": "PAG-33F-DELHI",      
  "London": "PAG-33F-LONDON",   
  "Tokyo": "PAG-33F-TOKYO",            
  "Hong Kong": "PAG-33F-HONGKONG",  
  "Singapore": "PAG-33F-SINGAPORE",  
  "New York": "PAG-33F-NEWYORK",  
  "Seoul": "PAG-33F-SEOUL"  
  };

  const API_URL = "https://njs-01.optimuslab.space/pag/occupancy_live";
  const BEARER_TOKEN = "Bearer eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.oP7kkrdaVmSrAdVHgyd9tBOomUgGPhVEE6FAUzGqdRtuSTMqhSpv72X2Oj0ljfDQ4Wj2TCQ6r8o0V13xHwNYb05vMgBQrDyG.ckEuTOKB68aidCewnbKL3w.BJHzaVpyewDVPKhVoM60x2JUqdSKpsHwcfLWZYOH2_tEW-XTM-V5B3VT03CEHUEBDtiQDrlkB3mLOymGYM28zRZTxXounHcWSXI61GEafBeciRY19JwZs8ytIooac1lnXfWxH3O8LSOntptdyD2cTA.OinO8SyOB7fLPUQ9dKE7U5tHsDwFqWm1CdcYe55-sAc"; 

  const fetchOccupancyData = async () => {
    try {
      setIsDataLoading(true);
      setDataError(false);
      
      const response = await fetch(API_URL, {
        headers: {
          Authorization: BEARER_TOKEN
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch data");
      
      const data = await response.json();
      setOccupancyData(data);
      
      // Calculate total occupancy
      const total = Array.isArray(data) ? data.reduce((sum, item) => {
        return sum + (item.occupancy || 0);
      }, 0) : 0;
      
      setTotalOccupancy(total);
      setIsDataLoading(false);
    } catch (error) {
      console.error("API fetch error:", error);
      setDataError(true);
      setIsDataLoading(false);
      setTotalOccupancy(0);
    }
  };

  useEffect(() => {
    fetchOccupancyData();
    const apiInterval = setInterval(fetchOccupancyData, 30000);
    return () => clearInterval(apiInterval);
  }, []);

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

  const animationRef = useRef(null);
const startTimeRef = useRef(null);

   
const startTimer = () => {
  cancelAnimationFrame(animationRef.current);
  startTimeRef.current = performance.now();
  setProgress(0);

  const animate = (time) => {
    const elapsed = time - startTimeRef.current;
    const duration = 10000; // 10 seconds
    const progressPercent = Math.min((elapsed / duration) * 100, 100);
    setProgress(progressPercent);

    if (elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Move to next tab and restart
      setActiveTab(prev => (prev + 1) % tabs.length);
      startTimer();
    }
  };

  animationRef.current = requestAnimationFrame(animate);
};


const handleTabClick = (index) => {
  cancelAnimationFrame(animationRef.current);
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
  cancelAnimationFrame(animationRef.current);
};

}, []);


  const { time, date } = formatDateTime(currentTime);
  const currentRooms = meetingRoomsData[activeTab];

const isRoomOccupied = (room) => {
  const areaId = areaMap[room] || room;

  // Handle Gym / multi-area rooms
  if (Array.isArray(areaId)) {
    return areaId.some(id => {
      const match = occupancyData.find(item => item.areaId === id);
      return match?.occupancy === 1;
    });
  }

  // Handle regular rooms
  const match = occupancyData.find(item => item.areaId === areaId);
  return match?.occupancy === 1;
};

// Function to get occupancy count for multi-area rooms (Gym and Cafe)
const getOccupancyCount = (room) => {
  const areaId = areaMap[room] || room;
  
  if (Array.isArray(areaId)) {
    return areaId.reduce((count, id) => {
      const match = occupancyData.find(item => item.areaId === id);
      return count + (match?.occupancy || 0);
    }, 0);
  }
  
  return 0;
};

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <header className="bg-white custom-shadow h-14 lg:h-20 xl:h-[100px] fixed top-0 left-0 w-full z-10 flex items-center justify-between px-6">
        <div className="flex items-center h-full">
          <button className={`flex flex-col justify-center items-start space-y-1 ${isSidebarOpen ? "hidden" : ""}`} onClick={() => setIsSidebarOpen(true)}>
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
            <span className="block sm:w-8 sm:h-1 w-4 h-0.5 bg-gray-700"></span>
          </button>
        </div>
        
        <img src="/PAG.png" alt="Logo" className="h-8 lg:h-12 mx-auto" onError={(e) => e.target.style.display = 'none'} />
        
        {/* Empty div to maintain header layout balance */}
        <div className="flex items-center">
        </div>
      </header>

      <div className="pt-20 lg:pt-28 px-4 md:px-8">
        <div className="pb-4 flex justify-between items-center px-2 sm:px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-[40px]">Dashboard</h1>
          <div className="text-right">
            <div className="text-[40px] font-bold text-gray-700">{time}</div>
            <div className="text-lg font-semibold text-gray-800">{date}</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 px-2 py-4">
          {tabs.map((tab, index) => (
            <div key={tab} className="flex flex-col items-center">
              <button onClick={() => handleTabClick(index)} className={`px-12 py-4 rounded-2xl font-bold text-xl ${activeTab === index ? 'text-white' : 'bg-gray-300 text-black'}`} style={activeTab === index ? { backgroundColor: '#929292' } : {}}>
                {tab}
              </button>
              {activeTab === index && (
                <div className="w-full h-1 mt-2 bg-gray-300 rounded overflow-hidden">
                  <div className="h-full transition-all duration-100 ease-linear" style={{ width: `${progress}%`, backgroundColor: '#929292' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <main className="px-2 pt-8 pb-8">
          <div className="grid gap-x-6 gap-y-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 px-2 sm:px-4">
            {currentRooms.slice(0, 15).map((room, index) => {
              const occupied = isRoomOccupied(room);
              const bgStyle = {
                background: occupied
                  ? 'linear-gradient(45deg, #E67A69, #EB9F94)'
                  : 'linear-gradient(45deg, #55BC7E, #7DCA8B)',
              };

              // Check if room needs occupancy count display (only for Gym and Cafe in Common tab)
              const showCount = activeTab === 3 && (room === 'Gym' || room === 'Cafe') && Array.isArray(areaMap[room]);
              const occupancyCount = showCount ? getOccupancyCount(room) : 0;

              return (
                <div
                  key={`${activeTab}-${index}`}
                  style={bgStyle}
                  className="text-white rounded-xl p-4 sm:p-6 text-center font-medium cursor-pointer min-h-[100px] flex flex-col items-center justify-center text-sm sm:text-lg relative"
                >
                  <div className="flex-1 flex items-center justify-center">
                    {room}
                  </div>
                  {showCount && (
                    <div className="flex items-center justify-center mt-2">
                      <User className="w-4 h-4 mr-1" strokeWidth={2.5} />
                      <span className="text-sm font-bold">{occupancyCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* <div className="fixed bottom-6 right-6 z-50">
        <div
          style={{ background: getIAQGradient(93) }}
          className="text-white rounded-full w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center shadow-lg cursor-pointer"
          title="Indoor Air Quality: Excellent"
        >
          <span className="text-lg sm:text-xl font-bold">93%</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-wide">IAQ</span>
        </div>
      </div> */}
    </div>
  );
};

const getIAQGradient = (iaq) => {
  if (iaq >= 90) return 'linear-gradient(45deg, #55BC7E, #7DCA8B)';
  if (iaq >= 70) return 'linear-gradient(45deg, #F09F5C, #EDAF7D)';
  return 'linear-gradient(45deg, #E67A69, #EB9F94)';
};

export default Dashboard;