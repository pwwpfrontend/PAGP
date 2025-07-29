import React from "react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const OccupancyCharts = ({ item, reportType, chartData = [] }) => {
  // Updated colors for charts
  const COLORS = ['#2464EC', '#82C0CB', '#FFBB28', '#FF8042', '#8884d8'];

  // Format date for display
  const formatDisplayDate = () => {
    if (reportType === "hourly") {
      // For hourly, show current date
      const now = new Date();
      return now.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } else if (reportType === "daily") {
      // For daily, show the selected date
      if (item.date) {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
      }
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

  // Prepare pie chart data
  const preparePieChartData = () => {
    const occupancyPercentage = parseFloat(item.occupancy_percentage?.replace('%', '') || 0);
    const availablePercentage = Math.max(0, 100 - occupancyPercentage);
    
    return [
      { name: "Occupied", value: occupancyPercentage },
      { name: "Available", value: availablePercentage }
    ];
  };

  // Get chart title based on report type
  const getChartTitle = () => {
    switch (reportType) {
      case "hourly":
        return "Current Hour";
      case "daily":
        return "Hourly Trend (09:00-21:00)";
      case "weekly":
        return "Daily Trend (7 Days)";
      case "custom":
        return "Daily Trend (Custom Range)";
      default:
        return "Occupancy Trend";
    }
  };

  // Get X-axis label
  const getXAxisLabel = () => {
    switch (reportType) {
      case "hourly":
      case "daily":
        return "Hour";
      case "weekly":
      case "custom":
        return "Date";
      default:
        return "Time";
    }
  };

  // Format tooltip based on report type
  const formatTooltip = (value, name) => {
    if (reportType === "hourly" || reportType === "daily") {
      return [`${value.toFixed(2)}%`, 'Average Occupancy'];
    } else {
      return [`${value.toFixed(2)}`, 'Average Occupancy'];
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
              <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '']} />
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
                  dataKey={reportType === "hourly" || reportType === "daily" ? "hour_display" : "date_display"}
                  label={{ value: getXAxisLabel(), position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                  angle={reportType === "weekly" || reportType === "custom" ? -45 : 0}
                  textAnchor={reportType === "weekly" || reportType === "custom" ? "end" : "middle"}
                  height={reportType === "weekly" || reportType === "custom" ? 60 : 30}
                />
                <YAxis 
                  label={{ value: 'Average Occupancy (%)', angle: -90, position: 'insideLeft' }} 
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
                {reportType === "hourly" ? "Loading current hour data..." : "Loading trend data..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OccupancyCharts;