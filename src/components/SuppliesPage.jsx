// frontend/src/components/SuppliesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Search, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SuppliesPage = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    category: '',
    quantity: '',
    min_threshold: '',
    location: 'Warehouse'
  });

  useEffect(() => {
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/supplies`);
      setSupplies(response.data);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/supplies`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setShowForm(false);
      setFormData({
        item_name: '',
        category: '',
        quantity: '',
        min_threshold: '',
        location: 'Warehouse'
      });
      fetchSupplies();
      alert('ATK berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding supply:', error);
      alert('Gagal menambahkan ATK');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestATK = async (itemId, itemName) => {
    const quantity = prompt(`Berapa jumlah ${itemName} yang Anda butuhkan?`);
    if (quantity && !isNaN(quantity) && quantity > 0) {
      try {
        // API endpoint untuk request ATK (belum ada di backend, ini contoh)
        await axios.post(`${API_URL}/api/supplies/${itemId}/request`, {
          quantity: parseInt(quantity)
        });
        alert('Permintaan ATK berhasil diajukan!');
        fetchSupplies();
      } catch (error) {
        console.error('Error requesting ATK:', error);
        alert('Gagal mengajukan permintaan ATK');
      }
    }
  };

  // Filter supplies berdasarkan search term
  const filteredSupplies = supplies.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="mr-2" />
            ATK Inventory Management
          </h1>
          <p className="text-gray-600">Kelola alat tulis kantor dan perlengkapan</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="mr-2" size={18} />
          Tambah ATK
        </button>
      </div>

      {/* Form Tambah ATK */}
      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">Tambah Item ATK Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Item *
              </label>
              <input
                type="text"
                name="item_name"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.item_name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori *
              </label>
              <select
                name="category"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Pilih Kategori</option>
                <option value="Stationery">Stationery</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Perlengkapan Kantor">Perlengkapan Kantor</option>
                <option value="Kertas">Kertas</option>
                <option value="PPE">PPE (Alat Pelindung Diri)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi *
              </label>
              <select
                name="location"
                required
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="Warehouse">Warehouse</option>
                <option value="Office">Office</option>
                <option value="Site">Site</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah *
              </label>
              <input
                type="number"
                name="quantity"
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stok *
              </label>
              <input
                type="number"
                name="min_threshold"
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.min_threshold}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="ml-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Cari ATK..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ATK Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lokasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min. Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSupplies.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data ATK
                </td>
              </tr>
            ) : (
              filteredSupplies.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.item_name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4 font-medium">{item.quantity}</td>
                  <td className="px-6 py-4">{item.min_threshold}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {item.quantity <= item.min_threshold ? (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-600 text-sm">Stok Rendah</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-600 text-sm">Aman</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRequestATK(item.id, item.item_name)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Minta
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-xl">{supplies.length}</div>
          <div className="text-gray-600">Total Item</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 font-bold text-xl">
            {supplies.filter(item => item.quantity > item.min_threshold).length}
          </div>
          <div className="text-gray-600">Stok Aman</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 font-bold text-xl">
            {supplies.filter(item => item.quantity <= item.min_threshold).length}
          </div>
          <div className="text-gray-600">Stok Rendah</div>
        </div>
      </div>
    </div>
  );
};

export default SuppliesPage;