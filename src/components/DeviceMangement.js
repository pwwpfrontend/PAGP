// components/DeviceManagement.js
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "../subcomp/Header";
import SensorSummaryCard from "../subcomp/SensorSummaryCard";
import { Search } from "lucide-react";

const DeviceManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch("https://optimusd.flowfuse.cloud/pag-devices");
        const data = await res.json();
        setSensorData(data);
      } catch (err) {
        setError("Failed to fetch sensor data");
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  const getSensorGroups = () => {
    if (!sensorData) return [];

    const allDevices = sensorData.devices || [];
    const statusMap = sensorData.devicesStatus || {};

    const occupancy = []; // PAG-DS
    const iaq = []; // PAG-IAQ
    const pag33f = []; // PAG-33/F

    allDevices.forEach((deviceId) => {
      const device = statusMap[deviceId];
      if (!device) return;

      const sensor = {
        id: deviceId,
        ...device,
      };

      if (deviceId.startsWith("PAG-DS")) occupancy.push(sensor);
      else if (deviceId.startsWith("PAG-IAQ")) iaq.push(sensor);
      else if (deviceId.startsWith("PAG-33/F")) pag33f.push(sensor);
    });

    return [
      { title: "Occupancy Sensors", icon: "occupancy", sensors: occupancy },
      { title: "IAQ Sensors", icon: "iaq", sensors: iaq },
      { title: "PAG-33F Sensors", icon: "pag", sensors: pag33f },
    ];
  };

  const filteredGroups = getSensorGroups().map((group) => ({
    ...group,
    sensors: group.sensors.filter((sensor) =>
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="pt-[100px] px-4 md:px-10 lg:px-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Devices</h1>

          {/* Search */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by device ID or Type or Area"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Summary Cards */}
          {loading ? (
            <p className="text-gray-500">Loading sensor data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((group) => (
                <SensorSummaryCard
                  key={group.title}
                  title={group.title}
                  icon={group.icon}
                  count={group.sensors.length}
                  sensors={group.sensors}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeviceManagement;
