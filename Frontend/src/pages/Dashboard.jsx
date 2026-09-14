import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Dashboard.css';

function Dashboard() {
  const { userId } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchInvoices();
    }
  }, [userId]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get(`/invoices/user/${userId}`);
      setInvoices(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch invoices", err);
      setError("Could not load invoices. Make sure your backend is running!");
      setLoading(false);
    }
  };

  const handleMarkPaid = async (invoiceId) => {
    try {
      const response = await api.put(`/invoices/mark-paid/${invoiceId}`);
      // Update the invoice in local state so UI updates instantly
      setInvoices(invoices.map(inv =>
        inv.id === invoiceId ? response.data : inv
      ));
    } catch (err) {
      console.error("Failed to mark as paid", err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${invoiceId}`);
      // Remove from local state so UI updates instantly
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    } catch (err) {
      console.error("Failed to delete invoice", err);
      alert("Failed to delete invoice.");
    }
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const paidCount = invoices.filter(inv => inv.status === 'PAID').length;
  const unpaidCount = invoices.filter(inv => inv.status !== 'PAID').length;

  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading your invoices...</p>
    </div>
  );

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-info">
            <span className="stat-label">Total Invoices</span>
            <span className="stat-value">{invoices.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">${totalRevenue.toFixed(2)}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Paid</span>
            <span className="stat-value">{paidCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-label">Unpaid</span>
            <span className="stat-value">{unpaidCount}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="section-header">
        <h2>Recent Invoices</h2>
        <Link to="/create" className="btn-primary">+ New Invoice</Link>
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No invoices yet</h3>
          <p>Create your first invoice to get started!</p>
          <Link to="/create" className="btn-primary" style={{ marginTop: '1.5rem' }}>
            + Create Invoice
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="invoice-number">{invoice.invoiceNumber || 'INV-001'}</td>
                  <td>
                    <div className="client-cell">
                      <span className="client-name">{invoice.client?.name || 'Unknown'}</span>
                      <span className="client-email">{invoice.client?.email || ''}</span>
                    </div>
                  </td>
                  <td className="date-cell">{new Date(invoice.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="amount-cell">${(invoice.totalAmount || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${invoice.status?.toLowerCase()}`}>
                      {invoice.status || 'DRAFT'}
                    </span>
                  </td>
                  <td>
                    <div className="action-cell">
                      {invoice.status !== 'PAID' && (
                        <button
                          className="btn-action btn-paid"
                          onClick={() => handleMarkPaid(invoice.id)}
                          title="Mark as Paid"
                        >
                          ✅ Paid
                        </button>
                      )}
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(invoice.id)}
                        title="Delete Invoice"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
