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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex justify-center flex-1 w-full mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 pt-10">
        <div className="flex w-full max-w-full mx-auto">
          {/* Sidebar - Mobile & Desktop Responsive */}
          <div
            className={`
              hidden lg:block lg:w-64 mr-6 
              ${sidebarOpen ? "block" : "hidden"}
            `}
          >
            <Sidebar />
          </div>

          {/* Mobile Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 w-64 z-50 
              transform transition-transform duration-300 ease-in-out
              lg:hidden
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar />
          </div>

          {/* Main Content Column */}
          <main className="flex-1 max-w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
