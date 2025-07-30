import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import IAQAnalytics from "./HistoricalIAQ";
import HistoricalOccupancy from "./HistoricalOccupancy";
import Bookings from "./Bookings"; // Import the Bookings component
import { FaWind, FaUsers, FaCalendarAlt } from "react-icons/fa"; // Added FaCalendarAlt for bookings icon
import axios from "axios";

const MainAnalytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("iaq"); // Default to IAQ tab
  const [buildingName, setBuildingName] = useState("Historical Report");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    month: `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`,
  });
  const [reportType, setReportType] = useState("daily");

  const getWeekRange = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const sunday = new Date(d.setDate(diff));
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    return {
      fromDate: sunday.toISOString().split("T")[0],
      toDate: saturday.toISOString().split("T")[0],
    };
  };

  const getMonthRange = (yearMonth) => {
    const [year, month] = yearMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return {
      fromDate: firstDay.toISOString().split("T")[0],
      toDate: lastDay.toISOString().split("T")[0],
    };
  };

  const handleDateChange = (startDate, endDate) => {
    setDateRange({
      ...dateRange,
      fromDate: startDate,
      toDate: endDate,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Header */}
      <header className="bg-[#ffffff] custom-shadow h-14 lg:h-20 xl:h-[100px] fixed top-0 left-0 w-full z-10 flex items-center justify-between">
        <div className="flex items-center h-full">
          <button
            className={`flex flex-col justify-center items-start space-y-1 pl-8 ${
              isSidebarOpen ? "hidden" : ""
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
            e.target.style.display = "none";
          }}
        />
      </header>

      {/* Main Content */}
      <main className="pt-24 lg:pt-32 px-4 md:px-8 pb-12">
        <div className="max-w-9xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            {loading ? (
              <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
                {buildingName}
              </h2>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap border-b border-gray-200">
              {/* IAQ Tab */}
              <button
                className={`px-6 py-4 text-sm md:text-base font-medium transition-all duration-200 ease-in-out flex items-center justify-center relative ${
                  activeTab === "iaq"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleTabChange("iaq")}
              >
                <FaWind
                  className={`w-4 h-4 mr-2 ${
                    activeTab === "iaq" ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                Indoor Air Quality
                {activeTab === "iaq" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>

              {/* Occupancy Tab */}
              <button
                className={`px-6 py-4 text-sm md:text-base font-medium transition-all duration-200 ease-in-out flex items-center justify-center relative ${
                  activeTab === "occupancy"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleTabChange("occupancy")}
              >
                <FaUsers
                  className={`w-4 h-4 mr-2 ${
                    activeTab === "occupancy"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                Occupancy
                {activeTab === "occupancy" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>

              {/* Bookings Tab */}
              <button
                className={`px-6 py-4 text-sm md:text-base font-medium transition-all duration-200 ease-in-out flex items-center justify-center relative ${
                  activeTab === "bookings"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onClick={() => handleTabChange("bookings")}
              >
                <FaCalendarAlt
                  className={`w-4 h-4 mr-2 ${
                    activeTab === "bookings"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
                Bookings
                {activeTab === "bookings" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content-container">
            {activeTab === "iaq" && (
              <div className="iaq-tab">
                <IAQAnalytics />
              </div>
            )}

            {activeTab === "occupancy" && (
              <div className="occupancy-tab">
                <HistoricalOccupancy />
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="bookings-tab">
                <Bookings />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainAnalytics;