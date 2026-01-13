// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Wrench, Package, AlertCircle, Users, CheckCircle, Clock } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    onSite: 0,
    inWorkshop: 0,
    borrowed: 0,
    available: 0,
    pendingLoans: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [toolsRes, loansRes] = await Promise.all([
        axios.get(`${API_URL}/api/tools`),
        axios.get(`${API_URL}/api/loans/pending`)
      ]);

      const toolsData = toolsRes.data;
      const pendingLoans = loansRes.data;

      // Hitung statistik
      const total = toolsData.length;
      const onSite = toolsData.filter(t => t.current_location === 'site').length;
      const inWorkshop = toolsData.filter(t => t.current_location === 'workshop').length;
      const borrowed = toolsData.filter(t => t.status === 'borrowed').length;
      const available = toolsData.filter(t => t.status === 'available').length;

      setTools(toolsData);
      setStats({
        total,
        onSite,
        inWorkshop,
        borrowed,
        available,
        pendingLoans: pendingLoans.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Monitoring</h1>
        <p className="text-gray-600">Selamat datang di sistem monitoring alat dan ATK PT TITIAN</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Wrench className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{stats.total}</h3>
              <p className="text-gray-500 text-sm">Total Alat</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{stats.onSite}</h3>
              <p className="text-gray-500 text-sm">Di Site</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{stats.borrowed}</h3>
              <p className="text-gray-500 text-sm">Sedang Dipinjam</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">{stats.pendingLoans}</h3>
              <p className="text-gray-500 text-sm">Menunggu Persetujuan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tools Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Daftar Alat Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Alat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update Terakhir</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tools.slice(0, 10).map(tool => (
                <tr key={tool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{tool.tool_name}</div>
                    <div className="text-sm text-gray-500">{tool.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {tool.serial_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.current_location === 'site' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tool.current_location}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : tool.status === 'borrowed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tool.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tool.last_borrower || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;