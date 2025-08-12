import React, { useEffect } from 'react';
import { Download, FileText } from 'lucide-react';

const FilterControls = ({
  selectedFilter,
  setSelectedFilter,
  selectedRoomType,
  setSelectedRoomType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  weekRange,
  setWeekRange,
  handleExportCSV,
  handleGenerateReport,
  handleFilterChange
}) => {
  // Set today's date as default if empty
  useEffect(() => {
    if (!startDate) {
      const today = new Date().toISOString().split('T')[0];
      setStartDate(today);
    }
  }, [startDate, setStartDate]);

  useEffect(() => {
    if (!endDate) {
      const today = new Date().toISOString().split('T')[0];
      setEndDate(today);
    }
  }, [endDate, setEndDate]);

  const getWeekRange = (date = new Date()) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const onFilterChange = handleFilterChange || ((filter) => {
    setSelectedFilter(filter);
    if (filter === 'Weekly') {
      setWeekRange(getWeekRange());
    }
  });

  const calculateWeekRange = (date) => {
    if (!date) return '';
    const selectedDate = new Date(date);
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${formatDate(startOfWeek)} to ${formatDate(endOfWeek)}`;
  };

  const weekRangeText = selectedFilter === 'Weekly' && startDate ? calculateWeekRange(startDate) : '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full mx-auto mb-6">
      <div className="p-6">
        <div className="flex flex-wrap justify-between gap-6 items-end">
        {/* Filters Section */}
        <div className="flex flex-wrap gap-6 items-end w-full md:w-auto">
          {/* Report Type */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700">Report Type</label>
            <div className="flex gap-2 flex-wrap">
              {['Daily', 'Weekly', 'Custom'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => onFilterChange(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700">
              {selectedFilter === 'Custom'
                ? 'Date Range'
                : selectedFilter === 'Weekly'
                ? 'Select Week'
                : 'Select Date'}
            </label>

            {selectedFilter === 'Weekly' && weekRangeText && (
              <div className="text-xs text-gray-600 -mt-1">Selected week: {weekRangeText}</div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-40"
              />

              {selectedFilter === 'Custom' && (
                <>
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-40"
                  />
                </>
              )}
            </div>
          </div>

          {/* Data Type */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-medium text-gray-700">Data Type</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-40"
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
            >
              <option value="All Meeting Rooms">All Meeting Rooms</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Gym">Gym</option>
              <option value="Phone Booth">Phone Booth</option>
              <option value="Workspace">Workspace</option>
            </select>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
