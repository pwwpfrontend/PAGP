import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react"; // Import User icon from lucide-react
import Sidebar from "./Sidebar";
import IAQAnalytics from "./HistoricalIAQ";
import HistoricalOccupancy from "./HistoricalOccupancy";
import Bookings from "./Bookings"; // Import the Bookings component
import axios from "axios";

const Concierge = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [phoneBooths, setPhoneBooths] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [time, setTime] = useState(new Date());

  const meetingLabels = [
    "War Room", "Beijing", "Mumbai", "Shenzhen", "Auckland", "Shanghai",
    "Taipei", "Brisbane", "Melbourne", "Los Angeles", "Sydney", "Delhi",
    "London", "Tokyo", "Hong Kong", "Singapore", "New York", "Seoul"
  ];

  const phoneBoothLabels = [
    "PB1", "PB2", "PB3", "PB4", "PB5", "PB6",
    "PB7", "PB8", "PB9", "PB10", "PB11"
  ];

  const facilityLabels = ["Gym", "Cafe", "Nursing Room", "Nap Pod R"];

  
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

  // Meeting Rooms 
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


  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to get occupancy count for multi-area rooms (Gym and Cafe)
  const getOccupancyCount = (label) => {
    const areaId = areaMap[label];
    
    if (Array.isArray(areaId)) {
      return areaId.reduce((count, id) => {
        const match = occupancyData.find(item => item.areaId === id);
        return count + (match?.occupancy || 0);
      }, 0);
    }
    
    return 0;
  };

  
  useEffect(() => {
  const fetchOccupancyData = async () => {
    try {
      const response = await fetch(
        "https://njs-01.optimuslab.space/pag/occupancy_live",
        {
          headers: {
            Authorization: "Bearer eyJhbGciOiJBMjU2S1ciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiemlwIjoiREVGIn0.oP7kkrdaVmSrAdVHgyd9tBOomUgGPhVEE6FAUzGqdRtuSTMqhSpv72X2Oj0ljfDQ4Wj2TCQ6r8o0V13xHwNYb05vMgBQrDyG.ckEuTOKB68aidCewnbKL3w.BJHzaVpyewDVPKhVoM60x2JUqdSKpsHwcfLWZYOH2_tEW-XTM-V5B3VT03CEHUEBDtiQDrlkB3mLOymGYM28zRZTxXounHcWSXI61GEafBeciRY19JwZs8ytIooac1lnXfWxH3O8LSOntptdyD2cTA.OinO8SyOB7fLPUQ9dKE7U5tHsDwFqWm1CdcYe55-sAc",
          },
        }
      );
      const data = await response.json();
      
      // Store occupancy data for count calculations
      setOccupancyData(data);

      const getOccupancyValue = (areaId) => {
        return data.find((entry) => entry.areaId === areaId)?.occupancy;
      };

      const isAvailable = (label) => {
        const mapped = areaMap[label];
        if (!mapped || mapped.length === 0) return true;
        if (Array.isArray(mapped)) {
          return mapped.every((id) => getOccupancyValue(id) === 0);
        }
        return getOccupancyValue(mapped) === 0;
      };

      setMeetingRooms(meetingLabels.map(label => isAvailable(label)));
      setPhoneBooths(phoneBoothLabels.map(label => isAvailable(label)));
      setFacilities(facilityLabels.map(label => isAvailable(label)));
    } catch (error) {
      console.error("Error fetching occupancy data:", error);
    }
  };

  // Initial fetch
  fetchOccupancyData();

  // Set interval for 30 seconds (30000 ms)
  const intervalId = setInterval(fetchOccupancyData, 30000);

  return () => clearInterval(intervalId); // Cleanup on unmount
}, []);


  const formatDate = (date) => {
    const options = { day: "numeric", month: "short", weekday: "short" };
    const formatted = date.toLocaleDateString("en-GB", options).replace(",", "");
    return formatted.replace(/^(\d+)/, (d) => {
      if (d.endsWith("1") && d !== "11") return d + "st";
      if (d.endsWith("2") && d !== "12") return d + "nd";
      if (d.endsWith("3") && d !== "13") return d + "rd";
      return d + "th";
    });
  };

  const renderButton = (label, isAvailable, type = "default") => {
    const gradient = isAvailable
      ? "linear-gradient(45deg, #55BC7E, #7DCA8B)"
      : "linear-gradient(45deg, #E67A69, #EB9F94)";

    const sizeClass =
      type === "meeting" || type === "facility"
        ? "w-[150px] h-[80px] sm:w-[160px] sm:h-[85px]"
        : "w-[120px] h-[70px]";

    // Check if button needs occupancy count display
    const showCount = (label === 'Gym' || label === 'Cafe') && Array.isArray(areaMap[label]);
    const occupancyCount = showCount ? getOccupancyCount(label) : 0;

    return (
      <div className="p-1 sm:p-1.5" key={label}>
        <button
          className={`rounded-lg text-white text-sm sm:text-base font-medium ${sizeClass} flex flex-col items-center justify-center relative`}
          style={{ background: gradient }}
        >
          <div className="flex-1 flex items-center justify-center">
            {label}
          </div>
          {showCount && (
            <div className="flex items-center justify-center mt-1">
              <User className="w-3 h-3 mr-1" />
              <span className="text-xs font-bold">{occupancyCount}</span>
            </div>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <header className="bg-[#fbfbfb] h-16 lg:h-20 fixed top-0 left-0 w-full z-10 flex items-center justify-between shadow-md px-6 sm:px-10">
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
            e.target.style.display = "none";
          }}
        />
      </header>

      <div className="w-full px-6 sm:px-10 mt-2 sm:mt-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-800">Concierge</h1>
          <div className="text-right">
            <div className="text-xl font-semibold leading-tight">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-500">{formatDate(time)}</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="bg-white p-6 rounded-xl shadow-md flex-1">
            <h2 className="text-lg font-semibold mb-4">Meeting Rooms</h2>
            <div className="flex flex-wrap justify-start gap-y-3 gap-x-3">

              {meetingRooms.map((isAvailable, idx) =>
                renderButton(meetingLabels[idx], isAvailable, "meeting")
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full lg:w-[40%]">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Phone Booths</h2>
              <div className="flex flex-wrap justify-start gap-y-3 gap-x-3">

                {phoneBooths.map((isAvailable, idx) =>
                  renderButton(phoneBoothLabels[idx], isAvailable)
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-lg font-semibold mb-4">Facilities</h2>
              <div className="flex flex-wrap justify-start gap-y-3 gap-x-3">

                {facilities.map((isAvailable, idx) =>
                  renderButton(facilityLabels[idx], isAvailable, "facility")
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