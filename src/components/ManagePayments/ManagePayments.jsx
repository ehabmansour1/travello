import React, { useState, useEffect } from 'react';
import './ManagePayments.css';

const samplePayments = [
  {
    id: 'INV-2024-001',
    booking_id: 'BK001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    tour: {
      name: 'Swiss Alps Tour',
      date: '2024-06-15'
    },
    amount: 2499,
    method: 'fawry',
    reference: 'FWY123456789',
    status: 'paid',
    date: '2024-02-15T10:30:00',
    metadata: {
      receipt_url: 'https://...',
      transaction_id: '123456789',
      payment_gateway_response: {}
    }
  },
  {
    id: 'INV-2024-002',
    booking_id: 'BK002',
    customer: {
      name: 'Sarah Smith',
      email: 'sarah@example.com'
    },
    tour: {
      name: 'Thailand Paradise',
      date: '2024-07-01'
    },
    amount: 1899,
    method: 'paymob',
    reference: 'PMB987654321',
    status: 'pending',
    date: '2024-02-18T14:45:00',
    metadata: {
      payment_link: 'https://...',
      expiry: '2024-02-19T14:45:00'
    }
  }
];

const ManagePayments = () => {
  // States
  const [payments] = useState(samplePayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [modalContent, setModalContent] = useState(null);

  // Filtering payments عند تغيير المدخلات أو الفلاتر
  useEffect(() => {
    filterPayments();
  }, [searchTerm, statusFilter, dateFilter, methodFilter, payments]);

  const filterPayments = () => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = payments.filter(payment => {
      const matchesSearch =
        payment.id.toLowerCase().includes(lowerSearch) ||
        payment.customer.name.toLowerCase().includes(lowerSearch) ||
        payment.customer.email.toLowerCase().includes(lowerSearch);
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
      
      // يمكن إضافة منطق تصفية التاريخ هنا إذا لزم الأمر

      return matchesSearch && matchesStatus && matchesMethod;
    });
    setFilteredPayments(filtered);
  };

  // حساب الإحصائيات
  const computeStats = () => {
    const totalRevenue = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const successfulPayments = payments.filter(p => p.status === 'paid');
    const failedPayments = payments.filter(p => p.status === 'failed');
    const successRate = payments.length ? ((successfulPayments.length / payments.length) * 100).toFixed(1) : 0;
    const failureRate = payments.length ? ((failedPayments.length / payments.length) * 100).toFixed(1) : 0;
    return { totalRevenue, pendingPaymentsCount: pendingPayments.length, pendingAmount, successfulPaymentsCount: successfulPayments.length, successRate, failedPaymentsCount: failedPayments.length, failureRate };
  };

  const stats = computeStats();

  // إجراءات تجريبية (يمكن تعديلها لاحقاً)
  const exportReport = () => {
    alert('Exporting payment report...');
  };

  const showPaymentDetails = (payment) => {
    setModalContent({
      type: 'details',
      payment,
    });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const resendPaymentLink = () => {
    alert('Payment link resent successfully!');
  };

  const cancelPayment = () => {
    if (window.confirm('Are you sure you want to cancel this payment?')) {
      alert('Payment cancelled successfully!');
      // هنا يمكن تحديث الحالة أو إرسال طلب الإلغاء للسيرفر
    }
  };

  const issueRefund = (payment) => {
    setModalContent({
      type: 'refund',
      payment,
    });
  };

  const downloadReceipt = () => {
    alert('Downloading receipt...');
  };

  const processRefund = (e) => {
    e.preventDefault();
    alert('Refund processed successfully!');
    closeModal();
    // يمكن تحديث الحالة هنا بعد معالجة الاسترداد
  };

  return (
    <div className="mp-admin-tab" id="payments">
      <div className="mp-admin-header">
        <h2>Payment Management</h2>
        <div className="mp-header-actions">
          <div className="mp-search-filters">
            <input
              type="text"
              className="mp-search-input"
              placeholder="Search by invoice ID or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="mp-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select className="mp-filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <select className="mp-filter-select" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="fawry">Fawry Pay</option>
              <option value="paymob">Paymob</option>
              <option value="card">Credit Card</option>
            </select>
          </div>
          <button className="mp-btn-secondary" onClick={exportReport}>
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <div className="mp-stats-grid">
        <div className="mp-stat-card primary">
          <div className="mp-stat-icon">
            <i className="fas fa-money-check-alt"></i>
          </div>
          <div className="mp-stat-info">
            <h3>Total Revenue</h3>
            <div className="mp-stat-value" id="totalRevenue">${stats.totalRevenue.toLocaleString()}</div>
            <div className="mp-stat-change positive">
              <i className="fas fa-arrow-up"></i> <span id="revenueGrowth">0%</span>
            </div>
          </div>
        </div>

        <div className="mp-stat-card warning">
          <div className="mp-stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="mp-stat-info">
            <h3>Pending Payments</h3>
            <div className="mp-stat-value" id="pendingCount">{stats.pendingPaymentsCount}</div>
            <div className="mp-stat-change">
              <span id="pendingAmount">${stats.pendingAmount.toLocaleString()}</span> total
            </div>
          </div>
        </div>

        <div className="mp-stat-card success">
          <div className="mp-stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="mp-stat-info">
            <h3>Successful Payments</h3>
            <div className="mp-stat-value" id="successCount">{stats.successfulPaymentsCount}</div>
            <div className="mp-stat-change positive">
              <span id="successRate">{stats.successRate}%</span> success rate
            </div>
          </div>
        </div>

        <div className="mp-stat-card danger">
          <div className="mp-stat-icon">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="mp-stat-info">
            <h3>Failed Payments</h3>
            <div className="mp-stat-value" id="failedCount">{stats.failedPaymentsCount}</div>
            <div className="mp-stat-change">
              <span id="failureRate">{stats.failureRate}%</span> failure rate
            </div>
          </div>
        </div>
      </div>

      <div className="mp-payments-table">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Tour</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="paymentsTableBody">
            {filteredPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.id}</td>
                <td>
                  <div className="mp-customer-info">
                    <div>{payment.customer.name}</div>
                    <div className="mp-text-muted">{payment.customer.email}</div>
                  </div>
                </td>
                <td>
                  <div className="mp-tour-info">
                    <div>{payment.tour.name}</div>
                    <div className="mp-text-muted">{new Date(payment.tour.date).toLocaleDateString()}</div>
                  </div>
                </td>
                <td>${payment.amount.toLocaleString()}</td>
                <td>
                  <div className={`mp-payment-method ${payment.method}`}>
                    {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                  </div>
                </td>
                <td>
                  <span className={`mp-status-badge ${payment.status}`}>{payment.status}</span>
                </td>
                <td>{new Date(payment.date).toLocaleString()}</td>
                <td>
                  <div className="mp-action-buttons">
                    <button className="mp-btn-secondary" onClick={() => showPaymentDetails(payment)}>
                      <i className="fas fa-eye"></i>
                    </button>
                    {payment.status === 'pending' && (
                      <>
                        <button className="mp-btn-primary" onClick={() => resendPaymentLink(payment)}>
                          <i className="fas fa-paper-plane"></i>
                        </button>
                        <button className="mp-btn-danger" onClick={() => cancelPayment(payment)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                    {payment.status === 'paid' && (
                      <button className="mp-btn-warning" onClick={() => issueRefund(payment)}>
                        <i className="fas fa-undo"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalContent && (
        <div className="mp-modal">
          {modalContent.type === 'details' && (
            <div className="mp-modal-content mp-payment-details">
              <h2>Payment Details</h2>
              <div className="mp-details-grid">
                <div className="mp-detail-section">
                  <h3>Basic Information</h3>
                  <div className="mp-detail-row">
                    <span>Invoice ID:</span>
                    <span>{modalContent.payment.id}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Booking ID:</span>
                    <span>{modalContent.payment.booking_id}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Status:</span>
                    <span className={`mp-status-badge ${modalContent.payment.status}`}>
                      {modalContent.payment.status}
                    </span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Amount:</span>
                    <span>${modalContent.payment.amount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mp-detail-section">
                  <h3>Payment Method</h3>
                  <div className="mp-detail-row">
                    <span>Method:</span>
                    <span>{modalContent.payment.method.charAt(0).toUpperCase() + modalContent.payment.method.slice(1)}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Reference:</span>
                    <span>{modalContent.payment.reference}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Date:</span>
                    <span>{new Date(modalContent.payment.date).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mp-detail-section">
                  <h3>Customer Information</h3>
                  <div className="mp-detail-row">
                    <span>Name:</span>
                    <span>{modalContent.payment.customer.name}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Email:</span>
                    <span>{modalContent.payment.customer.email}</span>
                  </div>
                </div>
                <div className="mp-detail-section">
                  <h3>Tour Details</h3>
                  <div className="mp-detail-row">
                    <span>Tour:</span>
                    <span>{modalContent.payment.tour.name}</span>
                  </div>
                  <div className="mp-detail-row">
                    <span>Date:</span>
                    <span>{new Date(modalContent.payment.tour.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="mp-modal-actions">
                <button className="mp-btn-secondary" onClick={closeModal}>Close</button>
                {modalContent.payment.status === 'paid' && (
                  <button className="mp-btn-primary" onClick={() => downloadReceipt(modalContent.payment)}>
                    <i className="fas fa-download"></i> Download Receipt
                  </button>
                )}
              </div>
            </div>
          )}
          {modalContent.type === 'refund' && (
            <div className="mp-modal-content">
              <h2>Issue Refund</h2>
              <form onSubmit={(e) => processRefund(e, modalContent.payment)} id="refundForm">
                <div className="mp-form-group">
                  <label>Refund Amount</label>
                  <input
                    type="number"
                    className="mp-form-input"
                    max={modalContent.payment.amount}
                    defaultValue={modalContent.payment.amount}
                    required
                  />
                </div>
                <div className="mp-form-group">
                  <label>Reason for Refund</label>
                  <select className="mp-form-input" required>
                    <option value="customer_request">Customer Request</option>
                    <option value="service_issue">Service Issue</option>
                    <option value="booking_cancellation">Booking Cancellation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mp-form-group">
                  <label>Notes</label>
                  <textarea className="mp-form-input" rows="3"></textarea>
                </div>
                <div className="mp-modal-actions">
                  <button type="button" className="mp-btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="mp-btn-warning">Process Refund</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
