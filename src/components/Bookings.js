import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import FilterControls from './FilterControls';
import SummaryCards from './SummaryCards';
import { ChevronRight } from 'lucide-react';


const Bookings = () => {
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState('All Meeting Rooms');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [weekRange, setWeekRange] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  // DUMMY DATA INITIALIZATION - For future API integration:
  // Replace the structure with API response.
  // API should return a resources array with the same structure as below.
  // Each resource should have: name, type, meetings, meetingHours, occupancy,
  // cancelledMeetings, cancelledHours, truncatedMeetings, truncatedHours,
  // autoBookedMeetings, autoBookingHours.
  const [data, setData] = useState({
    resources: [
      // Meeting Rooms
      {
        name: "London",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      {
        name: "Beijing",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      {
        name: "Shanghai",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      {
        name: "Mumbai",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      {
        name: "Shenzhen",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      {
        name: "Auckland",
        type: "Meeting Room",
        meetings: 8,
        meetingHours: "5h",
        occupancy: 65,
        cancelledMeetings: 7,
        cancelledHours: "6h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 4,
        autoBookingHours: "8h"
      },
      // Additional dummy data for more variety
      {
        name: "Conference Room A",
        type: "Meeting Room",
        meetings: 12,
        meetingHours: "8h",
        occupancy: 78,
        cancelledMeetings: 5,
        cancelledHours: "3h",
        truncatedMeetings: 2,
        truncatedHours: "1h",
        autoBookedMeetings: 6,
        autoBookingHours: "5h"
      },
      {
        name: "Conference Room B",
        type: "Meeting Room",
        meetings: 10,
        meetingHours: "7h",
        occupancy: 82,
        cancelledMeetings: 4,
        cancelledHours: "2h",
        truncatedMeetings: 1,
        truncatedHours: "1h",
        autoBookedMeetings: 7,
        autoBookingHours: "6h"
      },
      {
        name: "Executive Boardroom",
        type: "Meeting Room",
        meetings: 6,
        meetingHours: "9h",
        occupancy: 92,
        cancelledMeetings: 2,
        cancelledHours: "1h",
        truncatedMeetings: 1,
        truncatedHours: "30m",
        autoBookedMeetings: 3,
        autoBookingHours: "4h"
      },
      {
        name: "Training Room",
        type: "Meeting Room",
        meetings: 15,
        meetingHours: "12h",
        occupancy: 88,
        cancelledMeetings: 8,
        cancelledHours: "5h",
        truncatedMeetings: 4,
        truncatedHours: "3h",
        autoBookedMeetings: 9,
        autoBookingHours: "7h"
      },
      {
        name: "Creative Studio",
        type: "Meeting Room",
        meetings: 9,
        meetingHours: "6h",
        occupancy: 71,
        cancelledMeetings: 3,
        cancelledHours: "2h",
        truncatedMeetings: 2,
        truncatedHours: "1h",
        autoBookedMeetings: 5,
        autoBookingHours: "4h"
      },
      {
        name: "Innovation Lab",
        type: "Meeting Room",
        meetings: 11,
        meetingHours: "8h",
        occupancy: 76,
        cancelledMeetings: 6,
        cancelledHours: "4h",
        truncatedMeetings: 3,
        truncatedHours: "2h",
        autoBookedMeetings: 8,
        autoBookingHours: "6h"
      }
    ]
  });

  // Calculate summary cards dynamically from filtered data
  const calculateSummaryCards = () => {
    const filteredResources = getFilteredResources();

    const totalCancelledHours = filteredResources.reduce((total, resource) => {
      return total + parseInt(resource.cancelledHours.replace('h', ''));
    }, 0);

    const totalTruncatedHours = filteredResources.reduce((total, resource) => {
      return total + parseInt(resource.truncatedHours.replace('h', ''));
    }, 0);

    const totalAutoBookings = filteredResources.reduce((total, resource) => {
      return total + resource.autoBookedMeetings;
    }, 0);

    return {
      totalCancelledHours: `${totalCancelledHours}h 48m`,
      totalTruncatedHours: `${totalTruncatedHours}h 18m`,
      totalAutoBookings: totalAutoBookings
    };
  };

  // Filter resources based on selected type
  const getFilteredResources = () => {
    if (selectedRoomType === 'All Meeting Rooms') {
      return data.resources;
    }
    return data.resources.filter(resource => resource.type === selectedRoomType);
  };

  // Get top 3 rooms by occupancy dynamically from filtered data
  const getTopRooms = () => {
    const filteredResources = getFilteredResources();
    return filteredResources
      .sort((a, b) => b.occupancy - a.occupancy)
      .slice(0, 3)
      .map(resource => ({
        name: resource.name,
        percentage: resource.occupancy
      }));
  };

  // API INTEGRATION - Generate Report Function
  // Replace the dummy data generation below with an actual API call.
  // Uncomment and update the example code block with real API endpoint and logic.

  /*
  Example:
  const handleGenerateReport = async () = {
    try {
      const response = await fetch('/api/bookings/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange: selectedFilter,
          selectedDate: selectedDate,
          roomType: selectedRoomType
        })
      });
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  */
  const handleGenerateReport = () => {
    // DUMMY DATA GENERATION - Replace with API call above
    setData(prevData => ({
      ...prevData,
      resources: prevData.resources.map(resource => ({
        ...resource,
        meetings: Math.floor(Math.random() * 15) + 5,
        occupancy: Math.floor(Math.random() * 60) + 30,
        cancelledMeetings: Math.floor(Math.random() * 8) + 2,
        truncatedMeetings: Math.floor(Math.random() * 5) + 1,
        autoBookedMeetings: Math.floor(Math.random() * 8) + 2,
        cancelledHours: `${Math.floor(Math.random() * 8) + 2}h`,
        truncatedHours: `${Math.floor(Math.random() * 5) + 1}h`,
        autoBookingHours: `${Math.floor(Math.random() * 10) + 3}h`
      }))
    }));
  };

  // API INTEGRATION - Export CSV Function
  // Currently supports dummy data. When real API is integrated,
  // this function can remain mostly unchanged as it leverages
  // getFilteredResources() which will operate on real data.
  const handleExportCSV = () => {
    const filteredResources = getFilteredResources();
    const csvContent = [
      ['Resource Name', 'Type', 'Number of Meetings', 'Meeting Hours', 'Booking Occupancy (%)', 'Cancelled Meetings', 'Cancelled Hours', 'Truncated Meetings', 'Truncated Hours', 'Auto Booked Meetings', 'Auto Booking Hours'],
      ...filteredResources.map(resource => [
        resource.name,
        resource.type,
        resource.meetings,
        resource.meetingHours,
        resource.occupancy,
        resource.cancelledMeetings,
        resource.cancelledHours,
        resource.truncatedMeetings,
        resource.truncatedHours,
        resource.autoBookedMeetings,
        resource.autoBookingHours
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_report_${selectedRoomType.replace(/\s+/g, '_')}_${selectedDate || new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Pagination helpers
  const filteredResources = getFilteredResources();
  const totalItems = filteredResources.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(parseInt(newItemsPerPage));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleResourceClick = (resource) => {
    setSelectedResource(resource);
  };

  const handleExpandRow = (resourceName) => {
    setExpandedRow(expandedRow === resourceName ? null : resourceName);
  };

  // Hourly occupancy data for the selected resource
  const getHourlyOccupancyData = () => {
    const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
    return hours.map((hour, index) => ({
      hour: hour,
      occupancy: [65, 70, 75, 80, 60, 55, 85, 90, 75, 70, 65, 60, 55][index] || 65
    }));
  };

  // Week range calculation for Weekly filter
  const getWeekRange = (date = new Date()) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Start from Monday
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (d) => d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  // Filter change handler
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
    if (filter === 'Weekly') {
      setWeekRange(getWeekRange());
    }
  };

  // Generate chart data based on selected filter
  const getChartData = () => {
    switch (selectedFilter) {
      case 'Daily':
        // Hours from 9 to 21
        const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
        return hours.map(hour => ({
          label: hour,
          occupancy: Math.floor(Math.random() * 8) + 1 // 1-8 range for Y-axis
        }));
      
      case 'Weekly':
        // 7 days of the week
        const today = new Date();
        const startOfWeek = new Date(today);
        const dayOfWeek = startOfWeek.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + diff);
        
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          return {
            label: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
            occupancy: Math.floor(Math.random() * 8) + 1
          };
        });
      
      case 'Custom':
        // Custom date range
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          return Array.from({ length: Math.min(diffDays, 30) }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return {
              label: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
              occupancy: Math.floor(Math.random() * 8) + 1
            };
          });
        }
        // Default to daily if no custom range selected
        const dailyHours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
        return dailyHours.map(hour => ({
          label: hour,
          occupancy: Math.floor(Math.random() * 8) + 1
        }));
      
      default:
        return [];
    }
  };

  // Get color based on occupancy percentage
  const getOccupancyColor = (percentage) => {
    if (percentage >= 80) return '#16a34a';
    if (percentage >= 60) return '#eab308';
    if (percentage >= 40) return '#f97316';
    return '#ef4444';
  };

  const renderExpandedCharts = (resourceName) => {
    if (expandedRow !== resourceName) return null;

    const resource = data.resources.find(r => r.name === resourceName);
    if (!resource) return null;

    // Generate more realistic hourly data based on the resource's occupancy
    const generateHourlyData = () => {
      const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
      const baseOccupancy = resource.occupancy;
      return hours.map((hour, index) => {
        // Create variation around the base occupancy
        const variation = (Math.random() - 0.5) * 30; // ±15% variation
        const occupancy = Math.max(10, Math.min(100, baseOccupancy + variation));
        return {
          hour: hour,
          occupancy: Math.round(occupancy)
        };
      });
    };

    const hourlyData = generateHourlyData();

    // Get chart data based on selected filter
    const chartData = getChartData();

    // Pie chart data based on actual resource data with exact Figma colors
    const pieChartData = [
      { name: 'Occupied', value: resource.occupancy, color: '#4b97f9' },
      { name: 'Available', value: 100 - resource.occupancy, color: '#E5E7EB' }
    ];

    const cancelledHoursValue = parseInt(resource.cancelledHours.replace(/\D/g, '')) || 0;
    const cancelledHoursData = [
      { name: 'Cancelled', value: cancelledHoursValue, color: '#d18409' },
      { name: 'Available', value: Math.max(0, 10 - cancelledHoursValue), color: '#E5E7EB' }
    ];

    const autoBookingHoursValue = parseInt(resource.autoBookingHours.replace(/\D/g, '')) || 0;
    const autoBookingData = [
      { name: 'Auto Booked', value: autoBookingHoursValue, color: '#9dc77b' },
      { name: 'Available', value: Math.max(0, 12 - autoBookingHoursValue), color: '#E5E7EB' }
    ];

    // Get title for bar chart based on filter
    const getBarChartTitle = () => {
      switch (selectedFilter) {
        case 'Daily':
          return 'HOURLY OCCUPANCY (9:00–21:00)';
        case 'Weekly':
          return 'WEEKLY OCCUPANCY';
        case 'Custom':
          return 'OCCUPANCY OVER SELECTED PERIOD';
        default:
          return 'OCCUPANCY';
      }
    };

    return (
      <tr>
        <td colSpan="11" className="px-4 py-6 bg-gray-50">
          <div className="text-sm text-gray-600 mb-4 font-medium">{resourceName} | {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
          
          {/* Mobile and Tablet Layout */}
          <div className="block xl:hidden space-y-6">
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Booking Occupancy Chart */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide text-center">BOOKING OCCUPANCY</h4>
                <div className="relative h-32 mx-auto" style={{ width: '140px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{resource.occupancy}%</span>
                  </div>
                </div>
              </div>

              {/* Cancelled Hours Chart */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide text-center">CANCELLED HOURS</h4>
                <div className="relative h-32 mx-auto" style={{ width: '140px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cancelledHoursData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {cancelledHoursData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-sm font-bold text-amber-600">{resource.cancelledHours}</span>
                      <div className="text-xs font-bold text-amber-600">48m</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto Booking Hours Chart */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide text-center">AUTO BOOKING HOURS</h4>
                <div className="relative h-32 mx-auto" style={{ width: '140px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={autoBookingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {autoBookingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-sm font-bold text-green-600">{resource.autoBookingHours}</span>
                      <div className="text-xs font-bold text-green-600">48m</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart Row */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide text-center">{getBarChartTitle()}</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 15, left: 5, bottom: 35 }}
                    barGap={2}
                    barCategoryGap="10%"
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={true} vertical={false} />
                    <XAxis
                      dataKey="label"
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      interval={0}
                      angle={0}
                      textAnchor="middle"
                      height={35}
                    />
                    <YAxis
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      domain={[0, 8]}
                      tickCount={9}
                      width={30}
                      label={{ value: 'Average Occupancy', angle: -90, position: 'insideLeft' }}
                    />
                    <Bar
                      dataKey="occupancy"
                      fill="#3B82F6"
                      radius={[2, 2, 0, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Average Occupancy</p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden xl:flex gap-6 items-start">
            {/* Pie Charts */}
            <div className="flex gap-4">
              {/* Booking Occupancy */}
              <div className="flex-shrink-0" style={{ width: '160px' }}>
                <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">BOOKING OCCUPANCY</h4>
                <div className="relative h-32 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">{resource.occupancy}%</span>
                  </div>
                </div>
              </div>

              {/* Cancelled Hours */}
              <div className="flex-shrink-0" style={{ width: '160px' }}>
                <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">CANCELLED HOURS</h4>
                <div className="relative h-32 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cancelledHoursData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {cancelledHoursData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-base font-bold text-amber-600">{resource.cancelledHours}</span>
                      <div className="text-xs font-bold text-amber-600">48m</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto Booking Hours */}
              <div className="flex-shrink-0" style={{ width: '160px' }}>
                <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">AUTO BOOKING HOURS</h4>
                <div className="relative h-32 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={autoBookingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                      >
                        {autoBookingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-base font-bold text-green-600">{resource.autoBookingHours}</span>
                      <div className="text-xs font-bold text-green-600">48m</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">HOURLY OCCUPANCY (9:00–21:00)</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hourlyData}
                    margin={{ top: 5, right: 15, left: 5, bottom: 25 }}
                    barGap={1}
                    barCategoryGap="8%"
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={true} vertical={false} />
                    <XAxis
                      dataKey="hour"
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tick={{ fontSize: 9, fill: '#6B7280' }}
                      interval={0}
                      angle={0}
                      textAnchor="middle"
                      height={25}
                    />
                    <YAxis
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tick={{ fontSize: 9, fill: '#6B7280' }}
                      domain={[0, 100]}
                      tickCount={6}
                      width={25}
                    />
                    <Bar
                      dataKey="occupancy"
                      fill="#3B82F6"
                      radius={[1, 1, 0, 0]}
                      maxBarSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 text-center">Average Occupancy</p>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  const summaryCards = calculateSummaryCards();

  return (
    <div className="w-full">
      {/* Filter Controls */}
      <div className="w-full">
        <FilterControls
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          weekRange={weekRange}
          setWeekRange={setWeekRange}
          handleExportCSV={handleExportCSV}
          handleGenerateReport={handleGenerateReport}
          handleFilterChange={handleFilterChange}
        />
      </div>

      {/* Summary Cards Section */}
      <div className="mt-6 mb-10">
        <SummaryCards
          summaryCards={summaryCards}
          getTopRooms={getTopRooms}
          getOccupancyColor={getOccupancyColor}
        />
      </div>

{/* Data Table */}
<div className="mt-6 mb-10 rounded-xl border border-gray-200 overflow-hidden bg-white w-full mx-auto">
  <div className="w-full">
    <table className="w-full min-w-full table-auto shadow-custom text-sm">
      <thead>
        <tr className="bg-gray-100">
          {[
            "Meeting rooms",
            "Number of meetings",
            "Meeting hours",
            "Booking occupancy (%)",
            "Cancelled meetings",
            "Cancelled hours",
            "Truncated meetings",
            "Truncated hours",
            "Auto booked meetings",
            "Auto booking hours",
            "Overview",
          ].map((heading, i) => (
            <th
              key={i}
              className={`${
                i === 0 ? "text-left" : "text-center"
              } px-4 py-3 font-semibold text-gray-700 capitalize tracking-wide ${
                heading === "Overview" ? "w-16" : ""
              }`}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {getFilteredResources()
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((resource, index) => (
            <React.Fragment key={resource.name}>
              <tr
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  index ===
                    getFilteredResources().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length -
                      1 && expandedRow !== resource.name
                    ? ""
                    : "border-b border-gray-200"
                }`}
                onClick={() => {
                  handleResourceClick(resource);
                  handleExpandRow(resource.name);
                }}
              >
                <td className="text-left px-4 py-3 font-medium text-gray-900 break-words">
                  {resource.name}
                </td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.meetings}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.meetingHours}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.occupancy}%</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.cancelledMeetings}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.cancelledHours}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.truncatedMeetings}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.truncatedHours}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.autoBookedMeetings}</td>
                <td className="text-center px-4 py-3 text-gray-700 font-medium">{resource.autoBookingHours}</td>
                <td className="text-center px-4 py-3">
                  <div className="flex justify-center">
                    {expandedRow === resource.name ? (
                      <ChevronRight className="w-4 h-4 text-gray-600 rotate-90" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </td>
              </tr>
              {renderExpandedCharts(resource.name)}
            </React.Fragment>
          ))}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
      <div className="text-xs text-gray-600">
        Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} rows
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
              onClick={() => handlePageChange(pageNum)}
              className={`w-7 h-7 flex items-center justify-center rounded-md border text-xs ${
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
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

export default Bookings;