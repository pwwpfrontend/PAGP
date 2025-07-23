import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Activity,
  Wind,
  Building,
  CheckCircle,
  XCircle,
  Plug,
  Target,
} from "lucide-react";

// Map for section icons
const iconMap = {
  occupancy: <Target className="text-gray-500" />,
  iaq: <Wind className="text-gray-500" />,
  pag: <Building className="text-gray-500" />,
  plug: <Plug className="text-gray-500" />,
  acupressure: <Target className="text-gray-500" />,
};

// Function to check if sensor is connected based on lastUpdated
const isSensorConnected = (timestamp) => {
  if (!timestamp || timestamp === 0) return false;
  const updatedTime = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - updatedTime;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours <= 24;
};

const SensorSummaryCard = ({ title, count, icon, sensors = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSensorId, setExpandedSensorId] = useState(null);

  const toggleSensorDetails = (sensorId) => {
    setExpandedSensorId((prev) => (prev === sensorId ? null : sensorId));
  };

  return (
    <div className="bg-white rounded-lg shadow border transition">
      {/* Sensor Group Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
            {iconMap[icon] || <Activity className="text-gray-500" />}
          </div>
          <div>
            <h2 className="text-lg font-medium">{title}</h2>
            <p className="text-sm text-gray-500">{count} devices</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="text-gray-400" />
        ) : (
          <ChevronRight className="text-gray-400" />
        )}
      </div>

      {/* Sensors List */}
      {isExpanded && (
        <div className="divide-y">
          {sensors.length === 0 ? (
            <p className="text-sm text-gray-500 px-4 py-2">No sensors found.</p>
          ) : (
            sensors.map((sensor) => {
              const connected = isSensorConnected(sensor.timestamp);

              return (
                <div key={sensor.id}>
                  {/* Sensor Row */}
                  <div
                    onClick={() => toggleSensorDetails(sensor.id)}
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {connected ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <XCircle className="text-red-500" size={16} />
                        )}
                        <span className="font-medium text-sm">{sensor.id}</span>
                      </div>
                      <p className="text-sm text-gray-500">{sensor.area}</p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Plug size={16} className="text-gray-500" />
                      <span>{sensor.power || "POE"}</span>
                      {expandedSensorId === sensor.id ? (
                        <ChevronDown className="text-gray-400" />
                      ) : (
                        <ChevronRight className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Sensor Details */}
                  {expandedSensorId === sensor.id && (
                    <div className="bg-gray-50 px-6 py-4 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Device Type</p>
                        <p className="font-medium">
                          {sensor.deviceType || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium">
                          {sensor.status || "Active"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{sensor.area}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Area</p>
                        <p className="font-medium">
                          {sensor.areaNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Power</p>
                        <p className="font-medium flex items-center gap-2">
                          <Plug size={16} className="text-gray-600" />
                          {sensor.power || "POE powered"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Updated</p>
                        <p className="font-medium">
                          {sensor.timestamp
                            ? new Date(sensor.timestamp).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* Edit Button */}
                      <div className="col-span-1 md:col-span-2 text-right">
                        <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SensorSummaryCard;
