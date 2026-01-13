// frontend/src/components/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Wrench, Package, ClipboardList, 
  User, LogOut, Shield 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  TITIAN Monitoring
                </span>
              </div>
              
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link 
                    to="/" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  
                  <Link 
                    to="/loan" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center"
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    Pinjam Alat
                  </Link>
                  
                  <Link 
                    to="/supplies" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    ATK
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/approvals" 
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center"
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      Approvals
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* User menu */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-700 hidden md:block">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-gray-500 text-xs flex items-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        user?.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role === 'admin' ? 'Admin' : 'Karyawan'}
                      </span>
                      <span className="ml-2">{user?.department}</span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <button 
                    onClick={logout}
                    className="ml-2 text-gray-700 hover:text-blue-600 flex items-center"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} PT TITIAN - Oil & Gas Technology Services</p>
            <p className="mt-1">Equipment & ATK Monitoring System v1.0</p>
            {/* <p className="mt-1">
              Products: H2O Analyzer | H2S Analyzer | Smart Power Management Controller | Weather Monitoring System
            </p> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;