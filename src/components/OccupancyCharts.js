import React from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const OccupancyCharts = ({ item, reportType, chartData = [] }) => {
  // Updated colors for charts
  const COLORS = ['#2464EC', '#82C0CB', '#FFBB28', '#FF8042', '#8884d8'];

  // Format date for display
  const formatDisplayDate = () => {
    if (reportType === "daily") {
      // For daily, show the selected date from item data or current date as fallback
      if (item.date) {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      }
      // Fallback to current date if no item date
      const now = new Date();
      return now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } else {
      // For weekly/custom, show date range
      if (item.date_range) {
        const dates = item.date_range.split(' to ');
        if (dates.length === 2) {
          const startDate = new Date(dates[0]);
          const endDate = new Date(dates[1]);
          const formattedStart = startDate.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          });
          const formattedEnd = endDate.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          });
          return `${formattedStart} to ${formattedEnd}`;
        }
      }
    }
    
    // Fallback to current date
    return new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

// Prepare pie chart data based on revised logic for daily report
const preparePieChartData = () => {
  if (reportType === "daily") {
    // For daily reports, calculate average occupancy percentage from business hours (9-17)
    if (chartData && chartData.length > 0) {
      const businessHoursData = chartData.filter(d => {
        const hour = d.hour || 0;
        return hour >= 9 && hour <= 17;
      });
      
      const totalOccupied = businessHoursData.reduce((acc, dataPoint) => {
        return acc + (dataPoint.occupancy || 0);
      }, 0);
      
      const averageOccupied = businessHoursData.length ? (totalOccupied / 9) : 0; // Divide by 9 business hours
      const available = Math.max(0, 100 - averageOccupied);
      
      return [
        { name: "Occupied", value: averageOccupied },
        { name: "Available", value: available }
      ];
    } else {
      // Fallback: use item's occupancy percentage directly
      const occupiedValue = parseFloat(item.occupancy_percentage?.replace('%', '') || 0);
      const availableValue = Math.max(0, 100 - occupiedValue);
      
      return [
        { name: "Occupied", value: occupiedValue },
        { name: "Available", value: availableValue }
      ];
    }
  } else {
    // For other report types, use different logic
    if (chartData && chartData.length > 0) {
      const totalOccupied = chartData.reduce((acc, dataPoint) => {
        return acc + (dataPoint.occupancy || 0);
      }, 0);
      const averageOccupied = totalOccupied / chartData.length;
      const available = Math.max(0, 100 - averageOccupied);
      
      return [
        { name: "Occupied", value: averageOccupied },
        { name: "Available", value: available }
      ];
    } else {
      // Fallback
      const occupiedValue = parseFloat(item.occupancy_percentage?.replace('%', '') || 0);
      const availableValue = Math.max(0, 100 - occupiedValue);
      
      return [
        { name: "Occupied", value: occupiedValue },
        { name: "Available", value: availableValue }
      ];
    }
  }
};

  // Get chart title based on report type
  const getChartTitle = () => {
    switch (reportType) {
      case "daily":
        return "Hourly Trend (Business Hours)";
      case "weekly":
        return "Daily Trend (7 Days)";
      case "monthly":
        return "Daily Trend (Monthly)";
      case "custom":
        return "Daily Trend (Custom Range)";
      default:
        return "Occupancy Trend";
    }
  };

  // Get X-axis label
  const getXAxisLabel = () => {
    switch (reportType) {
      case "daily":
        return "Hour";
      case "weekly":
      case "monthly":
      case "custom":
        return "Date";
      default:
        return "Time";
    }
  };

  // Format tooltip based on report type
  const formatTooltip = (value, name) => {
    if (reportType === "daily") {
      return [`${value.toFixed(2)}%`, 'Occupancy Percentage'];
    } else {
      return [`${value.toFixed(2)}%`, 'Average Occupancy Percentage'];
    }
  };

  return (
    <div className="p-6 bg-gray-50 border-t border-gray-200">
      <h2 className="text-lg font-semibold mb-4">
        Data for {item.area_id} - {formatDisplayDate()}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">Occupancy Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={preparePieChartData()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                fill="#2464EC"
                dataKey="value"
              >
                {preparePieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => {
                // For pie chart, always show as percentage with proper formatting
                return [`${value.toFixed(1)}`, name];
              }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">{getChartTitle()}</h3>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey={reportType === "daily" ? "hour_display" : "date_display"}
                  label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                  angle={0}
                  textAnchor="middle"
                  height={30}
                />
                <YAxis 
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  label={{ 
                    value: 'Occupancy Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip formatter={formatTooltip} />
                <Legend />
                <Bar 
                  dataKey="occupancy" 
                  name="Average Occupancy" 
                  radius={[4, 4, 0, 0]} 
                  barSize={35} 
                  fill="#2464EC" 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">
                {reportType === "daily" ? "Loading current hour data..." : "Loading trend data..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OccupancyCharts;



