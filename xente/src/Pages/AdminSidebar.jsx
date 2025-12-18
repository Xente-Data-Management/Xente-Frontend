import React from 'react';
import { Users, Home, BarChart3, X } from 'lucide-react';

// ============================================
// ADMIN SIDEBAR COMPONENT
// ============================================
export const AdminSidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'ambassadors', label: 'Ambassadors', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <img 
                src="/xenteLogo1.png" 
                alt="Xente Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-white font-bold text-lg">Admin Portal</span>
            </div>
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};