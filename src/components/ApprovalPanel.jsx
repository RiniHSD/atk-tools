import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ApprovalPanel = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(1);

  const fetchPendingLoans = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/loans/pending`);
      setPendingLoans(response.data);
    } catch (error) {
      console.error('Error fetching pending loans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
    
    const userData = localStorage.getItem('titian_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
  }, []);

  const handleApprove = async (loanId) => {
    try {
      await axios.put(`${API_URL}/api/loans/${loanId}/approve`, {
        approved_by: currentUserId
      });
      
      fetchPendingLoans();
      alert('Loan approved successfully!');
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('Failed to approve loan');
    }
  };

  const handleReject = async (loanId) => {
    if (window.confirm('Are you sure you want to reject this loan request?')) {
      try {
        // Anda mungkin perlu membuat endpoint untuk reject, sementara kita anggap ada endpoint yang sama dengan status rejected
        await axios.put(`${API_URL}/api/loans/${loanId}/reject`, {
          rejected_by: currentUserId
        });
        
        fetchPendingLoans();
        alert('Loan rejected!');
      } catch (error) {
        console.error('Error rejecting loan:', error);
        alert('Failed to reject loan');
      }
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
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
      
      {pendingLoans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending loan requests
        </div>
      ) : (
        pendingLoans.map(loan => (
          <div key={loan.id} className="border border-gray-200 p-4 mb-3 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-lg">{loan.tool_name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Serial:</strong> {loan.serial_number}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Requested by:</strong> {loan.borrower_name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Loan Date:</strong> {new Date(loan.loan_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Expected Return:</strong> {new Date(loan.expected_return).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Purpose:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                    {loan.purpose}
                  </p>
                </div>
              </div>
              
              <div className="space-x-2 ml-4">
                <button 
                  onClick={() => handleApprove(loan.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(loan.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovalPanel;