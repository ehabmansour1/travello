import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './AdminOverview.css';

const AdminOverview = () => {
    const revenueChartRef = useRef(null);
    const bookingsChartRef = useRef(null);
    const revenueChartInstance = useRef(null);
    const bookingsChartInstance = useRef(null);

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue',
            data: [30000, 45000, 35000, 50000, 42000, 55000],
            borderColor: '#ff3366',
            backgroundColor: 'rgba(255, 51, 102, 0.1)',
            fill: true
        }]
    };

    const bookingsData = {
        labels: ['Swiss Alps', 'Thailand', 'Italy', 'Greece', 'Japan'],
        datasets: [{
            label: 'Bookings',
            data: [65, 45, 35, 28, 25],
            backgroundColor: [
                'rgba(255, 51, 102, 0.8)',
                'rgba(255, 153, 51, 0.8)',
                'rgba(51, 255, 153, 0.8)',
                'rgba(51, 153, 255, 0.8)',
                'rgba(153, 51, 255, 0.8)'
            ]
        }]
    };

    useEffect(() => {
        const cleanup = () => {
            if (revenueChartInstance.current) revenueChartInstance.current.destroy();
            if (bookingsChartInstance.current) bookingsChartInstance.current.destroy();
        };

        if (revenueChartRef.current) {
            cleanup();
            revenueChartInstance.current = new Chart(revenueChartRef.current, {
                type: 'line',
                data: revenueData,
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        },
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        if (bookingsChartRef.current) {
            bookingsChartInstance.current = new Chart(bookingsChartRef.current, {
                type: 'bar',
                data: bookingsData,
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        },
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'rgba(255, 255, 255, 0.7)' }
                        }
                    }
                }
            });
        }

        return cleanup;
    }, []);

    return (
        <section id="overview" className="admin-tab active">
            <div className="admin-header">
                <h1>Dashboard Overview</h1>
                <div className="date-filter">
                    <select className="filter-select">
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month" selected>This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>
            <div className="stats-grid">
                {/* هنا يمكن وضع بطاقات الإحصائيات كما في الكود الأصلي */}
                <div className="stat-card primary">
                    <div className="stat-icon">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <div className="stat-value">$124,563</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i> 12.5%
                        </div>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <div className="stat-value">1,234</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i> 8.3%
                        </div>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Total Bookings</h3>
                        <div className="stat-value">856</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i> 5.2%
                        </div>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">
                        <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Average Rating</h3>
                        <div className="stat-value">4.8</div>
                        <div className="stat-change positive">
                            <i className="fas fa-arrow-up"></i> 2.1%
                        </div>
                    </div>
                </div>
                {/* بقية البطاقات ... */}
            </div>
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Revenue Overview</h3>
                    <canvas ref={revenueChartRef}></canvas>
                </div>
                <div className="chart-card">
                    <h3>Bookings by Tour</h3>
                    <canvas ref={bookingsChartRef}></canvas>
                </div>
            </div>
            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-calendar-check"></i>
                        </div>
                        <div className="activity-content">
                            <div className="activity-text">
                                <strong>John Doe</strong> - New booking: Swiss Alps Tour
                            </div>
                            <div className="activity-time">2 minutes ago</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminOverview;
