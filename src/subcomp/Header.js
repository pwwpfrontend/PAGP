// components/Header.js
import React from "react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="bg-[#ffffff] custom-shadow h-8 lg:h-20 xl:h-[80px] fixed top-0 left-0 w-full z-10 flex items-center justify-between">
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
  );
};

export default Header;
