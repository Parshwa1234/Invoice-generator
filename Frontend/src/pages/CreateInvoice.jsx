import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../api/axiosConfig';
import './CreateInvoice.css';

function CreateInvoice() {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const { userId } = useAuth();

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    amount: '',
    description: ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [pdfBase64, setPdfBase64] = useState(null); // Store the PDF for emailing

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveAndDownload = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Generate PDF
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.invoiceNumber}.pdf`);

      // Store the PDF as Base64 so we can email it later
      const base64String = pdf.output('datauristring').split(',')[1];
      setPdfBase64(base64String);

      // 2. Save to backend
      const invoicePayload = {
        invoiceNumber: formData.invoiceNumber,
        userId: userId,
        client: {
          name: formData.clientName,
          email: formData.clientEmail
        },
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: parseFloat(formData.amount),
        status: 'UNPAID',
        lineItems: [
          {
            description: formData.description,
            quantity: 1,
            unitPrice: parseFloat(formData.amount),
            total: parseFloat(formData.amount)
          }
        ]
      };

      await api.post('/invoices', invoicePayload);
      setSaved(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  };

  // Sends the PDF as an email attachment via the backend
  const handleSendEmail = async () => {
    setSending(true);
    try {
      await api.post('/invoices/send-email', {
        toEmail: formData.clientEmail,
        clientName: formData.clientName,
        invoiceNumber: formData.invoiceNumber,
        amount: parseFloat(formData.amount).toFixed(2),
        pdfBase64: pdfBase64
      });
      setEmailSent(true);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Check backend logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="create-page">
      {/* LEFT — Form */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Create Invoice</h2>
          <p>Fill in the details to generate a professional invoice</p>
        </div>

        <form onSubmit={handleSaveAndDownload}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Invoice Number</label>
              <input type="text" name="invoiceNumber" value={formData.invoiceNumber} readOnly />
            </div>

            <div className="form-group">
              <label>Client Name</label>
              <input type="text" name="clientName" required value={formData.clientName} onChange={handleInputChange} placeholder="e.g. Acme Corp" />
            </div>

            <div className="form-group">
              <label>Client Email</label>
              <input type="email" name="clientEmail" required value={formData.clientEmail} onChange={handleInputChange} placeholder="e.g. billing@acme.com" />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <input type="text" name="description" required value={formData.description} onChange={handleInputChange} placeholder="e.g. Web Development Services" />
            </div>

            <div className="form-group full">
              <label>Total Amount ($)</label>
              <input type="number" name="amount" required min="0" step="0.01" value={formData.amount} onChange={handleInputChange} placeholder="e.g. 1500.00" />
            </div>
          </div>

          {!saved ? (
            <button type="submit" disabled={saving} className="btn-primary full-width">
              {saving ? '⏳ Generating...' : '📄 Generate PDF & Save'}
            </button>
          ) : (
            <div className="success-actions">
              <div className="success-banner">
                ✅ Invoice saved & PDF downloaded!
              </div>
              <div className="action-buttons">
                {!emailSent ? (
                  <button type="button" className="btn-primary" onClick={handleSendEmail} disabled={sending}>
                    {sending ? '⏳ Sending...' : '✉️ Send PDF via Email'}
                  </button>
                ) : (
                  <div className="email-sent-banner">
                    ✅ Email sent to {formData.clientEmail}!
                  </div>
                )}
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* RIGHT — Live PDF Preview */}
      <div className="preview-card">
        <div className="preview-label">Live Preview</div>
        <div className="pdf-template" ref={invoiceRef}>
          <div className="pdf-accent-bar"></div>
          <div className="pdf-header">
            <div>
              <h1 className="pdf-title">INVOICE</h1>
              <p className="pdf-subtitle">{formData.invoiceNumber}</p>
            </div>
            <div className="pdf-meta">
              <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p><strong>Due:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="pdf-bill-to">
            <span className="pdf-label">BILL TO</span>
            <p className="pdf-client-name">{formData.clientName || 'Client Name'}</p>
            <p className="pdf-client-email">{formData.clientEmail || 'client@email.com'}</p>
          </div>

          <table className="pdf-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formData.description || 'Service description'}</td>
                <td style={{ textAlign: 'right' }}>${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}</td>
              </tr>
            </tbody>
          </table>

          <div className="pdf-total-row">
            <span>Total Due</span>
            <span className="pdf-total-amount">${formData.amount ? parseFloat(formData.amount).toFixed(2) : '0.00'}</span>
          </div>

          <div className="pdf-footer">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;
