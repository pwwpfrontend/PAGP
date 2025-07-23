import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ThermometerSun, Droplets, Wind, Info } from "lucide-react";

// Colors for charts
const COLORS = [
  "#C0444E",
  "#909191",
  "#0088FE",
  "#82C0CC",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
];

const getTVOCLevel = (tvocValue) => {
  if (tvocValue === 0) return 1;
  if (tvocValue < 100) return 1;
  return Math.floor(tvocValue / 100);
};

const REFRESH_INTERVAL = 30000;

// CO2 threshold levels for color coding
const CO2_LEVELS = {
  GOOD: 700,
  MODERATE: 1000,
  HIGH: 1500,
};

// Temperature threshold levels for color coding
const TEMP_LEVELS = {
  LOW: 20,
  NORMAL: 31,
};

// Humidity threshold levels for color coding
const HUMIDITY_LEVELS = {
  LOW: 40,
  NORMAL: 70,
};

// Color for CO2 value
const getCO2Color = (value) => {
  if (value < CO2_LEVELS.GOOD) return "#4CAF50"; // Good - Green
  if (value < CO2_LEVELS.MODERATE) return "#FF9800"; // Moderate - Yellow
  if (value < CO2_LEVELS.HIGH) return "#F44336"; // Orangish-red
  return "#F44336"; // Bad - Orangish-red
};

// Color for temperature value
const getTempColor = (value) => {
  if (value < TEMP_LEVELS.LOW) return "#4CAF50"; // Good - Green
  if (value <= TEMP_LEVELS.NORMAL) return "#FF9800"; // Normal - Yellow
  return "#F44336"; // Warm - Orangish-red
};

// Color for humidity value
const getHumidityColor = (value) => {
  if (value < HUMIDITY_LEVELS.LOW) return "#4CAF50"; // Dry - Green
  if (value <= HUMIDITY_LEVELS.NORMAL) return "#FF9800"; // Normal - Yellow
  return "#F44336"; // Humid - Orangish-red
};

// Get status label for CO2 value
const getCO2Status = (value) => {
  if (value < CO2_LEVELS.GOOD) return "Good";
  if (value < CO2_LEVELS.MODERATE) return "Moderate";
  if (value < CO2_LEVELS.HIGH) return "Poor";
  return "Bad";
};

// Get status label for temperature value
const getTempStatus = (value) => {
  if (value < TEMP_LEVELS.LOW) return "Cold";
  if (value <= TEMP_LEVELS.NORMAL) return "Normal";
  return "Warm";
};

// Get status label for humidity value
const getHumidityStatus = (value) => {
  if (value < HUMIDITY_LEVELS.LOW) return "Dry";
  if (value <= HUMIDITY_LEVELS.NORMAL) return "Normal";
  return "Humid";
};

// Format time for display
const formatTimeDisplay = (date) => {
  return `${String(date.getHours()).padStart(2, "0")}:00`;
};

// Format date for display (DD-MM)
const formatDateDisplay = (date) => {
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

// Convert UTC to HKT (UTC+8)
const convertToHKT = (utcDateString) => {
  const utcDate = new Date(utcDateString);
  const utcYear = utcDate.getUTCFullYear();
  const utcMonth = utcDate.getUTCMonth();
  const utcDay = utcDate.getUTCDate();
  const utcHour = utcDate.getUTCHours();

  const hktDate = new Date(Date.UTC(utcYear, utcMonth, utcDay, utcHour + 8));
  return hktDate;
};

// Format date and time for tooltip
const formatDateTimeForTooltip = (utcDateString) => {
  const utcDate = new Date(utcDateString);
  const utcHour = utcDate.getUTCHours();
  const hktHour = (utcHour + 8) % 24;
  const hktTime = `${String(hktHour).padStart(2, "0")}:00`;
  return `${hktTime}`;
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed(2)}
            {entry.name === "Temperature"
              ? "°C"
              : entry.name === "Humidity"
              ? "%"
              : entry.name === "CO2"
              ? " ppm"
              : entry.name === "PM2.5" || entry.name === "pm2_5"
              ? " µg/m³"
              : entry.name === "PM10" || entry.name === "pm10"
              ? " µg/m³"
              : entry.name === "TVOC" || entry.name === "tvoc"
              ? ""
              : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Sensor metric card component with pie chart
const SensorMetricCard = ({ title, value, unit, type, icon, color }) => {
  // Calculate percentage for the pie chart based on ranges
  let percentage = 0;
  let statusLabel = "";

  if (type === "co2") {
    percentage = Math.min(100, (value / 2000) * 100);
    statusLabel = getCO2Status(value);
  } else if (type === "temp") {
    percentage = Math.min(100, Math.max(0, ((value - 15) / 25) * 100));
    statusLabel = getTempStatus(value);
  } else if (type === "humidity") {
    percentage = Math.min(100, Math.max(0, value));
    statusLabel = getHumidityStatus(value);
  }

  const pieData = [
    { name: title, value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {icon}
      </div>
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="cell-0" fill={color} />
              <Cell key="cell-1" fill="#f3f4f6" />
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan
                x="50%"
                dy="-5"
                className="text-2xl font-bold"
                fill={color}
              >
                {typeof value === "number" ? value.toFixed(1) : "N/A"}
              </tspan>
              <tspan x="50%" dy="25" className="text-sm" fill="#6b7280">
                {unit}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-center">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-sm">{statusLabel}</span>
        </div>
      </div>
    </div>
  );
};

const IAQAnalytics = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Report type and date selection
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  const [selectedDevice, setSelectedDevice] = useState("all");
const [availableDevices, setAvailableDevices] = useState([]);

  // Data states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hourlyDataPoints, setHourlyDataPoints] = useState([]);
  const [dailyDataPoints, setDailyDataPoints] = useState([]);
  const [averageMetrics, setAverageMetrics] = useState({
    co2: 0,
    temp: 0,
    humidity: 0,
    pm2_5: 0,
    pm10: 0,
    tvoc: 0,
  });

  // Format dates for API call
  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0];
  };

  // Get date range based on report type
  const getDateRange = () => {
    if (reportType === "daily") {
      return {
        fromDate: formatDateForAPI(selectedDate),
        toDate: formatDateForAPI(selectedDate),
      };
    } else if (reportType === "weekly") {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return {
        fromDate: formatDateForAPI(weekStart),
        toDate: formatDateForAPI(weekEnd),
      };
    } else if (reportType === "monthly") {
      const [year, month] = currentMonth.split("-");
      const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      return {
        fromDate: formatDateForAPI(monthStart),
        toDate: formatDateForAPI(monthEnd),
        month: currentMonth,
      };
    } else {
      // Custom date range
      return {
        fromDate: formatDateForAPI(customStartDate),
        toDate: formatDateForAPI(customEndDate),
      };
    }
  };

  // Apply the selected date range
  const applyDateRange = () => {
    if (reportType === "custom") {
      setStartDate(customStartDate);
      setEndDate(customEndDate);
    }
    fetchIAQData();
  };

  // Export CSV function
  // Export CSV function
const exportToCSV = () => {
  try {
    let csvData = [];
    
    // Get the raw data and filter based on device selection
    const dateRange = getDateRange();
    let url;
    
    // We need to re-fetch or use the original data, not the processed chart data
    // For now, let's work with what we have and modify the logic
    
    if (selectedDevice === "all") {
      // Export individual device data when "all devices" selected
      // We need to get the original data again since chartData is aggregated
      fetchDataForExport();
      return;
    } else {
      // Export data for specific device
      if (reportType === "daily") {
        csvData = hourlyDataPoints.map(hour => ({
          'Device': selectedDevice,
          'Time': hour.displayTime,
          'CO2 (ppm)': hour.co2.toFixed(2),
          'Temperature (°C)': hour.temp.toFixed(2),
          'Humidity (%)': hour.humidity.toFixed(2),
          'PM2.5 (µg/m³)': hour.pm2_5.toFixed(2),
          'PM10 (µg/m³)': hour.pm10.toFixed(2),
          'TVOC': hour.tvoc
        }));
      } else {
        csvData = dailyDataPoints.map(day => ({
          'Device': selectedDevice,
          'Date': day.date,
          'CO2 (ppm)': day.co2.toFixed(2),
          'Temperature (°C)': day.temp.toFixed(2),
          'Humidity (%)': day.humidity.toFixed(2),
          'PM2.5 (µg/m³)': day.pm2_5.toFixed(2),
          'PM10 (µg/m³)': day.pm10.toFixed(2),
          'TVOC': day.tvoc
        }));
      }
    }
    
    if (csvData.length === 0) {
      alert('No data available for export');
      return;
    }
    
    const headers = Object.keys(csvData[0]);
    const tvocNote = [
      '# TVOC Level Information:',
      '# Displayed Number = TVOC Level',
      '# Range, 1: 100-199, 2: 200-299, 3: 300-399, 4: 400-499, 5: 500-599',
      '# Air Quality, 0-1: Very Good, 2: Good, 3: Medium, 4: Poor, 5-6: Bad',
      ''
    ].join('\n');

    const csvContent = [
      tvocNote,
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url_obj = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_obj;
    
    const dateRange_obj = getDateRange();
    const deviceName = selectedDevice === "all" ? "AllDevices" : selectedDevice;
    const filename = `PAG_IAQ_${deviceName}_${dateRange_obj.fromDate}_to_${dateRange_obj.toDate}.csv`;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url_obj);
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Error exporting data. Please try again.');
  }
};

// Add this new function to handle "all devices" export
const fetchDataForExport = async () => {
  try {
    const dateRange = getDateRange();
    let url;
    
    if (reportType === "daily") {
      url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/hourly?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
    } else {
      url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/daily?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (Array.isArray(data)) {
      // Filter for individual devices only (exclude aggregate data)
      const deviceData = data.filter((item) => item.device_name !== null);
      
      let csvData = [];
      
      deviceData.forEach((item) => {
        if (reportType === "daily") {
          const utcDate = new Date(item.hour);
          const hktHour = (utcDate.getUTCHours() + 8) % 24;
          const displayTime = `${String(hktHour).padStart(2, "0")}:00`;
          
          csvData.push({
            'Device': item.device_name,
            'Time': displayTime,
            'CO2 (ppm)': item.avg_co2.toFixed(2),
            'Temperature (°C)': item.avg_temperature.toFixed(2),
            'Humidity (%)': item.avg_humidity.toFixed(2),
            'PM2.5 (µg/m³)': item.avg_pm2_5.toFixed(2),
            'PM10 (µg/m³)': item.avg_pm10.toFixed(2),
            'TVOC': getTVOCLevel(item.avg_tvoc)
          });
        } else {
          const date = new Date(item.date);
          csvData.push({
            'Device': item.device_name,
            'Date': formatDateDisplay(date),
            'CO2 (ppm)': item.avg_co2.toFixed(2),
            'Temperature (°C)': item.avg_temperature.toFixed(2),
            'Humidity (%)': item.avg_humidity.toFixed(2),
            'PM2.5 (µg/m³)': item.avg_pm2_5.toFixed(2),
            'PM10 (µg/m³)': item.avg_pm10.toFixed(2),
            'TVOC': getTVOCLevel(item.avg_tvoc)
          });
        }
      });
      
      if (csvData.length === 0) {
        return;
      }
      
     // Group data by device
const groupedData = csvData.reduce((acc, row) => {
  const device = row.Device;
  if (!acc[device]) {
    acc[device] = [];
  }
  // Remove Device column from individual rows since we're separating by device
  const { Device, ...rowWithoutDevice } = row;
  acc[device].push(rowWithoutDevice);
  return acc;
}, {});

// Create CSV content with separate tables for each device
// Create CSV content with separate tables for each device
const tvocNote = [
  '# TVOC Level Information:',
  '# Displayed Number = TVOC Level',
  '# Range, 1: 100-199, 2: 200-299, 3: 300-399, 4: 400-499, 5: 500-599',
  '# Air Quality, 0-1: Very Good, 2: Good, 3: Medium, 4: Poor, 5-6: Bad',
  ''
].join('\n');

let csvContent = tvocNote;
const devices = Object.keys(groupedData).sort();

devices.forEach((device, index) => {
  // Add device header
  csvContent += `\nDevice: ${device}\n`;
  
  // Add table headers
  const headers = Object.keys(groupedData[device][0]);
  csvContent += headers.join(',') + '\n';
  
  // Add device data
  groupedData[device].forEach(row => {
    csvContent += headers.map(header => row[header]).join(',') + '\n';
  });
  
  // Add spacing between devices (except for last device)
  if (index < devices.length - 1) {
    csvContent += '\n';
  }
});
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url_obj = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_obj;
      
      const filename = `PAG_IAQ_AllDevices_${dateRange.fromDate}_to_${dateRange.toDate}.csv`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_obj);
    }
  } catch (error) {
    console.error('Error fetching data for export:', error);
    alert('Error fetching data for export. Please try again.');
  }
};

  // Initialize date ranges based on report type changes
  useEffect(() => {
    if (reportType === "daily") {
      setStartDate(selectedDate);
      setEndDate(selectedDate);
    } else if (reportType === "weekly") {
      const week_start = startOfWeek(selectedDate);
      const week_end = endOfWeek(selectedDate);
      setStartDate(week_start);
      setEndDate(week_end);
    } else if (reportType === "monthly") {
      const [year, month] = currentMonth.split("-");
      const monthDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const month_start = startOfMonth(monthDate);
      const month_end = endOfMonth(monthDate);
      setStartDate(month_start);
      setEndDate(month_end);
    } else if (reportType === "custom") {
      setCustomStartDate(startDate);
      setCustomEndDate(endDate);
    }
  }, [reportType, selectedDate, currentMonth]);

  // Fetch IAQ data based on report type
  const fetchIAQData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dateRange = getDateRange();
      let url;
      
      if (reportType === "daily") {
        // Use hourly endpoint for daily reports
        url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/hourly?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
      } else {
        // Use daily endpoint for weekly, monthly, custom
        url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/daily?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        processIAQData(data);
      }
    } catch (err) {
      console.error("Error fetching IAQ data:", err);
      setError("Failed to fetch IAQ data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process the IAQ data and calculate averages
const processIAQData = (data) => {
  // Get unique devices for dropdown
  const devices = [...new Set(data.filter(item => item.device_name).map(item => item.device_name))];
  setAvailableDevices(devices);

  // Filter data based on selected device
  let filteredData;
  if (selectedDevice === "all") {
    // Filter for aggregate data (device_name is null)
    filteredData = data.filter((item) => item.device_name === null);
  } else {
    // Filter for specific device
    filteredData = data.filter((item) => item.device_name === selectedDevice);
  }

  if (filteredData.length === 0) {
    setAverageMetrics({
      co2: 0,
      temp: 0,
      humidity: 0,
      pm2_5: 0,
      pm10: 0,
      tvoc: 0,
    });
    setHourlyDataPoints([]);
    setDailyDataPoints([]);
    return;
  }

  // Calculate average metrics
  let totalCO2 = 0;
  let totalTemp = 0;
  let totalHumidity = 0;
  let totalPM25 = 0;
  let totalPM10 = 0;
  let totalTVOC = 0;
  let count = filteredData.length;

  // Process data for charts
  let processedData = [];

  filteredData.forEach((item) => {
    totalCO2 += item.avg_co2;
    totalTemp += item.avg_temperature;
    totalHumidity += item.avg_humidity;
    totalPM25 += item.avg_pm2_5;
    totalPM10 += item.avg_pm10;
    totalTVOC += item.avg_tvoc;

    if (reportType === "daily") {
      // For daily reports, process hourly data
      const utcDate = new Date(item.hour);
      const hktHour = (utcDate.getUTCHours() + 8) % 24;
      const displayTime = `${String(hktHour).padStart(2, "0")}:00`;
      
      processedData.push({
        hour: item.hour,
        displayTime: displayTime,
        co2: item.avg_co2,
        temp: item.avg_temperature,
        humidity: item.avg_humidity,
        pm2_5: item.avg_pm2_5,
        pm10: item.avg_pm10,
        tvoc: getTVOCLevel(item.avg_tvoc),
        utcHour: utcDate.getUTCHours(),
        rawTimestamp: utcDate,
      });
    } else {
      // For other reports, process daily data
      const date = new Date(item.date);
      processedData.push({
        date: formatDateDisplay(date),
        day: item.date.split("T")[0],
        co2: item.avg_co2,
        temp: item.avg_temperature,
        humidity: item.avg_humidity,
        pm2_5: item.avg_pm2_5,
        pm10: item.avg_pm10,
        tvoc: getTVOCLevel(item.avg_tvoc),
      });
    }
  });

  // Sort data
  if (reportType === "daily") {
    processedData.sort((a, b) => a.rawTimestamp - b.rawTimestamp);
    setHourlyDataPoints(processedData);
    setDailyDataPoints([]);
  } else {
    processedData.sort((a, b) => new Date(a.day) - new Date(b.day));
    setDailyDataPoints(processedData);
    setHourlyDataPoints([]);
  }

  // Set average metrics
  setAverageMetrics({
    co2: count > 0 ? totalCO2 / count : 0,
    temp: count > 0 ? totalTemp / count : 0,
    humidity: count > 0 ? totalHumidity / count : 0,
    pm2_5: count > 0 ? totalPM25 / count : 0,
    pm10: count > 0 ? totalPM10 / count : 0,
    tvoc: count > 0 ? getTVOCLevel(totalTVOC / count) : 0,
  });
};

  // Auto-refresh functionality
  const refreshIAQDataSilently = async () => {
    try {
      const dateRange = getDateRange();
      let url;
      
      if (reportType === "daily") {
        url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/hourly?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
      } else {
        url = `https://pagiaq-dot-optimus-hk.df.r.appspot.com/pag/iaq/daily?start_date=${dateRange.fromDate}&end_date=${dateRange.toDate}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        processIAQData(data);
      }
    } catch (err) {
      console.error("Error refreshing IAQ data:", err);
    }
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    fetchIAQData();
  }, [reportType, selectedDate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing data...");
      refreshIAQDataSilently();
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [reportType, selectedDate]);

  // Get date display string based on report type
  // Get date display string based on report type
const getDateDisplayString = () => {
  const dateRange = getDateRange();
  let dateString = "";

  if (reportType === "daily") {
    const date = new Date(dateRange.fromDate);
    dateString = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  } else if (reportType === "weekly") {
    const fromDate = new Date(dateRange.fromDate);
    const toDate = new Date(dateRange.toDate);
    dateString = `${formatDateDisplay(fromDate)} to ${formatDateDisplay(
      toDate
    )} (Weekly)`;
  } else if (reportType === "monthly") {
    const [year, month] = dateRange.month.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    dateString = `${monthNames[parseInt(month) - 1]} ${year} (Monthly)`;
  } else {
    const fromDate = new Date(dateRange.fromDate);
    const toDate = new Date(dateRange.toDate);
    dateString = `${formatDateDisplay(fromDate)} to ${formatDateDisplay(
      toDate
    )} (Custom)`;
  }

  // Add device filter information
  const deviceString = selectedDevice === "all" ? "All Devices" : selectedDevice;
  return `${dateString} - ${deviceString}`;
};


  // Get chart data based on report type
  const chartData = reportType === "daily" ? hourlyDataPoints : dailyDataPoints;
  const xAxisKey = reportType === "daily" ? "displayTime" : "date";

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
          alt="PAG Logo"
          className="h-6 sm:h-10 lg:h-12 xl:h-14 mx-auto"
        />
      </header>

      {/* Main Content */}
      <main className="pt-2 pb-12">
        <div className="max-w-9xl mx-auto">
          {/* Controls Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end">
                {/* Report Type */}
                <div className="mb-4 md:mb-0">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Report Type
                  </label>
                  <div className="flex space-x-2">
                    <button
                      className={`px-4 py-2 rounded-md ${
                        reportType === "daily"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setReportType("daily")}
                    >
                      Daily
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        reportType === "weekly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setReportType("weekly")}
                    >
                      Weekly
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        reportType === "monthly"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setReportType("monthly")}
                    >
                      Monthly
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md ${
                        reportType === "custom"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => setReportType("custom")}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                <div className="md:ml-12">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Sensors
                    </label>
                    <select
                      value={selectedDevice}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="all">All Devices</option>
                      {availableDevices.map(device => (
                        <option key={device} value={device}>
                          {device}
                        </option>
                      ))}
                    </select>
                  </div>

                {/* Date Selection */}
                <div className="md:ml-12">
                  {(reportType === "daily" || reportType === "weekly") && (
                    <div className="mb-4 md:mb-0">
                      <label className="text-sm text-gray-600 mb-1 block">
                        {reportType === "daily" ? "Select Date" : "Select Week"}
                      </label>
                      <div className="flex items-center relative">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          dateFormat="yyyy-MM-dd"
                          className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "monthly" && (
                    <div className="mb-4 md:mb-0">
                      <label className="text-sm text-gray-600 mb-1 block">
                        Select Month
                      </label>
                      <div className="flex items-center relative">
                        <input
                          type="month"
                          value={currentMonth}
                          onChange={(e) => setCurrentMonth(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "custom" && (
                    <div className="flex flex-col md:flex-row">
                      <div className="mb-4 md:mb-0 relative">
                        <label className="text-sm text-gray-600 mb-1 block">
                          Start Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={customStartDate}
                            onChange={(date) => setCustomStartDate(date)}
                            selectsStart
                            startDate={customStartDate}
                            endDate={customEndDate}
                            dateFormat="yyyy-MM-dd"
                            className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 md:mb-0 md:ml-6 relative">
                        <label className="text-sm text-gray-600 mb-1 block">
                          End Date
                        </label>
                        <div className="relative">
                          <DatePicker
                            selected={customEndDate}
                            onChange={(date) => setCustomEndDate(date)}
                            selectsEnd
                            startDate={customStartDate}
                            endDate={customEndDate}
                            minDate={customStartDate}
                            dateFormat="yyyy-MM-dd"
                            className="border border-gray-300 rounded-md px-3 py-2 pl-9"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={applyDateRange}
                >
                  Apply
                </button>
                
               
                  <button
                    className="px-4 py-2 rounded-md bg-transparent border-[2px] border-blue-500 text-blue-600 font-medium hover:bg-blue-600 hover:text-white"
                    onClick={exportToCSV}
                  >
                    Export CSV
                  </button>
                
              </div>
            </div>
          </div>

          {/* Date Range Banner */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <p className="text-blue-800 flex items-center">
              <svg
                className="pr-2"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="25"
                height="25"
                viewBox="0,0,256,256"
              >
                <g
                  fill="#0e4a98"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                >
                  <g transform="scale(5.12,5.12)">
                    <path d="M25,2c-12.6907,0 -23,10.3093 -23,23c0,12.69071 10.3093,23 23,23c12.69071,0 23,-10.30929 23,-23c0,-12.6907 -10.30929,-23 -23,-23zM25,4c11.60982,0 21,9.39018 21,21c0,11.60982 -9.39018,21 -21,21c-11.60982,0 -21,-9.39018 -21,-21c0,-11.60982 9.39018,-21 21,-21zM25,11c-1.65685,0 -3,1.34315 -3,3c0,1.65685 1.34315,3 3,3c1.65685,0 3,-1.34315 3,-3c0,-1.65685 -1.34315,-3 -3,-3zM21,21v2h1h1v13h-1h-1v2h1h1h4h1h1v-2h-1h-1v-15h-1h-4z"></path>
                  </g>
                </g>
              </svg>
              Showing PAG IAQ data for: {getDateDisplayString()}
            </p>
          </div>

          {/* IAQ Dashboard Content */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
              <p className="text-lg">Loading IAQ data...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              {/* Metrics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <SensorMetricCard
                  title="CO2 Level"
                  value={averageMetrics.co2}
                  unit="ppm"
                  type="co2"
                  color={getCO2Color(averageMetrics.co2)}
                  icon={<Wind className="h-6 w-6 text-gray-500" />}
                />
                <SensorMetricCard
                  title="Temperature"
                  value={averageMetrics.temp}
                  unit="°C"
                  type="temp"
                  color={getTempColor(averageMetrics.temp)}
                  icon={<ThermometerSun className="h-6 w-6 text-gray-500" />}
                />
                <SensorMetricCard
                  title="Humidity"
                  value={averageMetrics.humidity}
                  unit="%"
                  type="humidity"
                  color={getHumidityColor(averageMetrics.humidity)}
                  icon={<Droplets className="h-6 w-6 text-gray-500" />}
                />
              </div>

              {/* Main IAQ Charts */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {reportType === "daily" ? "Hourly" : "Daily"} IAQ Trends
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* CO2 Chart */}
                  <div>
                    <h3 className="text-base font-medium mb-2">
                      CO2 Levels (ppm)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="co2"
                          name="CO2"
                          stroke="#654236"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Temperature Chart */}
                  <div>
                    <h3 className="text-base font-medium mb-2">
                      Temperature (°C)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          name="Temperature"
                          stroke="#E25D31"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Humidity Chart */}
                  <div>
                    <h3 className="text-base font-medium mb-2">Humidity (%)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          name="Humidity"
                          stroke="#197BBD"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Additional Air Quality Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Additional Air Quality Metrics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PM2.5 Chart */}
                  <div>
                    <h3 className="text-base font-medium mb-2">PM2.5 (µg/m³)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="pm2_5"
                          name="PM2.5"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* PM10 Chart */}
                  <div>
                    <h3 className="text-base font-medium mb-2">PM10 (µg/m³)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="pm10"
                          name="PM10"
                          stroke="#FFBB28"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                 
                  {/* TVOC Chart */}
<div>
  <h3 className="text-base font-medium mb-2 flex items-center">
    TVOC
    <div className="relative group mr-1 ml-2">
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
  </h3>
  
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey={xAxisKey}
                          interval={
                            reportType === "monthly"
                              ? 4
                              : reportType === "custom"
                              ? Math.floor(chartData.length / 10)
                              : 0
                          }
                          tick={{ fontSize: 13 }}
                          tickFormatter={(value) =>
                            reportType === "daily"
                              ? value.split(":")[0].replace(/^0+/, "")
                              : value
                          }
                        />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="tvoc"
                          name="TVOC"
                          stroke="#DD7373"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
             </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default IAQAnalytics;