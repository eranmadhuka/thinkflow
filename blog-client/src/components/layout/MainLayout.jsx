import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
            fixed top-14 left-0 w-64 h-[calc(100%-3rem)] z-50 
            transform transition-transform duration-300 ease-in-out
            lg:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 justify-center w-full mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pt-10">
          <div className="flex w-full max-w-full mx-auto">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 mr-6 h-fit static">
              <Sidebar />
            </div>

            {/* Main Content Column */}
            <main className="flex-1 max-w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
