
import React, { useState, useEffect } from "react";
import OccupancyFilters from "./OccupancyFilters";
import OccupancyCharts from "./OccupancyCharts";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./Button";

const OccupancyAnalysis = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportType, setReportType] = useState("daily");
  const [dataType, setDataType] = useState("meeting_room");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [chartDataMap, setChartDataMap] = useState({});
  const [apiError, setApiError] = useState(null);
  
  // Initialize date range
  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({
    selectedDate: today,
    startDate: today,
    endDate: today
  });

  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  // API base URL
  const API_BASE_URL = "https://pagtest-dot-optimus-hk.df.r.appspot.com";

  // Enhanced logging function
  const logApiResponse = (endpoint, data) => {
    console.log(`=== API Response from ${endpoint} ===`);
    console.log("Raw data:", data);
    if (Array.isArray(data) && data.length > 0) {
      console.log("First item structure:", data[0]);
      console.log("Available keys:", Object.keys(data[0]));
    }
    console.log("=====================================");
  };

  // Helper function to safely parse numeric values
  const safeParseNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove % sign if present
      const cleanValue = value.replace('%', '').trim();
      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Helper function to format hour display
  const formatHour = (hour) => {
    const hourNum = safeParseNumber(hour);
    return `${String(hourNum).padStart(2, '0')}:00`;
  };

  // Filter data by data type (area_id pattern matching)
  const filterByDataType = (data) => {
    if (!data || !Array.isArray(data)) return [];
    
    const patterns = {
      meeting_room: /^PAG-33F/i,
      gym: /^Gym/i,
      phone_booth: /^PB/i
    };
    
    const pattern = patterns[dataType];
    if (!pattern) return data;
    
    const filtered = data.filter(item => item.area_id && pattern.test(item.area_id));
    console.log(`Filtered ${data.length} items to ${filtered.length} items for dataType: ${dataType}`);
    return filtered;
  };

  // Enhanced data processing for hourly reports
  const processHourlyData = (data) => {
    console.log("Processing hourly data for table:", data);
    
    if (!Array.isArray(data)) {
      console.error("Expected array for hourly data, got:", typeof data);
      return [];
    }

    const filteredData = filterByDataType(data);
    console.log("Filtered data for table processing:", filteredData);

    // Group data by area_id to aggregate hourly data for table display
    const groupedByAreaId = {};
    
    filteredData.forEach(item => {
      const areaId = item.area_id;
      if (!groupedByAreaId[areaId]) {
        groupedByAreaId[areaId] = {
          area_id: areaId,
          hours: [],
          total_occupancy: 0,
          total_occupancy_percentage: 0,
          count: 0
        };
      }
      
      const hour = safeParseNumber(item.hour || item.time_hour || item.current_hour || 0);
      const occupancy = safeParseNumber(item.occupancy || item.occupancy_count || item.current_occupancy || 0);
      const occupancyPercentage = safeParseNumber(item.occupancy_percentage?.replace('%', '') || 0);
      
      groupedByAreaId[areaId].hours.push({
        hour,
        occupancy,
        occupancy_percentage: occupancyPercentage
      });
      
      groupedByAreaId[areaId].total_occupancy += occupancy;
      groupedByAreaId[areaId].total_occupancy_percentage += occupancyPercentage;
      groupedByAreaId[areaId].count++;
    });

    // Convert grouped data to table format
    const processedData = Object.values(groupedByAreaId).map(group => {
      // Calculate the average occupancy percentage for business hours (9 to 17)
      const businessHours = group.hours.filter(h => h.hour >= 9 && h.hour <= 17);
      const totalPercent = businessHours.reduce((sum, h) => sum + h.occupancy_percentage, 0);
      const avgOccupancyPercent = businessHours.length ? (totalPercent / 9) : 0;
      
      console.log(`Table data for ${group.area_id}:`, {
        avgOccupancyPercent,
        totalHours: group.hours.length
      });
      
      return {
        area_id: group.area_id,
        occupancy: group.total_occupancy,
        occupancy_percentage: avgOccupancyPercent.toFixed(2) + '%',
        date: dateRange.selectedDate,
        all_hours_data: group.hours,
        raw_item: group
      };
    });

    console.log("Final processed hourly table data:", processedData);
    return processedData;
  };

  // Enhanced data processing for daily/weekly/custom reports
  const processDailyData = (data) => {
    console.log("Processing daily data:", data);
    
    if (!Array.isArray(data)) {
      console.error("Expected array for daily data, got:", typeof data);
      return [];
    }

    const filteredData = filterByDataType(data);
    console.log("Filtered data for daily processing:", filteredData);

    const processedData = filteredData.map((item, index) => {
      console.log(`Processing daily item ${index}:`, item);
      
      // Try different possible field names
      const avgOccupancy = item.average_hourly_occupancy || 
                          item.avg_occupancy || 
                          item.occupancy_average ||
                          safeParseNumber(item.occupancy_percentage);
      
      const occupancyPercentage = item.occupancy_percentage || 
                                 item.percentage || 
                                 `${avgOccupancy}%`;

      // Convert UTC to JST if date exists
      let processedDate = new Date().toISOString();
      if (item.date) {
        try {
          const utcDate = new Date(item.date);
          const jstDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
          processedDate = jstDate.toISOString();
        } catch (e) {
          console.warn("Error processing date:", item.date, e);
        }
      }

      const processed = {
        area_id: item.area_id || `Unknown-${index}`,
        average_hourly_occupancy: avgOccupancy.toString(),
        occupancy_percentage: occupancyPercentage,
        date: processedDate,
        raw_item: item // Keep original for debugging
      };

      console.log(`Processed daily item ${index}:`, processed);
      return processed;
    });

    console.log("Final processed daily data:", processedData);
    return processedData;
  };

  // Fetch chart data for expanded rows
  const fetchChartData = async (areaId) => {
    try {
      let url, data;
      
      if (reportType === "daily") {
        // Use the existing table data that contains all_hours_data for this area
        const tableItem = tableData.find(item => item.area_id === areaId);
        
        if (tableItem && tableItem.all_hours_data) {
          console.log(`Using existing hourly data for ${areaId}:`, tableItem.all_hours_data);
          
          // For daily reports, show full business hours from 9:00 to 17:00 (9 AM to 5 PM)
          const startHour = 9;
          const endHour = 17;
          
          // Always show full business hours regardless of current time
          const displayEndHour = endHour;
          
          console.log(`Display hours range: ${startHour} to ${displayEndHour}`);
          
          const businessHoursData = [];
          for (let hour = startHour; hour <= displayEndHour; hour++) {
            businessHoursData.push({
              hour: hour,
              hour_display: formatHour(hour),
              occupancy: 0
            });
          }
          
          // Fill in actual data from table's all_hours_data
          tableItem.all_hours_data.forEach(hourData => {
            const hour = safeParseNumber(hourData.hour);
            if (hour >= startHour && hour <= displayEndHour) {
              const index = hour - startHour;
              if (index >= 0 && index < businessHoursData.length) {
                businessHoursData[index].occupancy = hourData.occupancy_percentage;
              }
            }
          });
          
          console.log(`Hourly chart data for ${areaId}:`, businessHoursData);
          
          setChartDataMap(prev => ({
            ...prev,
            [areaId]: businessHoursData
          }));
          
          return; // Exit early since we used table data
        }
        
        // Fallback: fetch from API if table data doesn't have all_hours_data
        console.log(`Fetching fresh hourly data for ${areaId} from API`);
        const selectedDate = new Date(dateRange.selectedDate);
        const startTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
        const endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        
        url = `${API_BASE_URL}/api/hour-data?area_id=${encodeURIComponent(areaId)}&start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        
        if (Array.isArray(data)) {
          // For daily reports, show full business hours from 9:00 to 17:00 (9 AM to 5 PM)
          const startHour = 9;
          const endHour = 17;
          
          // Always show full business hours regardless of current time
          const displayEndHour = endHour;
          
          const businessHoursData = [];
          for (let hour = startHour; hour <= displayEndHour; hour++) {
            businessHoursData.push({
              hour: hour,
              hour_display: formatHour(hour),
              occupancy: 0
            });
          }
          
          // Fill in actual data from API
          data.forEach(item => {
            const hour = safeParseNumber(item.hour);
            if (hour >= startHour && hour <= displayEndHour) {
              const index = hour - startHour;
              if (index >= 0 && index < businessHoursData.length) {
                // API returns occupancy_percentage as "25%", convert to number for charts
                const occupancyValue = parseFloat((item.occupancy_percentage || '0%').replace('%', ''));
                businessHoursData[index].occupancy = occupancyValue;
              }
            }
          });
          
          console.log(`Hourly chart data for ${areaId}:`, businessHoursData);
          
          setChartDataMap(prev => ({
            ...prev,
            [areaId]: businessHoursData
          }));
        }
      } else {
        // For daily, weekly, monthly, custom - all use daily-average-occupancy
        const startTime = new Date(dateRange.startDate + 'T00:00:00.000Z');
        const endTime = new Date(dateRange.endDate + 'T23:59:59.000Z');
        
        url = `${API_BASE_URL}/api/daily-average-occupancy?area_id=${encodeURIComponent(areaId)}&start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        data = await response.json();
        
        if (Array.isArray(data)) {
          const chartData = data.map(item => {
            const date = new Date(item.date);
            return {
              date: item.date,
              date_display: `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}`,
              // Use occupancy_percentage for chart display
              occupancy: parseFloat((item.occupancy_percentage || '0%').replace('%', ''))
            };
          }).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          setChartDataMap(prev => ({
            ...prev,
            [areaId]: chartData
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching chart data for ${areaId}:`, error);
    }
  };

  // Test API connection function
  const testApiConnection = async () => {
    console.log("Testing API connection...");
    try {
      // Test with a simple API call to see if the endpoint is working
      const testUrl = `${API_BASE_URL}/api/hour-data?start_time=2025-07-25T00:00:00.000Z&end_time=2025-07-25T23:59:59.000Z`;
      console.log("Test URL:", testUrl);
      
      const response = await fetch(testUrl);
      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Test API response:", data);
      console.log("Response type:", typeof data);
      console.log("Is array:", Array.isArray(data));
      
      if (Array.isArray(data) && data.length > 0) {
        console.log("Sample item from API:", data[0]);
        console.log("Available fields:", Object.keys(data[0]));
        
        // Test filtering
        const filtered = filterByDataType(data);
        console.log("After filtering by dataType:", filtered.length, "items");
        if (filtered.length > 0) {
          console.log("Sample filtered item:", filtered[0]);
        }
      }
      
      return data;
    } catch (error) {
      console.error("API test failed:", error);
      return null;
    }
  };

  // Enhanced main data fetching function
  const fetchData = async () => {
    setIsLoading(true);
    setApiError(null);
    console.log(`\n=== Starting ${reportType} data fetch ===`);
    console.log("Date range:", dateRange);
    console.log("Data type:", dataType);
    
    try {
      let url, data;
      
      if (reportType === "daily") {
        console.log("Fetching hourly data...");
        
        // Use the selected date for hourly reports
        const selectedDate = new Date(dateRange.selectedDate);
        
        // For hourly reports, get a wider time range to ensure we capture data
        let startTime, endTime;
        
        if (dateRange.selectedDate === today) {
          // Current day - get full day data, not just current hour
          startTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
          endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
          console.log(`Using full day for today to get more data`);
        } else {
          // Past date - get full day data
          startTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
          endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
          console.log(`Using full day for selected date: ${dateRange.selectedDate}`);
        }
        
        url = `${API_BASE_URL}/api/hour-data?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`;
        console.log("Hourly URL:", url);
        console.log("Date range being used:", {
          selectedDate: dateRange.selectedDate,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString()
        });
        
        const response = await fetch(url);
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        data = await response.json();
        
        logApiResponse("hour-data", data);
        
        if (Array.isArray(data)) {
          console.log(`Received ${data.length} items from API`);
          
          // Log unique area_ids to see what's available
          const uniqueAreaIds = [...new Set(data.map(item => item.area_id))];
          console.log("Unique area_ids from API:", uniqueAreaIds);
          
          const processedData = processHourlyData(data);
          console.log(`Processed data contains ${processedData.length} items`);
          
          if (processedData.length === 0) {
            console.warn("No data after processing and filtering!");
            console.log("Original data sample:", data.slice(0, 3));
            console.log("Data type filter pattern:", dataType);
            
            // Try without filtering to see if filter is the issue
            const unfiltered = data.map((item, index) => ({
              area_id: item.area_id || `Unknown-${index}`,
              occupancy: safeParseNumber(item.occupancy || item.occupancy_count || item.current_occupancy || item.occupancy_percentage),
              hour: safeParseNumber(item.hour || item.time_hour || item.current_hour || new Date().getHours()),
              occupancy_percentage: item.occupancy_percentage || item.percentage || '0%',
              date: new Date().toISOString(),
              raw_item: item
            }));
            
            console.log("Unfiltered processed data:", unfiltered.slice(0, 3));
          }
          
          setTableData(processedData);
        } else {
          console.error("Expected array from hourly API, got:", typeof data);
          setApiError("API returned unexpected data format");
          setTableData([]);
        }
        
      } else {
        console.log("Fetching daily/weekly/custom data...");
        
        let startTime, endTime;
        
        if (reportType === "weekly") {
          startTime = new Date(dateRange.startDate + 'T00:00:00.000Z');
          endTime = new Date(dateRange.endDate + 'T23:59:59.000Z');
        } else if (reportType === "monthly") {
          startTime = new Date(dateRange.startDate + 'T00:00:00.000Z');
          endTime = new Date(dateRange.endDate + 'T23:59:59.000Z');
        } else {
          startTime = new Date(dateRange.startDate + 'T00:00:00.000Z');
          endTime = new Date(dateRange.endDate + 'T23:59:59.000Z');
        }
        
        url = `${API_BASE_URL}/api/daily-average-occupancy?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}`;
        console.log("Daily/Weekly/Custom URL:", url);
        
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        data = await response.json();
        
        logApiResponse("daily-average-occupancy", data);
        
        if (Array.isArray(data)) {
          // Process all non-hourly reports using daily-average-occupancy data
          const groupedData = {};
          
          data.forEach(item => {
            if (!groupedData[item.area_id]) {
              groupedData[item.area_id] = {
                area_id: item.area_id,
                total_occupancy: 0,
                total_occupancy_percentage: 0,
                count: 0,
                dates: [],
                daily_data: [] // Store individual day data for charts
              };
            }
            
            const occupancy = safeParseNumber(item.average_hourly_occupancy);
            const occupancyPercentage = safeParseNumber(item.occupancy_percentage?.replace('%', '') || 0);
            
            groupedData[item.area_id].total_occupancy += occupancy;
            groupedData[item.area_id].total_occupancy_percentage += occupancyPercentage;
            groupedData[item.area_id].count += 1;
            groupedData[item.area_id].dates.push(item.date);
            groupedData[item.area_id].daily_data.push({
              date: item.date,
              occupancy: occupancy,
              occupancy_percentage: occupancyPercentage
            });
          });
          
          const processedData = Object.values(groupedData)
            .filter(group => group.count > 0)
            .map(group => {
              const sortedDates = group.dates.sort();
              
            if (reportType === "custom") {
                // For custom: take averages
                const avgOccupancy = (group.total_occupancy / group.count);
                const avgOccupancyPercentage = (group.total_occupancy_percentage / group.count);
                return {
                  area_id: group.area_id,
                  average_hourly_occupancy: avgOccupancy.toFixed(2),
                  occupancy_percentage: avgOccupancyPercentage.toFixed(2) + "%",
                  date_range: `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`,
                  daily_data: group.daily_data
                };
              } else {
                const avgOccupancyPercentage = (group.total_occupancy_percentage / group.count);
                const sumOccupancy = (group.total_occupancy / group.count); // Use sum for weekly/monthly
                return {
                  area_id: group.area_id,
                  average_hourly_occupancy: sumOccupancy.toFixed(2),
                  occupancy_percentage: avgOccupancyPercentage.toFixed(2) + "%",
                  date_range: `${sortedDates[0]} to ${sortedDates[sortedDates.length - 1]}`,
                  daily_data: group.daily_data
                };
              }
            });
          
          setTableData(filterByDataType(processedData));
        } else {
          console.error("Expected array from daily API, got:", typeof data);
          setApiError("API returned unexpected data format");
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
      setApiError(error.message);
      setTableData([]);
    } finally {
      setIsLoading(false);
      console.log("=== Data fetch completed ===\n");
    }
  };

  // Handle generate report
  const handleGenerateReport = () => {
    console.log("Generate report clicked with params:", {
      reportType,
      dateRange,
      dataType
    });
    
    // Validate date range before fetching
    if (reportType === "daily" && !dateRange.selectedDate) {
      console.error("No selected date for daily report");
      setApiError("No selected date for daily report");
      return;
    }
    
    if (reportType === "custom" && (!dateRange.startDate || !dateRange.endDate)) {
      console.error("Missing start or end date for report");
      setApiError("Missing start or end date for report");
      return;
    }
    
    if ((reportType === "weekly" || reportType === "monthly") && (!dateRange.startDate || !dateRange.endDate)) {
      console.error("Missing calculated date range for report");
      setApiError("Missing calculated date range for report");
      return;
    }
    
    fetchData();
    setExpandedRow(null);
    setChartDataMap({});
    setCurrentPage(1);
  };

  // Toggle row expansion
  const toggleRowExpansion = (areaId) => {
    if (expandedRow === areaId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(areaId);
      if (!chartDataMap[areaId]) {
        fetchChartData(areaId);
      }
    }
  };


  //export csv
  // const handleExportCSV = () => {
  //   if (tableData.length === 0) return;
    
  //   let csvContent = "data:text/csv;charset=utf-8,";
    
  //   if (reportType === "hourly") {
  //     csvContent += "Area ID,Occupancy,Occupancy Percentage,Hour\n";
  //     csvContent += tableData.map(row => 
  //       `${row.area_id},${row.occupancy || 0},${row.occupancy_percentage || '0.00%'},${formatHour(row.hour)}`
  //     ).join("\n");
  //   } else {
  //     csvContent += "Area ID,Average Hourly Occupancy,Occupancy Percentage\n";
  //     csvContent += tableData.map(row => 
  //       `${row.area_id},${row.average_hourly_occupancy || '0.00'},${row.occupancy_percentage || '0.00%'}`
  //     ).join("\n");
  //   }
    
  //   const encodedUri = encodeURI(csvContent);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute("download", `occupancy_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  
    
  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Debug logs
  console.log("=== Current Component State ===");
  console.log("Table Data:", tableData);
  console.log("Current Rows:", currentRows);
  console.log("Report Type:", reportType);
  console.log("Date Range:", dateRange);
  console.log("Data Type:", dataType);
  console.log("Is Loading:", isLoading);
  console.log("API Error:", apiError);
  console.log("===============================");

  return (
    <div className="w-full">

      {/* Filters Section */}
      <div className="w-full">
        <OccupancyFilters
          reportType={reportType}
          setReportType={setReportType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          dataType={dataType}
          setDataType={setDataType}
          onGenerateReport={handleGenerateReport}
          isLoading={isLoading}
          tableData={tableData}            // ✅ NEW
          formatHour={formatHour}
        />
      </div>

      {/* Results Table */}
      <div className="mt-6 mb-10 rounded-xl border border-gray-200 overflow-hidden bg-white w-full mx-auto">
        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2">Loading data...</p>
          </div>
        ) : apiError ? (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg mb-2">API Error</div>
            <p className="text-red-400 mb-4">{apiError}</p>
            <button
              onClick={handleGenerateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Retry
            </button>
          </div>
        ) : tableData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto shadow-custom">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-4 font-semibold text-gray-700 w-2/5">
                    Area ID
                  </th>
                  {reportType === "daily" ? (
                    <>
                      <th className="text-center px-4 py-4 font-semibold text-gray-700 w-1/5">
                        Total Occupancy
                      </th>
                      <th className="text-center px-4 py-4 font-semibold text-gray-700 w-1/5">
                        Occupancy Percentage
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="text-center px-4 py-4 font-semibold text-gray-700 w-1/5">
                        Average Hourly Occupancy
                      </th>
                      <th className="text-center px-4 py-4 font-semibold text-gray-700 w-1/5">
                        Occupancy Percentage
                      </th>
                    </>
                  )}
                  <th className="text-center px-4 py-4 font-semibold text-gray-700 w-1/5">
                    Overview
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((item, index) => (
                  <React.Fragment key={`${item.area_id}-${index}`}>
                    <tr
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        index === currentRows.length - 1 && expandedRow !== item.area_id
                          ? ""
                          : "border-b border-gray-200"
                      }`}
                      onClick={() => toggleRowExpansion(item.area_id)}
                    >
                      <td className="text-left px-4 py-4 font-medium text-gray-900">
                        {item.area_id}
                      </td>
                      {reportType === "daily" ? (
                        <>
                          <td className="text-center px-4 py-4 text-gray-700 font-medium">
                            {item.occupancy !== undefined && item.occupancy !== null ? item.occupancy : 0}
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700 font-medium">
                            {item.occupancy_percentage || '0.00%'}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="text-center px-4 py-4 text-gray-700 font-medium">
                            {item.average_hourly_occupancy || '0.00'}
                          </td>
                          <td className="text-center px-4 py-4 text-gray-700 font-medium">
                            {item.occupancy_percentage || '0.00%'}
                          </td>
                        </>
                      )}
                      <td className="text-center px-4 py-4">
                        <div className="flex justify-center">
                          {expandedRow === item.area_id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === item.area_id && (
                      <tr>
                        <td colSpan={reportType === "daily" ? "4" : "4"} className="p-0">
                          <OccupancyCharts
                            item={item}
                            reportType={reportType}
                            chartData={chartDataMap[item.area_id] || []}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-2">No data available</div>
            <p className="text-gray-400 mb-4">
              No data found for the selected criteria. Try adjusting your filters or check the debug panel above.
            </p>
            <button
              onClick={testApiConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition mr-2"
            >
              Test API
            </button>
            <button
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Retry Report
            </button>
          </div>
        )}

        {/* Export Button 
        {tableData.length > 0 && (
          <div className="px-8 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Export CSV
            </button>
          </div>
        )}
        */}

        {/* Pagination */}
        {tableData.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstRow + 1}–{Math.min(indexOfLastRow, tableData.length)} of {tableData.length} rows
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OccupancyAnalysis;