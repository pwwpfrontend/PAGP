import React from "react";
import { Button } from "./Button";

const OccupancyFilters = ({
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  dataType,
  setDataType,
  onGenerateReport,
  isLoading,
  tableData,          // ✅ Add this
  formatHour

}) => {
  // Helper function to get week range (7 days ending on selected date)
  const getWeekRange = (endDate) => {
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 6); // 6 days before to make it 7 days total
    
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0]
    };
  };

  // Helper function to get month range (first and last day of selected month)
  const getMonthRange = (selectedDate) => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of the month
    
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0]
    };
  };

  // Handle date change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (reportType === "weekly" && name === "selectedDate") {
      // For weekly reports, calculate the week range
      const weekRange = getWeekRange(value);
      setDateRange(prev => ({
        ...prev,
        selectedDate: value,
        startDate: weekRange.startDate,
        endDate: weekRange.endDate
      }));
    } else if (reportType === "monthly" && name === "selectedDate") {
      // For monthly reports, calculate the month range
      const monthRange = getMonthRange(value);
      setDateRange(prev => ({
        ...prev,
        selectedDate: value,
        startDate: monthRange.startDate,
        endDate: monthRange.endDate
      }));
    } else {
      setDateRange(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle report type change
  const handleReportTypeChange = (newReportType) => {
    setReportType(newReportType);

    // Update date range based on report type
    const today = new Date().toISOString().split("T")[0];
    
    if (newReportType === "daily") {
      setDateRange({
        selectedDate: today,
        startDate: today,
        endDate: today
      });
    } else if (newReportType === "weekly") {
      const weekRange = getWeekRange(today);
      setDateRange({
        selectedDate: today,
        startDate: weekRange.startDate,
        endDate: weekRange.endDate
      });
    } else if (newReportType === "monthly") {
      const monthRange = getMonthRange(today);
      setDateRange({
        selectedDate: today,
        startDate: monthRange.startDate,
        endDate: monthRange.endDate
      });
    } else if (newReportType === "custom") {
      setDateRange({
        selectedDate: today,
        startDate: today,
        endDate: today
      });
    }
  };

  // Get date display string for weekly and monthly
  const getDateRangeDisplay = () => {
    if ((reportType === "weekly" || reportType === "monthly") && dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const startDay = String(startDate.getDate()).padStart(2, '0');
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const year = endDate.getFullYear();
      return `(Showing: ${year}-${startMonth}-${startDay} to ${year}-${endMonth}-${endDay})`;
    }
    return "";
  };

return (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6 w-full">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onGenerateReport();
      }}
    >
    <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-y-6 xl:gap-x-8">
        {/* Filter Controls */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end flex-wrap sm:gap-x-4 md:gap-x-6 lg:gap-x-4 xl:gap-x-9 flex-1">
          {/* Report Type */}
          <div className="min-w-[280px] w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="flex flex-wrap gap-2 h-[42px] items-center">
              {["daily", "weekly", "monthly", "custom"].map((type) => {
                const displayName = type.charAt(0).toUpperCase() + type.slice(1);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleReportTypeChange(type)}
                    className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 border ${
                      reportType === type
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          {reportType === "custom" ? (
            <div className="min-w-[180px] w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex flex-col sm:flex-row gap-3 h-[42px]">
                <div className="flex-1">
                  <input
                    type="date"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Start Date"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="min-w-[180px] w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {reportType === "weekly" ? "Select Week" : reportType === "monthly" ? "Select Month" : "Select Date"}
                {(reportType === "weekly" || reportType === "monthly") && dateRange.startDate && dateRange.endDate && (
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    ({new Date(dateRange.startDate).toLocaleDateString("en-GB")} to {new Date(dateRange.endDate).toLocaleDateString("en-GB")})
                  </span>
                )}
              </label>
              <div className="h-[42px]">
                <input
                  type="date"
                  name="selectedDate"
                  value={dateRange.selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none h-full"
                />
              </div>
            </div>
          )}

          {/* Data Type */}
          <div className="min-w-[160px] w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Type
            </label>
            <div className="h-[42px]">
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none h-full"
              >
                <option value="meeting_room">Meeting Room</option>
                <option value="gym">Gym</option>
                <option value="phone_booth">Phone Booth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mt-4 lg:mt-0 flex-shrink-0 w-full sm:w-auto">
          {tableData && tableData.length > 0 && (
            <button
              type="button"
              onClick={() => {
                let csvContent = "data:text/csv;charset=utf-8,";
                if (reportType === "daily") {
                  csvContent += "Area ID,Occupancy,Occupancy Percentage,Hour\n";
                  csvContent += tableData.map(row =>
                    `${row.area_id},${row.occupancy || 0},${row.occupancy_percentage || '0.00%'},${formatHour(row.hour)}`
                  ).join("\n");
                } else {
                  csvContent += "Area ID,Average Hourly Occupancy,Occupancy Percentage\n";
                  csvContent += tableData.map(row =>
                    `${row.area_id},${row.average_hourly_occupancy || '0.00'},${row.occupancy_percentage || '0.00%'}`
                  ).join("\n");
                }
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `occupancy_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full sm:w-auto bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-md text-sm font-medium transition"
            >
              Export CSV
            </button>
          )}
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md text-sm font-medium transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
    </form>
  </div>
);
};

export default OccupancyFilters;