import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ToolLoanForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    tool_id: '',
    purpose: '',
    expected_return: '',
    notes: ''
  });
  
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTools, setAvailableTools] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tools`);
        setTools(response.data);
        
        const available = response.data.filter(tool => 
          tool.status === 'Available' || tool.status === 'Workshop'
        );
        setAvailableTools(available);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    };

    fetchTools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!form.tool_id || !form.purpose || !form.expected_return) {
      setErrorMessage('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (new Date(form.expected_return) < new Date()) {
      setErrorMessage('Expected return date cannot be in the past');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/loans`, {
        tool_id: parseInt(form.tool_id),
        user_id: user?.id || 1,
        purpose: form.purpose,
        expected_return: form.expected_return,
        notes: form.notes
      });

      if (response.data.success) {
        setSuccessMessage('Loan request submitted successfully! Waiting for approval.');
        
        setForm({
          tool_id: '',
          purpose: '',
          expected_return: '',
          notes: ''
        });

        const toolsResponse = await axios.get(`${API_URL}/api/tools`);
        setTools(toolsResponse.data);
        
        const available = toolsResponse.data.filter(tool => 
          tool.status === 'available' || tool.status === 'workshop'
        );
        setAvailableTools(available);
      }
    } catch (error) {
      console.error('Error submitting loan request:', error);
      setErrorMessage(error.response?.data?.error || 'Failed to submit loan request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FileText className="mr-2" />
        Equipment Loan Request
      </h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded flex items-center">
          <AlertCircle className="mr-2" size={16} />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Equipment *
            </label>
            <select
              name="tool_id"
              value={form.tool_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Select Equipment --</option>
              {availableTools.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.tool_name} ({tool.serial_number}) - {tool.current_location}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Available tools: {availableTools.length} of {tools.length}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Return Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input
                type="date"
                name="expected_return"
                value={form.expected_return}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Loan *
          </label>
          <textarea
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Please describe why you need to borrow this equipment..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="2"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Any additional information..."
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Requestor Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user?.name || 'Not logged in'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-medium">{user?.employee_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-medium">{user?.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Request Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setForm({
                tool_id: '',
                purpose: '',
                expected_return: '',
                notes: ''
              });
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Loan Request'}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Available Equipment</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availableTools.slice(0, 5).map(tool => (
                <tr key={tool.id}>
                  <td className="px-4 py-3">{tool.tool_name}</td>
                  <td className="px-4 py-3 font-mono text-sm">{tool.serial_number}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.current_location === 'site' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tool.current_location}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tool.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tool.status}
                    </span>
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

export default ToolLoanForm;