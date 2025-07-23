import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  Wind,
  History,
} from "lucide-react";
import { CpuIcon, MapPinCheck, WindIcon, ChartSpline, LayoutDashboard, Dumbbell, Eye, UserPen } from "lucide-react";


export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [openDropdown, setOpenDropdown] = useState("Real Time Data");

  // Static menu items (no longer dependent on user roles)
  const menuItems = [
    {
      name: "Real Time Data",
      alwaysOpen: true,
      children: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: <LayoutDashboard className="text-gray-600" size={21} />,
        },
        {
          name: "Gym",
          path: "/gym",
          icon: <Dumbbell className="text-gray-600" size={21} />,
        },
        {
          name: "Air Quality",
          path: "/iaq",
          icon: <Wind className="text-gray-600" size={21} />,
        },
      ],
    },
    {
      name: "History & Trends",
      children: [
        {
          name: "Historical Data",
          path: "/historical",
          icon: <History className="text-gray-600" size={21} />,
        },
      ],
    },
    {
      name: "Concierge",
      path: "/concierge", 
      icon: <Eye className="text-gray-600" size={21} />,
    },
    {
      name: "Floor Plan",
      path: "/floorplan", 
      icon:  <svg
      className="w-5 h-5 text-gray-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>,
    },
    {
      name: "Settings",
      children: [
        {
          name: "Manage Devices",
          path: "/devices",
          icon: <CpuIcon className="text-gray-600" size={21} />,
        },
      
  
        {
          name: "Access Roles",
          path: "/roles",
          icon: <UserPen className="text-gray-600" size={21} />,
        },
      ],
    },
  ];

  // Helper function to check if a path is active
  const isPathActive = (itemPath, childPath = null) => {
    const currentPath = location.pathname;
    
    if (childPath) {
      return currentPath === childPath;
    }
    
    if (itemPath === "/dashboard" && (currentPath === "/" || currentPath === "/dashboard")) {
      return true;
    }
    
    return currentPath === itemPath;
  };

  // Helper function to check if any child is active (for parent highlighting)
  const hasActiveChild = (children) => {
    if (!children) return false;
    return children.some(child => isPathActive(null, child.path));
  };

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  // Auto-expand Real Time Data section
  useEffect(() => {
    const currentPath = location.pathname;
    const realTimeDataPaths = ["/iaq", "/leakage", "/dashboard"];
    const historyTrendsPaths = ["/historical"];
    
    if (realTimeDataPaths.includes(currentPath)) {
      setOpenDropdown("Real Time Data");
    } else if (historyTrendsPaths.includes(currentPath)) {
      setOpenDropdown("History & Trends");
    }
  }, [location.pathname]);

  // Filter menu items based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems
        .map((item) => {
          const matchingChildren = item.children?.filter((child) =>
            child.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) || [];

          if (
            matchingChildren.length > 0 ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return { ...item, children: matchingChildren };
          }

          return null;
        })
        .filter(Boolean);

      setFilteredItems(filtered);

      if (filtered.length > 0) {
        setOpenDropdown(filtered[0].name);
      }
    }
  }, [searchQuery]);

  // Handle "Cmd + K" to focus the search bar
useEffect(() => {
  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      
      // Open sidebar if not already open
      if (!isSidebarOpen) {
        setIsSidebarOpen(true);
      }
      
      // Focus and select all text in search bar with a small delay to ensure sidebar is open
      setTimeout(() => {
        const searchBar = document.getElementById("search-bar");
        if (searchBar) {
          searchBar.focus();
          searchBar.select(); 
        }
      }, 100);
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isSidebarOpen, setIsSidebarOpen]);

  const handleNavigate = (path, isChild = false) => {
    if (path !== "#") {
      const currentPath = location.pathname;
      
      const isCurrentlyActive = isChild ? 
        currentPath === path :
        (path === "/dashboard" && (currentPath === "/" || currentPath === "/dashboard")) ||
        currentPath === path;
      
      if (isCurrentlyActive) {
        setIsSidebarOpen(false);
      } else {
        navigate(path);
      }
    }
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-200 ${
          isSidebarOpen ? "opacity-100 visible z-20" : "opacity-0 invisible"
        }`}
      ></div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg w-[366px] transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-30`}
      >
        <div className="flex items-center justify-between pt-3 pl-4 pb-2 pr-4">
          <div className="flex items-center">
            <img 
              src="/PAG.png" 
              alt="PAG Logo" 
              className="h-12" 
              onError={(e) => {
                e.target.style.display = 'none';
              }} 
            />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-14 pt-4 h-8 flex items-center justify-center font-semibold text-gray-500 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative p-4 mb-3">
          <input
            id="search-bar"
            type="text"
            placeholder="Search"
            className="w-[96%] pl-10 pr-4 py-2 border border-[#a32b13a5] text-gray-600 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a32b13a5]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0,0,256,256"
            >
              <g
                fill="#4d4d4d"
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
                <g transform="scale(8.53333,8.53333)">
                  <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
                </g>
              </g>
            </svg>
          </span>
          <span className="absolute right-[68px] top-1/2 transform -translate-y-1/2 border border-[#a32b13a5] text-[#a32b13a5] text-xs font-semibold px-2 py-1 rounded mr-1">
            ⌘
          </span>
          <span className="absolute right-10 top-1/2 transform -translate-y-1/2 border border-[#a32b13a5] text-[#a32b13a5] font-medium text-xs px-2 py-1 rounded">
            K
          </span>
        </div>

        <ul>
          {filteredItems.map((item, index) => {
            const isActive = hasActiveChild(item.children);
            
            return (
             <li key={index} className="mb-3">
  {item.children ? (
    // Render dropdown for items with children
    <>
      <button
        className={`
          flex items-center justify-between w-full px-4 py-2 text-left font-semibold
          ${
            isActive || openDropdown === item.name
              ? "bg-gray-200 text-gray-700 "
              : "text-gray-700 hover:bg-gray-100"
          }
          transition
        `}
        onClick={() =>
          setOpenDropdown(openDropdown === item.name ? "" : item.name)
        }
      >
        <span>{item.name}</span>
        {openDropdown === item.name ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {openDropdown === item.name && (
        <ul className="pl-6 mt-2">
          {item.children.map((child, childIndex) => {
            const isChildActive = isPathActive(null, child.path);
            
            return (
              <li key={childIndex} className="mb-2 mt-2">
                <button
                  className={`
                    w-full flex items-center px-3 py-2 text-left rounded-md transition
                    ${
                      isChildActive
                        ? "bg-gray-100 text-black font-normal text-sm"
                        : "text-black hover:bg-gray-100 font-normal text-sm"
                    }
                    ${child.disabled ? "text-gray-400 cursor-not-allowed" : ""}
                  `}
                  onClick={() => !child.disabled && handleNavigate(child.path, true)}
                  disabled={child.disabled}
                >
                  <span className="mr-3">{child.icon}</span>
                  {child.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  ) : (
    //single menu
    <button
      className={`
        w-full flex items-center px-4 py-2 text-left font-semibold rounded-md transition
        ${
          isPathActive(null, item.path)
            ? "bg-gray-200 text-gray-700"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
      onClick={() => handleNavigate(item.path, false)}
    >
      <span className="mr-3">{item.icon}</span>
      {item.name}
    </button>
  )}
</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}