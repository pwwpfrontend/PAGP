import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Thermometer, Droplets, Frown, Info } from "lucide-react";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import WeatherAirQuality from "./WeatherAirQuality";

const IAQ = () => {
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [editingIndex, setEditingIndex] = useState(null);
  const [deviceLocations, setDeviceLocations] = useState({});
  const [deviceAreaIds, setDeviceAreaIds] = useState({});
  const [hkoTemperature, setHkoTemperature] = useState(null);
  const [avgCO2, setAvgCO2] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [expandedRows, setExpandedRows] = useState({});
  const [graphData, setGraphData] = useState({});
  const [isLoadingGraphData, setIsLoadingGraphData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Column averages state for PAG sensors
  const [columnAverages, setColumnAverages] = useState({
    co2: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    pm10: 0,
    pm2_5: 0,
    tvoc: 0,
  });

  const convertUTCToLocalTime = (utcTimestamp) => {
    if (!utcTimestamp) return "-";
    const utcDate = new Date(utcTimestamp);
    return utcDate.toLocaleString();
  };

  // Function to get exceeding metrics (for potential warnings)
  const getExceedingMetrics = (sensor) => {
    if (!sensor) return [];

    const exceedingMetrics = [];
    const columns = [
      "co2",
      "temperature",
      "humidity",
      "pressure",
      "pm10",
      "pm2_5",
      "tvoc",
    ];

    columns.forEach((column) => {
      if (
        sensor[column] !== undefined &&
        sensor[column] !== null &&
        sensor[column] !== "-" &&
        columnAverages[column] > 0
      ) {
        const sensorValue = parseFloat(sensor[column]);
        const threshold = columnAverages[column] * 1.2; // 20% above average

        if (sensorValue > threshold) {
          exceedingMetrics.push({
            name: column,
            value: sensorValue,
            avg: columnAverages[column],
            percent: ((sensorValue / columnAverages[column] - 1) * 100).toFixed(
              1
            ),
          });
        }
      }
    });

    return exceedingMetrics;
  };

  const isMetricExceeding = (metric, metrics) => {
    return metrics.some((m) => m.name === metric);
  };

  const getCurrentJSTDate = () => {
    const now = new Date();
    const jstTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    return jstTime.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Helper function to convert UTC to JST
  const convertUTCToJST = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp);
    return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  };

  // Helper function to get alert sensors
  const getAlertSensors = () => {
    if (!data || data.length === 0) return {};

    const now = new Date();

    const alerts = {
      notUpdated: [],
      highestPM25: null,
      highestPM10: null,
      highestTemp: null,
      lowestTemp: null,
      highestHumidity: null,
      lowestHumidity: null,
      highestCO2: null,
    };

    // Find sensors not updated for more than 1 hour
    data.forEach((sensor) => {
      if (sensor.last_updated) {
        const sensorTime = new Date(sensor.last_updated);
        const timeDiffMs = now - sensorTime;
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

        if (timeDiffHours > 1) {
          alerts.notUpdated.push(sensor);
        }
      }
    });

    // Find highest PM2.5
    const validPM25 = data.filter(
      (s) => s.pm2_5 && s.pm2_5 !== "-" && !isNaN(parseFloat(s.pm2_5))
    );
    if (validPM25.length > 0) {
      alerts.highestPM25 = validPM25.reduce((max, sensor) =>
        parseFloat(sensor.pm2_5) > parseFloat(max.pm2_5) ? sensor : max
      );
    }

    // Find highest PM10
    const validPM10 = data.filter(
      (s) => s.pm10 && s.pm10 !== "-" && !isNaN(parseFloat(s.pm10))
    );
    if (validPM10.length > 0) {
      alerts.highestPM10 = validPM10.reduce((max, sensor) =>
        parseFloat(sensor.pm10) > parseFloat(max.pm10) ? sensor : max
      );
    }

    // Find highest temperature
    const validTemp = data.filter(
      (s) =>
        s.temperature &&
        s.temperature !== "-" &&
        !isNaN(parseFloat(s.temperature))
    );
    if (validTemp.length > 0) {
      alerts.highestTemp = validTemp.reduce((max, sensor) =>
        parseFloat(sensor.temperature) > parseFloat(max.temperature)
          ? sensor
          : max
      );
      alerts.lowestTemp = validTemp.reduce((min, sensor) =>
        parseFloat(sensor.temperature) < parseFloat(min.temperature)
          ? sensor
          : min
      );
    }

    // Highest and lowest humidity
    const validHumidity = data.filter(
      (s) => s.humidity && s.humidity !== "-" && !isNaN(parseFloat(s.humidity))
    );
    if (validHumidity.length > 0) {
      alerts.highestHumidity = validHumidity.reduce((max, sensor) =>
        parseFloat(sensor.humidity) > parseFloat(max.humidity) ? sensor : max
      );
      alerts.lowestHumidity = validHumidity.reduce((min, sensor) =>
        parseFloat(sensor.humidity) < parseFloat(min.humidity) ? sensor : min
      );
    }

    // Find highest CO2
    const validCO2 = data.filter(
      (s) => s.co2 && s.co2 !== "-" && !isNaN(parseFloat(s.co2))
    );
    if (validCO2.length > 0) {
      alerts.highestCO2 = validCO2.reduce((max, sensor) =>
        parseFloat(sensor.co2) > parseFloat(max.co2) ? sensor : max
      );
    }

    return alerts;
  };

  const AlertArea = ({ alerts }) => {
    if (!alerts) return null;

    const hasAlerts = true;

    if (!hasAlerts) return null;

    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-red-800 flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Alerts
          </h3>
          <div className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium">
            Active Alerts
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Highest CO2 */}
          {alerts.highestCO2 && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Frown className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Highest CO2</h4>
                    <p className="text-xs text-gray-500">Carbon Dioxide</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-700">
                    {parseFloat(alerts.highestCO2.co2).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-500">ppm</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm text-gray-800">
                      {alerts.highestCO2.device_name}
                    </span>
                    <p className="text-xs text-gray-600">
                      {alerts.highestCO2.location || "Unknown "}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alerts.highestCO2.last_updated || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Highest PM2.5 */}
          {alerts.highestPM25 && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <Frown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Highest PM2.5
                    </h4>
                    <p className="text-xs text-gray-500">Air Quality</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {parseFloat(alerts.highestPM25.pm2_5).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">μg/m³</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm text-gray-800">
                      {alerts.highestPM25.device_name}
                    </span>
                    <p className="text-xs text-gray-600">
                      {alerts.highestPM25.location || "Unknown "}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alerts.highestPM25.last_updated || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Highest PM10 */}
          {alerts.highestPM10 && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    <Frown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Highest PM10
                    </h4>
                    <p className="text-xs text-gray-500">Air Quality</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {parseFloat(alerts.highestPM10.pm10).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">μg/m³</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-sm text-gray-800">
                      {alerts.highestPM10.device_name}
                    </span>
                    <p className="text-xs text-gray-600">
                      {alerts.highestPM10.location || "Unknown "}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alerts.highestPM10.last_updated || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Temperature Extremes */}
          {(alerts.highestTemp || alerts.lowestTemp) && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Temperature Extremes
                  </h4>
                  <p className="text-xs text-gray-500">High/Low Values</p>
                </div>
              </div>
              <div className="space-x-4 flex">
                {alerts.highestTemp && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium text-red-700">
                          HIGHEST
                        </span>
                        <p className="font-medium text-sm text-gray-800">
                          {alerts.highestTemp.device_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {alerts.highestTemp.location || "Unknown "}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">
                          {parseFloat(alerts.highestTemp.temperature).toFixed(
                            1
                          )}
                          °C
                        </div>
                        <div className="text-xs text-gray-500">
                          {alerts.highestTemp.last_updated || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {alerts.lowestTemp && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium text-blue-700">
                          LOWEST
                        </span>
                        <p className="font-medium text-sm text-gray-800">
                          {alerts.lowestTemp.device_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {alerts.lowestTemp.location || "Unknown "}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {parseFloat(alerts.lowestTemp.temperature).toFixed(1)}
                          °C
                        </div>
                        <div className="text-xs text-gray-500">
                          {alerts.lowestTemp.last_updated || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Humidity Extremes */}
          {(alerts.highestHumidity || alerts.lowestHumidity) && (
            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Humidity Extremes
                  </h4>
                  <p className="text-xs text-gray-500">High/Low Values</p>
                </div>
              </div>
              <div className="space-x-4 flex flex-1">
                {alerts.highestHumidity && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100 flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium text-red-700">
                          HIGHEST
                        </span>
                        <p className="font-medium text-sm text-gray-800">
                          {alerts.highestHumidity.device_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {alerts.highestHumidity.location || "Unknown "}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">
                          {parseFloat(alerts.highestHumidity.humidity).toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-500">
                          {alerts.highestHumidity.last_updated || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {alerts.lowestHumidity && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-medium text-blue-700">
                          LOWEST
                        </span>
                        <p className="font-medium text-sm text-gray-800">
                          {alerts.lowestHumidity.device_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {alerts.lowestHumidity.location || "Unknown "}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {parseFloat(alerts.lowestHumidity.humidity).toFixed(
                            1
                          )}
                          %
                        </div>
                        <div className="text-xs text-gray-500">
                          {alerts.lowestHumidity.last_updated || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sensor Status */}
          <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Sensor Status</h4>
                <p className="text-xs text-gray-500">
                  All PAG sensors operational
                </p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-green-700 font-medium text-sm">
                    ✓ All {data.length} PAG sensors reporting
                  </p>
                  <p className="text-green-600 text-xs">
                    Live data updated regularly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Updated chart tick formatter for JST display
  const chartTickFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  };

  // Updated tooltip label formatter for JST display
  const chartLabelFormatter = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00 JST`;
  };

  // Toggle row expand function for graph display - 24 hour data
  const toggleRowExpand = async (sensorId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [sensorId]: !prev[sensorId],
    }));

    // If expanding and no data exists yet, fetch it
    if (!expandedRows[sensorId] && !graphData[sensorId]) {
      setIsLoadingGraphData((prev) => ({ ...prev, [sensorId]: true }));
      try {
        // Get past 24 hours of data - need yesterday and today
        const currentDate = getCurrentJSTDate();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const startDate = yesterdayDate.toISOString().split("T")[0];

        const response = await fetch(
          `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/hourly?start_date=${startDate}&end_date=${currentDate}`
        );
        const allData = await response.json();

        // Filter data for just this sensor
        let sensorData = allData
          .filter((item) => item.device_name === sensorId)
          .map((item) => {
            // Convert UTC timestamp to Date object
            const utcDate = new Date(item.hour);

            // Calculate JST hour (UTC+8)
            const jstHour = (utcDate.getUTCHours() + 9) % 24;

            const parseAndRound = (value) => {
              const parsed = parseFloat(value);
              return parsed ? Number(parsed.toFixed(2)) : parsed;
            };

            return {
              timestamp: utcDate,
              hour: jstHour,
              temperature: parseAndRound(item.avg_temperature),
              humidity: parseAndRound(item.avg_humidity),
              co2: parseAndRound(item.avg_co2),
              pm2_5: parseAndRound(item.avg_pm2_5),
              pm10: parseAndRound(item.avg_pm10),
              pressure: parseAndRound(item.avg_pressure),
              light_level: parseAndRound(item.avg_light),
              tvoc: parseAndRound(item.avg_tvoc),
            };
          });

        // Sort by timestamp in ascending order
        sensorData.sort((a, b) => a.timestamp - b.timestamp);

        // Get current time and calculate cutoff time (24 hours ago)
        const now = new Date();
        const cutoffTime = new Date(now);
        cutoffTime.setHours(cutoffTime.getHours() - 24);

        // Filter to only include data from the last 24 hours
        sensorData = sensorData.filter((item) => item.timestamp >= cutoffTime);

        // Group by JST hour to get latest reading for each hour
        const hourlyData = {};
        sensorData.forEach((item) => {
          const hourKey = item.hour;

          // If we haven't stored this hour yet, or this is a newer timestamp for the same hour
          if (
            !hourlyData[hourKey] ||
            item.timestamp > hourlyData[hourKey].timestamp
          ) {
            hourlyData[hourKey] = item;
          }
        });

        // Convert back to array
        const uniqueHourlyData = Object.values(hourlyData);

        // Sort by hour for display
        uniqueHourlyData.sort((a, b) => a.hour - b.hour);

        setGraphData((prev) => ({ ...prev, [sensorId]: uniqueHourlyData }));
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setIsLoadingGraphData((prev) => ({ ...prev, [sensorId]: false }));
      }
    }
  };

  // Sensor Graph Component - 24 hour data like original
  const SensorGraph = ({ data, sensorId }) => {
    if (!data || data.length === 0) {
      return <div className="p-4 text-center">No data available</div>;
    }

    // Get current JST hour
    const now = new Date();
    const currentHourJST = (now.getUTCHours() + 9) % 24;

    // Fill in missing hours with null values to ensure proper display
    const completeHourlyData = [];

    // Start from 24 hours ago
    const startHour = (currentHourJST + 1) % 24; // One hour after current hour to go back 24 hours

    for (let i = 0; i < 24; i++) {
      const hour = (startHour + i) % 24;

      // Find if we have data for this hour
      const hourData = data.find((item) => item.hour === hour);

      if (hourData) {
        completeHourlyData.push(hourData);
      } else {
        // Add placeholder with just the hour
        completeHourlyData.push({
          hour: hour,
          temperature: null,
          humidity: null,
          co2: null,
          pm2_5: null,
          pm10: null,
          tvoc: null,
          pressure: null,
          light_level: null,
        });
      }
    }

    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature, Humidity & CO2 Chart - always show for all PAG sensors */}
        <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
          <h3 className="text-lg font-medium mb-2">
            Environmental Metrics (Past 24 Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={completeHourlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hour"
                label={{
                  value: "Hour",
                  position: "insideBottomRight",
                  offset: -5,
                }}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis
                yAxisId="temp"
                orientation="left"
                stroke="#FF9933"
                label={{
                  value: "Temperature °C",
                  angle: -90,
                  dx: 18,
                  dy: 35,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="humidity"
                orientation="left"
                stroke="#0066CC"
                label={{
                  value: "Humidity %",
                  angle: -90,
                  dx: -40,
                  dy: -60,
                  position: "insideRight",
                }}
              />
              <YAxis
                yAxisId="co2"
                orientation="right"
                stroke="#7a3015"
                label={{
                  value: "CO2 (ppm)",
                  angle: 90,
                  dx: 40,
                  dy: 30,
                  position: "insideRight",
                  offset: 40,
                }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (value === null) return ["No data", name];
                  if (name === "temperature")
                    return [`${value.toFixed(1)}°C`, "Temperature"];
                  if (name === "humidity")
                    return [`${value.toFixed(1)}%`, "Humidity"];
                  if (name === "co2") return [`${value.toFixed(1)} ppm`, "CO2"];
                  return [value, name];
                }}
                labelFormatter={(hour) => `${hour}:00 JST`}
              />
              <Legend />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#FF9933"
                dot={false}
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                dot={false}
                stroke="#0066CC"
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                yAxisId="co2"
                type="monotone"
                dataKey="co2"
                name="CO2"
                dot={false}
                stroke="#ab4f2e"
                strokeWidth={2}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Air Quality Chart - PM2.5, PM10, TVOC */}
        <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
          <h3 className="text-lg font-medium mb-2">
            Air Quality (Past 24 Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={completeHourlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hour"
                label={{
                  value: "Hour",
                  position: "insideBottomRight",
                  offset: -5,
                }}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "μg/m³ / ppb",
                  angle: -90,
                  position: "insideLeft",
                }}
                stroke="#8884d8"
              />
              <Tooltip
                formatter={(value, name) => {
                  if (value === null) return ["No data", name];
                  if (name === "pm2_5")
                    return [`${value.toFixed(2)} μg/m³`, "PM2.5"];
                  if (name === "pm10")
                    return [`${value.toFixed(1)} μg/m³`, "PM10"];
                  if (name === "tvoc") return [`${value.toFixed(1)}`, "TVOC"];
                  return [value, name];
                }}
                labelFormatter={(hour) => `${hour}:00 JST`}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pm2_5"
                name="PM2.5"
                dot={false}
                stroke="#8884d8"
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="pm10"
                name="PM10"
                dot={false}
                stroke="#b300b3"
                strokeWidth={2}
                connectNulls={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="tvoc"
                name="TVOC"
                dot={false}
                stroke="#ffc633"
                strokeWidth={2}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Pre-fetch all sensor graph data - 24 hour data
  useEffect(() => {
    const fetchAllSensorData = async () => {
      try {
        // Get past 24 hours of data - need yesterday and today
        const currentDate = getCurrentJSTDate();
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const startDate = yesterdayDate.toISOString().split("T")[0];

        const response = await fetch(
          `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/hourly?start_date=${startDate}&end_date=${currentDate}`
        );
        const allData = await response.json();

        // Get current time and calculate cutoff time (24 hours ago)
        const now = new Date();
        const cutoffTime = new Date(now);
        cutoffTime.setHours(cutoffTime.getHours() - 24);

        // Group data by sensor ID
        const groupedData = {};

        allData.forEach((item) => {
          if (!item.device_name || !item.device_name.startsWith("PAG-IAQ-")) {
            return; // Skip non-PAG sensors
          }

          const sensorId = item.device_name;
          const utcDate = new Date(item.hour);

          // Skip if data is older than 24 hours
          if (utcDate < cutoffTime) {
            return;
          }

          if (!groupedData[sensorId]) {
            groupedData[sensorId] = [];
          }

          const jstHour = (utcDate.getUTCHours() + 9) % 24;

          const parseAndRound = (value) => {
            const parsed = parseFloat(value);
            return parsed ? Number(parsed.toFixed(2)) : parsed;
          };

          groupedData[sensorId].push({
            timestamp: utcDate,
            hour: jstHour,
            temperature: parseAndRound(item.avg_temperature),
            humidity: parseAndRound(item.avg_humidity),
            co2: parseAndRound(item.avg_co2),
            pm2_5: parseAndRound(item.avg_pm2_5),
            pm10: parseAndRound(item.avg_pm10),
            pressure: parseAndRound(item.avg_pressure),
            light_level: parseAndRound(item.avg_light),
            tvoc: parseAndRound(item.avg_tvoc),
          });
        });

        // Process each sensor's data to get latest reading for each hour
        Object.keys(groupedData).forEach((sensorId) => {
          // Sort chronologically first
          groupedData[sensorId].sort((a, b) => a.timestamp - b.timestamp);

          // Deduplicate by hour (keep latest reading for each hour)
          const hourlyData = {};
          groupedData[sensorId].forEach((item) => {
            const hourKey = item.hour;
            if (
              !hourlyData[hourKey] ||
              item.timestamp > hourlyData[hourKey].timestamp
            ) {
              hourlyData[hourKey] = item;
            }
          });

          // Replace with deduplicated data
          groupedData[sensorId] = Object.values(hourlyData);

          // Sort by hour for consistent display
          groupedData[sensorId].sort((a, b) => a.hour - b.hour);
        });

        setGraphData(groupedData);
      } catch (error) {
        console.error("Error pre-fetching sensor data:", error);
      }
    };

    fetchAllSensorData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchAllSensorData, 300000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch device locations - keeping this for backward compatibility if needed
  useEffect(() => {
    const fetchDeviceLocations = async () => {
      try {
        const response = await fetch(
          "https://lnudevices-dot-optimus-hk.df.r.appspot.com/devices"
        );
        const devices = await response.json();

        const locationMapping = {};
        const areaIdMapping = {};
        devices.forEach((device) => {
          locationMapping[device.device_id] = device.location;
          areaIdMapping[device.device_id] = device.area;
        });

        setDeviceLocations(locationMapping);
        setDeviceAreaIds(areaIdMapping);
      } catch (error) {
        console.error("Error fetching device locations:", error);
        setIsLoading(false);
      }
    };

    fetchDeviceLocations();
  }, []);

  // Main data fetching effect - Updated to use live endpoint
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the live endpoint instead of the date-based one
        const response = await fetch(
          `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq-live`
        );
        const result = await response.json();

        // Filter out entries without device_name and get only PAG sensors
        const pagSensors = result.filter(
          (item) => item.device_name && item.device_name.startsWith("PAG-IAQ-")
        );

        // Convert to array format expected by the table
        const dataArray = pagSensors.map((reading) => {
          return {
            id: reading.device_name,
            device_name: reading.device_name,
            temperature: reading.temperature,
            humidity: reading.humidity,
            co2: reading.co2,
            pm2_5: reading.pm2_5,
            pm10: reading.pm10,
            tvoc: reading.tvoc === 0 ? 1 : reading.tvoc,
            pressure: reading.pressure,
            light: reading.light,
            score: reading.score,
            timestamp: reading.timestamp,
            last_updated: reading.timestamp
              ? convertUTCToLocalTime(reading.timestamp)
              : "-",
            location: reading.area_id || "Unknown", // Use area_id as location
            area: reading.area_id || "Unknown",
          };
        });

        // Sort sensors by device name
        const sortedData = dataArray.sort((a, b) =>
          a.device_name.localeCompare(b.device_name)
        );

        // Calculate averages
        const columns = [
          "co2",
          "temperature",
          "humidity",
          "pressure",
          "pm10",
          "pm2_5",
          "tvoc",
        ];
        const avgs = {};

        columns.forEach((column) => {
          const values = sortedData
            .filter(
              (sensor) =>
                sensor[column] !== undefined &&
                sensor[column] !== null &&
                sensor[column] !== "-"
            )
            .map((sensor) => parseFloat(sensor[column]) || 0);

          if (values.length > 0) {
            avgs[column] =
              values.reduce((sum, val) => sum + val, 0) / values.length;
          } else {
            avgs[column] = 0;
          }
        });

        setData(sortedData);
        setColumnAverages(avgs);

        // Calculate average CO2
        const co2Values = sortedData
          .filter((sensor) => sensor.co2 !== undefined && sensor.co2 !== null)
          .map((sensor) => parseFloat(sensor.co2) || 0);

        if (co2Values.length > 0) {
          const avgCO2Value =
            co2Values.reduce((sum, val) => sum + val, 0) / co2Values.length;
          setAvgCO2(avgCO2Value);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PAG IAQ live data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every 1 min
    return () => clearInterval(interval);
  }, []);

  // Function to get AQI class based on sensor values
  const getAQIClass = (sensor) => {
    if (!sensor) return "bg-gray-100";

    const co2 = parseFloat(sensor.co2) || 0;
    const tvoc = parseFloat(sensor.tvoc) || 0;
    const pm2_5 = parseFloat(sensor.pm2_5) || 0;
    const pm10 = parseFloat(sensor.pm10) || 0;

    if (co2 > 1000 || tvoc > 610 || pm2_5 > 40.4 || pm10 > 154) {
      return "bg-red-100";
    }

    if (co2 > 800 || tvoc > 200 || pm2_5 > 15.4 || pm10 > 54) {
      return "bg-yellow-100";
    }

    return "bg-green-100";
  };

  // Function to check if sensor temperature is higher than HKO
  const isHigherThanHKO = (sensorTemp) => {
    if (!hkoTemperature || !sensorTemp) return false;
    return parseFloat(sensorTemp) > parseFloat(hkoTemperature);
  };

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key) {
      direction =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
    }
    setSortConfig({ key, direction });
  };

  // Function to get sorted data
  const getSortedData = (dataToSort) => {
    if (!sortConfig.key) return dataToSort;

    return [...dataToSort].sort((a, b) => {
      if (
        [
          "co2",
          "humidity",
          "temperature",
          "pm10",
          "pm2_5",
          "tvoc",
          "pressure",
          "light",
          "score",
        ].includes(sortConfig.key)
      ) {
        const aValue = parseFloat(a[sortConfig.key]) || 0;
        const bValue = parseFloat(b[sortConfig.key]) || 0;

        if (sortConfig.direction === "ascending") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedData = getSortedData(data);

  return (
    <div style={{ backgroundColor: "#f6f6f6", minHeight: "100vh" }}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <header className="bg-[#fbfbfb] h-16 lg:h-20 fixed top-0 left-0 w-full z-10 flex items-center justify-between shadow-lg">
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

      <main className="pt-20 lg:pt-[102px] px-4 sm:px-6 lg:px-8 mx-2">
        <div className="flex justify-between items-centr mb-8">
          <h2 className="sm:text-xl md:text-2xl lg:text-[24px] text-[22px] font-semibold">
            Indoor Air Quality
          </h2>
          <div className="flex  items-end space-x-4">
            <div className="text-[20px] text-gray-600 font-semibold">
              {new Date().toLocaleDateString("en-GB", {
                timeZone: "Asia/Tokyo",
                day: "numeric",
                month: "short",
                year: "numeric",
                weekday: "long",
              })}
            </div>
            <div className="text-[20px] text-gray-600 font-semibold">
              {new Date().toLocaleTimeString("ja-JP", {
                timeZone: "Asia/Tokyo",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Alert Area */}
        {!isLoading && data.length > 0 && (
          <AlertArea alerts={getAlertSensors()} />
        )}

        {/* Data Table */}
        {isLoading ? (
          // Loading state
          <div className="rounded-xl custom-s mb-8 border border-[#d4d4d4] overflow-hidden bg-white">
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading</p>
                <p className="text-gray-500 text-sm mt-2">Please wait</p>
              </div>
            </div>
          </div>
        ) : (
          // Existing table code
          <div
            className="rounded-xl custom-s mb-8 border border-[#d4d4d4] overflow-hidden"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Sensor</span>
                        <button
                          onClick={() => requestSort("device_name")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "device_name"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Location</span>
                        <button
                          onClick={() => requestSort("location")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "location"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Temperature (°C)</span>
                        <button
                          onClick={() => requestSort("temperature")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "temperature"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Humidity (%)</span>
                        <button
                          onClick={() => requestSort("humidity")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "humidity"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">CO₂ (ppm)</span>
                        <button
                          onClick={() => requestSort("co2")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "co2"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">PM2.5 (μg/m³)</span>
                        <button
                          onClick={() => requestSort("pm2_5")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "pm2_5"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">PM10 (μg/m³)</span>
                        <button
                          onClick={() => requestSort("pm10")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "pm10"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">TVOC</span>
                        <div className="relative group mr-1">
                          <Info className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-help" />
                          <div className="absolute z-10 hidden text-left group-hover:block bg-white border border-gray-400 text-grey-700 leading-4 text-xs rounded-lg p-2 w-64 -bottom-48 left-1/2 transform -translate-x-40 mb-2">
                            <div className="text-left flex">
                              <div className="text-left space-y-1 mb-3">
                                <div className="text-amber-700 font-medium">
                                  Displayed Number = TVOC Level
                                </div>
                         
                                <div>1: 100-199 </div>
                                <div>2: 200-299 </div>
                                <div>3: 300-399 </div>
                                <div>4: 400-499 </div>
                                <div>5: 500-599 </div>
                              </div>
                              <div className="text-left space-y-1 rota border-l border-gray-300 pl-4">
                                <div className="font-medium text-left text-blue-800">
                                  Air Quality:
                                </div>
                                <div>1: Very Good</div>
                                <div>2: Good</div>
                                <div>3: Medium</div>
                                <div>4: Poor</div>
                                <div>5-6: Bad</div>
                              </div>
                            </div>
                            <div className="absolute w-2 h-2 block bg-white transform border-l border-t border-gray-400 rotate-45 -top-1 left-[64%] -translate-x-1/2"></div>
                          </div>
                        </div>
                        <button
                          onClick={() => requestSort("tvoc")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "tvoc"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Light (lux)</span>
                        <button
                          onClick={() => requestSort("light")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "light"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>

                    <th className="px-3 py-4">
                      <div className="flex items-center justify-center">
                        <span className="mr-1">Last Updated</span>
                        <button
                          onClick={() => requestSort("last_updated")}
                          className="h-4 w-4 flex items-center justify-center"
                        >
                          <div
                            className={`w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent ${
                              sortConfig.key === "last_updated"
                                ? sortConfig.direction === "ascending"
                                  ? "border-b-black transform rotate-0"
                                  : "border-b-black transform rotate-180"
                                : "border-b-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {sortedData.map((sensor) => {
                    const rowClass = getAQIClass(sensor);
                    const isExpanded =
                      expandedRows[sensor.device_name] || false;

                    return (
                      <React.Fragment key={sensor.device_name}>
                        <tr
                          className={`${rowClass} cursor-pointer hover:bg-gray-50`}
                          onClick={() => toggleRowExpand(sensor.device_name)}
                        >
                          <td className="px-3 py-4 border-b border-gray-300 text-center text-sm sm:text-base">
                            {sensor.device_name}
                          </td>

                          <td className="text-center border-b border-gray-300 px-4 py-2">
                            {sensor.location}
                          </td>

                          <td
                            className={`px-3 py-4 border-b border-gray-300 text-center text-sm sm:text-base ${
                              isHigherThanHKO(sensor.temperature)
                                ? "text-red-600 font-medium"
                                : ""
                            }`}
                          >
                            {sensor.temperature
                              ? parseFloat(sensor.temperature).toFixed(1)
                              : "-"}
                            {isHigherThanHKO(sensor.temperature) && (
                              <span className="ml-1">↑</span>
                            )}
                          </td>

                          <td className="px-3 py-4 border-b border-gray-300 text-center text-sm sm:text-base">
                            {sensor.humidity
                              ? parseFloat(sensor.humidity).toFixed(1)
                              : "-"}
                          </td>

                          <td className="px-3 py-4 border-b border-gray-300 text-center text-sm sm:text-base">
                            {sensor.co2
                              ? parseFloat(sensor.co2).toFixed(0)
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-center text-sm sm:text-base border-b border-gray-300">
                            {sensor.pm2_5
                              ? parseFloat(sensor.pm2_5).toFixed(1)
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-center text-sm sm:text-base border-b border-gray-300">
                            {sensor.pm10
                              ? parseFloat(sensor.pm10).toFixed(1)
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-center text-sm sm:text-base border-b border-gray-300">
                            {sensor.tvoc || "-"}
                          </td>

                          <td className="px-3 py-4 text-center text-sm sm:text-base border-b border-gray-300">
                            {sensor.light
                              ? parseFloat(sensor.light).toFixed(0)
                              : "-"}
                          </td>

                          <td className="px-3 py-4 text-center text-sm sm:text-base border-b border-gray-300">
                            {sensor.last_updated || "-"}
                          </td>

                          <td className="px-3 py-4 border-b border-gray-300 text-center">
                            <ChevronRight
                              className={`h-5 w-5 text-gray-600 transition-transform ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                            />
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr>
                            <td
                              colSpan="11"
                              className="border-b border-gray-300 bg-gray-50 p-0"
                            >
                              {isLoadingGraphData[sensor.device_name] ? (
                                <div className="p-8 text-center">
                                  <p>Loading</p>
                                </div>
                              ) : (
                                <SensorGraph
                                  data={graphData[sensor.device_name] || []}
                                  sensorId={sensor.device_name}
                                />
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-3 border-t border-gray-300 bg-white">
              <div className="text-[12px] sm:text-[12px] md:text-sm text-gray-600">
                Total PAG sensors: {sortedData.length} | Last updated:{" "}
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default IAQ;
