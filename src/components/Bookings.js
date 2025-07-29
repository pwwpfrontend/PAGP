// import React, { useState } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
// import { Menu, Calendar, Download, FileText } from 'lucide-react';

// const Bookings = () => {
//   const [selectedFilter, setSelectedFilter] = useState('Daily');
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRoomType, setSelectedRoomType] = useState('All Meeting Rooms');
//   const [selectedDate, setSelectedDate] = useState('');

//   // Static data with all room types - only updates when Generate Report is clicked
//   const [data, setData] = useState({
//     resources: [
//       // Meeting Rooms
//       {
//         name: "London",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Beijing",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Shanghai",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Mumbai",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Shenzhen",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Auckland",
//         type: "Meeting Room",
//         meetings: 8,
//         meetingHours: "5h",
//         occupancy: 65,
//         cancelledMeetings: 7,
//         cancelledHours: "6h",
//         truncatedMeetings: 3,
//         truncatedHours: "2h",
//         autoBookedMeetings: 4,
//         autoBookingHours: "8h"
//       },
//       // Gym
//       {
//         name: "Fitness Center A",
//         type: "Gym",
//         meetings: 12,
//         meetingHours: "8h",
//         occupancy: 75,
//         cancelledMeetings: 5,
//         cancelledHours: "3h",
//         truncatedMeetings: 2,
//         truncatedHours: "1h",
//         autoBookedMeetings: 6,
//         autoBookingHours: "4h"
//       },
//       {
//         name: "Fitness Center B",
//         type: "Gym",
//         meetings: 10,
//         meetingHours: "6h",
//         occupancy: 80,
//         cancelledMeetings: 4,
//         cancelledHours: "2h",
//         truncatedMeetings: 1,
//         truncatedHours: "1h",
//         autoBookedMeetings: 5,
//         autoBookingHours: "3h"
//       },
//       {
//         name: "Yoga Studio",
//         type: "Gym",
//         meetings: 15,
//         meetingHours: "10h",
//         occupancy: 90,
//         cancelledMeetings: 3,
//         cancelledHours: "2h",
//         truncatedMeetings: 2,
//         truncatedHours: "1h",
//         autoBookedMeetings: 8,
//         autoBookingHours: "5h"
//       },
//       // Phone Booth
//       {
//         name: "Phone Booth 1",
//         type: "Phone Booth",
//         meetings: 20,
//         meetingHours: "12h",
//         occupancy: 85,
//         cancelledMeetings: 8,
//         cancelledHours: "4h",
//         truncatedMeetings: 5,
//         truncatedHours: "3h",
//         autoBookedMeetings: 10,
//         autoBookingHours: "6h"
//       },
//       {
//         name: "Phone Booth 2",
//         type: "Phone Booth",
//         meetings: 18,
//         meetingHours: "10h",
//         occupancy: 78,
//         cancelledMeetings: 6,
//         cancelledHours: "3h",
//         truncatedMeetings: 4,
//         truncatedHours: "2h",
//         autoBookedMeetings: 9,
//         autoBookingHours: "5h"
//       },
//       {
//         name: "Phone Booth 3",
//         type: "Phone Booth",
//         meetings: 22,
//         meetingHours: "14h",
//         occupancy: 92,
//         cancelledMeetings: 7,
//         cancelledHours: "4h",
//         truncatedMeetings: 6,
//         truncatedHours: "3h",
//         autoBookedMeetings: 11,
//         autoBookingHours: "7h"
//       },
//       // Workspace
//       {
//         name: "Open Workspace A",
//         type: "Workspace",
//         meetings: 25,
//         meetingHours: "16h",
//         occupancy: 70,
//         cancelledMeetings: 10,
//         cancelledHours: "5h",
//         truncatedMeetings: 8,
//         truncatedHours: "4h",
//         autoBookedMeetings: 12,
//         autoBookingHours: "8h"
//       },
//       {
//         name: "Open Workspace B",
//         type: "Workspace",
//         meetings: 30,
//         meetingHours: "18h",
//         occupancy: 88,
//         cancelledMeetings: 12,
//         cancelledHours: "6h",
//         truncatedMeetings: 10,
//         truncatedHours: "5h",
//         autoBookedMeetings: 15,
//         autoBookingHours: "10h"
//       },
//       {
//         name: "Collaboration Zone",
//         type: "Workspace",
//         meetings: 28,
//         meetingHours: "20h",
//         occupancy: 95,
//         cancelledMeetings: 9,
//         cancelledHours: "4h",
//         truncatedMeetings: 7,
//         truncatedHours: "3h",
//         autoBookedMeetings: 14,
//         autoBookingHours: "9h"
//       }
//     ]
//   });

//   // Calculate summary cards dynamically from filtered data
//   const calculateSummaryCards = () => {
//     const filteredResources = getFilteredResources();

//     const totalCancelledHours = filteredResources.reduce((total, resource) => {
//       return total + parseInt(resource.cancelledHours.replace('h', ''));
//     }, 0);

//     const totalTruncatedHours = filteredResources.reduce((total, resource) => {
//       return total + parseInt(resource.truncatedHours.replace('h', ''));
//     }, 0);

//     const totalAutoBookings = filteredResources.reduce((total, resource) => {
//       return total + resource.autoBookedMeetings;
//     }, 0);

//     return {
//       totalCancelledHours: `${totalCancelledHours}h 48m`,
//       totalTruncatedHours: `${totalTruncatedHours}h 18m`,
//       totalAutoBookings: totalAutoBookings
//     };
//   };

//   // Filter resources based on selected type
//   const getFilteredResources = () => {
//     if (selectedRoomType === 'All Meeting Rooms') {
//       return data.resources;
//     }
//     return data.resources.filter(resource => resource.type === selectedRoomType);
//   };

//   // Get top 3 rooms by occupancy dynamically from filtered data
//   const getTopRooms = () => {
//     const filteredResources = getFilteredResources();
//     return filteredResources
//       .sort((a, b) => b.occupancy - a.occupancy)
//       .slice(0, 3)
//       .map(resource => ({
//         name: resource.name,
//         percentage: resource.occupancy
//       }));
//   };

//   // Generate and download report - updates data when this is clicked
//   const handleGenerateReport = () => {
//     setData(prevData => ({
//       ...prevData,
//       resources: prevData.resources.map(resource => ({
//         ...resource,
//         meetings: Math.floor(Math.random() * 15) + 5,
//         occupancy: Math.floor(Math.random() * 60) + 30,
//         cancelledMeetings: Math.floor(Math.random() * 8) + 2,
//         truncatedMeetings: Math.floor(Math.random() * 5) + 1,
//         autoBookedMeetings: Math.floor(Math.random() * 8) + 2,
//         cancelledHours: `${Math.floor(Math.random() * 8) + 2}h`,
//         truncatedHours: `${Math.floor(Math.random() * 5) + 1}h`,
//         autoBookingHours: `${Math.floor(Math.random() * 10) + 3}h`
//       }))
//     }));
//   };

//   // Export CSV functionality
//   const handleExportCSV = () => {
//     const filteredResources = getFilteredResources();
//     const csvContent = [
//       ['Resource Name', 'Type', 'Number of Meetings', 'Meeting Hours', 'Booking Occupancy (%)', 'Cancelled Meetings', 'Cancelled Hours', 'Truncated Meetings', 'Truncated Hours', 'Auto Booked Meetings', 'Auto Booking Hours'],
//       ...filteredResources.map(resource => [
//         resource.name,
//         resource.type,
//         resource.meetings,
//         resource.meetingHours,
//         resource.occupancy,
//         resource.cancelledMeetings,
//         resource.cancelledHours,
//         resource.truncatedMeetings,
//         resource.truncatedHours,
//         resource.autoBookedMeetings,
//         resource.autoBookingHours
//       ])
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `bookings_report_${selectedRoomType.replace(/\s+/g, '_')}_${selectedDate || new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   const handleResourceClick = (resource) => {
//     setSelectedResource(resource);
//   };

//   const handleExpandRow = (resourceName) => {
//     setExpandedRow(expandedRow === resourceName ? null : resourceName);
//   };

//   // Hourly occupancy data for the selected resource
//   const getHourlyOccupancyData = () => {
//     const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
//     return hours.map((hour, index) => ({
//       hour: hour,
//       occupancy: [65, 70, 75, 80, 60, 55, 85, 90, 75, 70, 65, 60, 55][index] || 65
//     }));
//   };

//   // Get color based on occupancy percentage
//   const getOccupancyColor = (percentage) => {
//     if (percentage >= 80) return '#16a34a';
//     if (percentage >= 60) return '#eab308';
//     if (percentage >= 40) return '#f97316';
//     return '#ef4444';
//   };

//   const renderExpandedCharts = (resourceName) => {
//     if (expandedRow !== resourceName) return null;

//     const resource = data.resources.find(r => r.name === resourceName);
//     const hourlyData = getHourlyOccupancyData();

//     // Pie chart data based on actual resource data
//     const pieChartData = [
//       { name: 'Occupied', value: resource.occupancy, color: '#4B97F9' },
//       { name: 'Available', value: 100 - resource.occupancy, color: '#E5E7EB' }
//     ];

//     const cancelledHoursValue = parseInt(resource.cancelledHours.replace('h', ''));
//     const cancelledHoursData = [
//       { name: 'Cancelled', value: cancelledHoursValue, color: '#D18409' },
//       { name: 'Available', value: 10 - cancelledHoursValue, color: '#E5E7EB' }
//     ];

//     const autoBookingHoursValue = parseInt(resource.autoBookingHours.replace('h', ''));
//     const autoBookingData = [
//       { name: 'Auto Booked', value: autoBookingHoursValue, color: '#9DC77B' },
//       { name: 'Available', value: 12 - autoBookingHoursValue, color: '#E5E7EB' }
//     ];

//     return (
//       <tr>
//         <td colSpan="11" className="px-6 py-6 bg-gray-50">
//           <div className="text-sm text-gray-600 mb-6">{resourceName} | 24-07-25</div>
//           <div className="flex gap-12 items-start">
//             {/* First Pie Chart - Booking Occupancy */}
//             <div className="flex-shrink-0" style={{ width: '200px' }}>
//               <h4 className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide text-center">BOOKING OCCUPANCY</h4>
//               <div className="relative h-40 flex items-center justify-center">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieChartData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={45}
//                       outerRadius={75}
//                       dataKey="value"
//                       startAngle={90}
//                       endAngle={450}
//                     >
//                       {pieChartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <span className="text-2xl font-bold" style={{ color: '#4B97F9' }}>{resource.occupancy}%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Second Pie Chart - Cancelled Hours */}
//             <div className="flex-shrink-0" style={{ width: '200px' }}>
//               <h4 className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide text-center">CANCELLED HOURS</h4>
//               <div className="relative h-40 flex items-center justify-center">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={cancelledHoursData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={45}
//                       outerRadius={75}
//                       dataKey="value"
//                       startAngle={90}
//                       endAngle={450}
//                     >
//                       {cancelledHoursData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <span className="text-lg font-bold" style={{ color: '#D18409' }}>{resource.cancelledHours}</span>
//                     <div className="text-sm font-bold" style={{ color: '#D18409' }}>48m</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Third Pie Chart - Auto Booking Hours */}
//             <div className="flex-shrink-0" style={{ width: '200px' }}>
//               <h4 className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide text-center">AUTO BOOKING HOURS</h4>
//               <div className="relative h-40 flex items-center justify-center">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={autoBookingData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={45}
//                       outerRadius={75}
//                       dataKey="value"
//                       startAngle={90}
//                       endAngle={450}
//                     >
//                       {autoBookingData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <span className="text-lg font-bold" style={{ color: '#9DC77B' }}>{resource.autoBookingHours}</span>
//                     <div className="text-sm font-bold" style={{ color: '#9DC77B' }}>48m</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bar Chart - Takes remaining space */}
//             <div className="flex-1 min-w-0">
//               <h4 className="text-xs font-medium text-gray-600 mb-4 uppercase tracking-wide text-center">HOURLY OCCUPANCY (9:00–21:00)</h4>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={hourlyData}
//                     margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
//                     barGap={4}
//                     barCategoryGap="15%"
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
//                     <XAxis
//                       dataKey="hour"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 11, fill: '#6B7280' }}
//                       interval={0}
//                       angle={-45}
//                       textAnchor="end"
//                       height={40}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 11, fill: '#6B7280' }}
//                       domain={[0, 100]}
//                       tickCount={5}
//                       width={35}
//                     />
//                     <Bar
//                       dataKey="occupancy"
//                       fill="#4B97F9"
//                       radius={[3, 3, 0, 0]}
//                       maxBarSize={24}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//               <p className="text-xs text-gray-500 text-center mt-2">Average Occupancy</p>
//             </div>
//           </div>
//         </td>
//       </tr>
//     );
//   };

//   const summaryCards = calculateSummaryCards();

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-full px-4 py-6">
//         {/* Filter Controls with Background */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//             <div className="flex flex-wrap items-center gap-3">
//               {['Daily', 'Weekly', 'Custom'].map((filter) => (
//                 <button
//                   key={filter}
//                   onClick={() => setSelectedFilter(filter)}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                     selectedFilter === filter
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
//                   }`}
//                 >
//                   {filter}
//                 </button>
//               ))}

//               <div className="flex flex-wrap items-center gap-3 ml-0 lg:ml-6">
//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white pr-10"
//                     placeholder="Select Date"
//                   />
//                   <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
//                 </div>
                
//                 <select 
//                   className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-0"
//                   value={selectedRoomType}
//                   onChange={(e) => setSelectedRoomType(e.target.value)}
//                 >
//                   <option value="All Meeting Rooms">All Meeting Rooms</option>
//                   <option value="Meeting Room">Meeting Rooms</option>
//                   <option value="Gym">Gym</option>
//                   <option value="Phone Booth">Phone Booth</option>
//                   <option value="Workspace">Workspace</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-3">
//               <button 
//                 onClick={handleExportCSV}
//                 className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
//               >
//                 Export CSV
//               </button>
//               <button 
//                 onClick={handleGenerateReport}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 Generate Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Summary Cards - Fixed dimensions and centered alignment */}
//         <div className="flex justify-center mb-6">
//           <div className="flex gap-6 items-stretch">
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
//               <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total hours saved via Cancellation</h3>
//               <div className="text-center flex-1 flex items-center justify-center">
//                 <p className="text-3xl font-bold text-blue-600">{summaryCards.totalCancelledHours}</p>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
//               <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total hours saved via Truncation</h3>
//               <div className="text-center flex-1 flex items-center justify-center">
//                 <p className="text-3xl font-bold text-orange-600">{summaryCards.totalTruncatedHours}</p>
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
//               <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total Auto Bookings Made</h3>
//               <div className="text-center flex-1 flex flex-col items-center justify-center">
//                 <p className="text-3xl font-bold text-green-600">{summaryCards.totalAutoBookings}</p>
//                 <p className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>Bookings</p>
//               </div>
//             </div>

//             {/* Top Rooms Card */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ width: '609px', height: '124px', padding: '12px' }}>
//               <h3 className="font-medium text-gray-600 mb-3" style={{ fontSize: '14px' }}>Top 3 Meeting Rooms by occupancy</h3>
//               <div className="space-y-2">
//                 {getTopRooms().map((room, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <div className="w-32 text-gray-700 font-medium" style={{ fontSize: '10.4px' }}>
//                       {room.name}
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
//                         <div
//                           className="h-full rounded-full transition-all duration-500 ease-out"
//                           style={{
//                             width: `${room.percentage}%`,
//                             backgroundColor: getOccupancyColor(room.percentage),
//                           }}
//                         />
//                       </div>
//                     </div>
//                     <div className="text-xs text-gray-600 w-8 text-right">
//                       {room.percentage}%
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Data Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESOURCE NAME</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER OF MEETINGS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MEETING HOURS</th>  
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">BOOKING OCCUPANCY (%)</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CANCELLED MEETINGS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CANCELLED HOURS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TRUNCATED MEETINGS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TRUNCATED HOURS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AUTO BOOKED MEETINGS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AUTO BOOKING HOURS</th>
//                   <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"></th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {getFilteredResources().map((resource, index) => (
//                   <React.Fragment key={resource.name}>
//                     <tr 
//                       className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
//                       onClick={() => {
//                         handleResourceClick(resource);
//                         handleExpandRow(resource.name);
//                       }}
//                     >
//                       <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {resource.name}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.meetings}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.meetingHours}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         <span className="font-medium text-gray-900">
//                           {resource.occupancy}%
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.cancelledMeetings}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.cancelledHours}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.truncatedMeetings}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.truncatedHours}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.autoBookedMeetings}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                         {resource.autoBookingHours}
//                       </td>
//                       <td className="px-4 py-4 whitespace-nowrap text-center">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleExpandRow(resource.name);
//                           }}
//                           className="text-gray-400 hover:text-gray-600 transition-colors duration-150 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
//                         >
//                           {expandedRow === resource.name ? '−' : '>'}
//                         </button>
//                       </td>
//                     </tr>
//                     {renderExpandedCharts(resource.name)}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
//           <div className="text-sm text-gray-500 flex items-center gap-2">
//             Showing 
//             <select className="mx-1 border border-gray-300 rounded px-2 py-1 bg-white">
//               <option>6</option>
//             </select> 
//             of 12
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <button className="px-3 py-1 text-gray-400 hover:text-gray-600 transition-colors">
//               &lt;
//             </button>
//             <button 
//               className={`px-3 py-1 rounded transition-colors ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//               onClick={() => setCurrentPage(1)}
//             >
//               1
//             </button>
//             <button 
//               className={`px-3 py-1 rounded transition-colors ${currentPage === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
//               onClick={() => setCurrentPage(2)}
//             >
//               2
//             </button>
//             <button className="px-3 py-1 text-gray-400 hover:text-gray-600 transition-colors">
//               &gt;
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bookings;




import React, { useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar, Download, FileText } from 'lucide-react';

const Bookings = () => {
  const [selectedFilter, setSelectedFilter] = useState('Daily');
  const [selectedResource, setSelectedResource] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoomType, setSelectedRoomType] = useState('All Meeting Rooms');
  const [selectedDate, setSelectedDate] = useState('');

  // Static data with all room types - only updates when Generate Report is clicked
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
      // Gym
      {
        name: "Fitness Center A",
        type: "Gym",
        meetings: 12,
        meetingHours: "8h",
        occupancy: 75,
        cancelledMeetings: 5,
        cancelledHours: "3h",
        truncatedMeetings: 2,
        truncatedHours: "1h",
        autoBookedMeetings: 6,
        autoBookingHours: "4h"
      },
      {
        name: "Fitness Center B",
        type: "Gym",
        meetings: 10,
        meetingHours: "6h",
        occupancy: 80,
        cancelledMeetings: 4,
        cancelledHours: "2h",
        truncatedMeetings: 1,
        truncatedHours: "1h",
        autoBookedMeetings: 5,
        autoBookingHours: "3h"
      },
      {
        name: "Yoga Studio",
        type: "Gym",
        meetings: 15,
        meetingHours: "10h",
        occupancy: 90,
        cancelledMeetings: 3,
        cancelledHours: "2h",
        truncatedMeetings: 2,
        truncatedHours: "1h",
        autoBookedMeetings: 8,
        autoBookingHours: "5h"
      },
      // Phone Booth
      {
        name: "Phone Booth 1",
        type: "Phone Booth",
        meetings: 20,
        meetingHours: "12h",
        occupancy: 85,
        cancelledMeetings: 8,
        cancelledHours: "4h",
        truncatedMeetings: 5,
        truncatedHours: "3h",
        autoBookedMeetings: 10,
        autoBookingHours: "6h"
      },
      {
        name: "Phone Booth 2",
        type: "Phone Booth",
        meetings: 18,
        meetingHours: "10h",
        occupancy: 78,
        cancelledMeetings: 6,
        cancelledHours: "3h",
        truncatedMeetings: 4,
        truncatedHours: "2h",
        autoBookedMeetings: 9,
        autoBookingHours: "5h"
      },
      {
        name: "Phone Booth 3",
        type: "Phone Booth",
        meetings: 22,
        meetingHours: "14h",
        occupancy: 92,
        cancelledMeetings: 7,
        cancelledHours: "4h",
        truncatedMeetings: 6,
        truncatedHours: "3h",
        autoBookedMeetings: 11,
        autoBookingHours: "7h"
      },
      // Workspace
      {
        name: "Open Workspace A",
        type: "Workspace",
        meetings: 25,
        meetingHours: "16h",
        occupancy: 70,
        cancelledMeetings: 10,
        cancelledHours: "5h",
        truncatedMeetings: 8,
        truncatedHours: "4h",
        autoBookedMeetings: 12,
        autoBookingHours: "8h"
      },
      {
        name: "Open Workspace B",
        type: "Workspace",
        meetings: 30,
        meetingHours: "18h",
        occupancy: 88,
        cancelledMeetings: 12,
        cancelledHours: "6h",
        truncatedMeetings: 10,
        truncatedHours: "5h",
        autoBookedMeetings: 15,
        autoBookingHours: "10h"
      },
      {
        name: "Collaboration Zone",
        type: "Workspace",
        meetings: 28,
        meetingHours: "20h",
        occupancy: 95,
        cancelledMeetings: 9,
        cancelledHours: "4h",
        truncatedMeetings: 7,
        truncatedHours: "3h",
        autoBookedMeetings: 14,
        autoBookingHours: "9h"
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

  // Generate and download report - updates data when this is clicked
  const handleGenerateReport = () => {
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

  // Export CSV functionality
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
    const hourlyData = getHourlyOccupancyData();

    // Pie chart data based on actual resource data
    const pieChartData = [
      { name: 'Occupied', value: resource.occupancy, color: '#4B97F9' },
      { name: 'Available', value: 100 - resource.occupancy, color: '#E5E7EB' }
    ];

    const cancelledHoursValue = parseInt(resource.cancelledHours.replace('h', ''));
    const cancelledHoursData = [
      { name: 'Cancelled', value: cancelledHoursValue, color: '#D18409' },
      { name: 'Available', value: 10 - cancelledHoursValue, color: '#E5E7EB' }
    ];

    const autoBookingHoursValue = parseInt(resource.autoBookingHours.replace('h', ''));
    const autoBookingData = [
      { name: 'Auto Booked', value: autoBookingHoursValue, color: '#9DC77B' },
      { name: 'Available', value: 12 - autoBookingHoursValue, color: '#E5E7EB' }
    ];

    return (
      <tr>
        <td colSpan="11" className="px-6 py-3 bg-gray-50">
          <div className="text-sm text-gray-600 mb-3">{resourceName} | 24-07-25</div>
          <div className="flex gap-6 items-start">
            {/* First Pie Chart - Booking Occupancy */}
            <div className="flex-shrink-0" style={{ width: '160px' }}>
              <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">BOOKING OCCUPANCY</h4>
              <div className="relative h-32 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
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
                  <div className="text-center">
                    <span className="text-xl font-bold" style={{ color: '#4B97F9' }}>{resource.occupancy}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Pie Chart - Cancelled Hours */}
            <div className="flex-shrink-0" style={{ width: '160px' }}>
              <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">CANCELLED HOURS</h4>
              <div className="relative h-32 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cancelledHoursData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
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
                    <span className="text-base font-bold" style={{ color: '#D18409' }}>{resource.cancelledHours}</span>
                    <div className="text-xs font-bold" style={{ color: '#D18409' }}>48m</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Pie Chart - Auto Booking Hours */}
            <div className="flex-shrink-0" style={{ width: '160px' }}>
              <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide text-center">AUTO BOOKING HOURS</h4>
              <div className="relative h-32 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={autoBookingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
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
                    <span className="text-base font-bold" style={{ color: '#9DC77B' }}>{resource.autoBookingHours}</span>
                    <div className="text-xs font-bold" style={{ color: '#9DC77B' }}>48m</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart - Takes remaining space */}
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
                    <CartesianGrid strokeDasharray="2 2" stroke="#e5e7eb" horizontal={true} vertical={false} />
                    <XAxis
                      dataKey="hour"
                      axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tickLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
                      tick={{ fontSize: 9, fill: '#6B7280' }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
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
                      fill="#4B97F9"
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-full px-4 py-2">
        {/* Filter Controls - Minimal padding */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {['Daily', 'Weekly', 'Custom'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {filter}
                </button>
              ))}

              <div className="flex flex-wrap items-center gap-3 ml-0 lg:ml-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                  placeholder="Select Date"
                />
                
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white min-w-0"
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                >
                  <option value="All Meeting Rooms">All Meeting Rooms</option>
                  <option value="Meeting Room">Meeting Rooms</option>
                  <option value="Gym">Gym</option>
                  <option value="Phone Booth">Phone Booth</option>
                  <option value="Workspace">Workspace</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleExportCSV}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Export CSV
              </button>
              <button 
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-6 items-stretch">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
              <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total hours saved via Cancellation</h3>
              <div className="text-center flex-1 flex items-center justify-center">
                <p className="text-3xl font-bold text-blue-600">{summaryCards.totalCancelledHours}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
              <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total hours saved via Truncation</h3>
              <div className="text-center flex-1 flex items-center justify-center">
                <p className="text-3xl font-bold text-orange-600">{summaryCards.totalTruncatedHours}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between" style={{ width: '228px', height: '124px' }}>
              <h3 className="text-sm font-medium text-gray-600 text-center mb-3">Total Auto Bookings Made</h3>
              <div className="text-center flex-1 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-green-600">{summaryCards.totalAutoBookings}</p>
                <p className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>Bookings</p>
              </div>
            </div>

            {/* Top Rooms Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ width: '609px', height: '124px', padding: '12px' }}>
              <h3 className="font-medium text-gray-600 mb-3" style={{ fontSize: '14px' }}>Top 3 Meeting Rooms by occupancy</h3>
              <div className="space-y-2">
                {getTopRooms().map((room, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-32 text-gray-700 font-medium" style={{ fontSize: '10.4px' }}>
                      {room.name}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2 w-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${room.percentage}%`,
                            backgroundColor: getOccupancyColor(room.percentage),
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 w-8 text-right">
                      {room.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RESOURCE NAME</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER OF MEETINGS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MEETING HOURS</th>  
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">BOOKING OCCUPANCY (%)</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CANCELLED MEETINGS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CANCELLED HOURS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TRUNCATED MEETINGS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TRUNCATED HOURS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AUTO BOOKED MEETINGS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">AUTO BOOKING HOURS</th>
                  <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredResources().map((resource, index) => (
                  <React.Fragment key={resource.name}>
                    <tr 
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        handleResourceClick(resource);
                        handleExpandRow(resource.name);
                      }}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.cancelledMeetings}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.cancelledHours}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.truncatedMeetings}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.truncatedHours}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.autoBookedMeetings}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {resource.autoBookingHours}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandRow(resource.name);
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-150 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          {expandedRow === resource.name ? '−' : '>'}
                        </button>
                      </td>
                    </tr>
                    {renderExpandedCharts(resource.name)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            Showing 
            <select className="mx-1 border border-gray-300 rounded px-2 py-1 bg-white">
              <option>6</option>
            </select> 
            of 12
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              &lt;
            </button>
            <button 
              className={`px-3 py-1 rounded transition-colors ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button 
              className={`px-3 py-1 rounded transition-colors ${currentPage === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-gray-600 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;