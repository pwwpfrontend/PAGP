import React from 'react';

const SummaryCards = ({ summaryCards, getTopRooms, getOccupancyColor }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
      {/* Card 1 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-32 flex flex-col justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3 leading-tight">Total hours saved via<br />Cancellation</h3>
          <p className="text-2xl font-bold" style={{ color: '#4b97f9' }}>{summaryCards.totalCancelledHours}</p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-32 flex flex-col justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-3 leading-tight">Total hours saved via<br />Truncation</h3>
          <p className="text-2xl font-bold" style={{ color: '#d18409' }}>{summaryCards.totalTruncatedHours}</p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-32 flex flex-col justify-center">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-600 mb-2 leading-tight">Total Auto Bookings Made</h3>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold" style={{ color: '#9dc77b' }}>{summaryCards.totalAutoBookings}</p>
            <p className="text-xs text-gray-500 mt-1">Bookings</p>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 h-32">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Top 3 Meeting Rooms by occupancy</h3>
        <div className="space-y-2">
          {getTopRooms().map((room, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-20 text-xs text-gray-700 font-medium truncate">
                {room.name}
              </div>
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-1.5 w-full overflow-hidden">
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
  );
};

export default SummaryCards;

