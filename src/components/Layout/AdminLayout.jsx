import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderAdmin from './HeaderAdmin';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderAdmin
        isSidebarOpen={sidebarOpen}
        setIsSidebarOpen={setSidebarOpen}
      />

      <div className="flex pt-[60px]">
        <AdminSidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
