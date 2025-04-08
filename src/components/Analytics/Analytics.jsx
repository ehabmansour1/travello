import React, { useEffect, useState, useRef } from 'react';
import './Analytics.css';
import { Chart } from 'chart.js/auto';

const Analytics = () => {
  const chartRefs = useRef([]);
  const [activeFilter, setActiveFilter] = useState('pageViews');
  const [activeDestFilter, setActiveDestFilter] = useState('revenue');
  const [chartsInitialized, setChartsInitialized] = useState(false);

  useEffect(() => {
    const initializeCharts = () => {
      // Clean up existing charts
      chartRefs.current.forEach(chart => {
        if (chart) chart.destroy();
      });

      const trafficEl = document.getElementById('trafficChart');
      const revenueEl = document.getElementById('revenueChart');
      const destinationsEl = document.getElementById('destinationsChart');

      if (!trafficEl || !revenueEl || !destinationsEl) {
        console.log('Chart elements not ready, retrying...');
        return false;
      }

      try {
        const trafficChart = new Chart(trafficEl, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Page Views',
              data: [45000, 48000, 52000, 49000, 54000, 58000],
              borderColor: '#ff3366',
              backgroundColor: 'rgba(255, 51, 102, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: {
                mode: 'index',
                intersect: false,
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: {
                  callback: value => value.toLocaleString()
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'nearest'
            }
          }
        });

        const revenueChart = new Chart(revenueEl, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{
              label: 'Revenue',
              data: [98500, 105200, 115600],
              backgroundColor: 'rgba(255, 51, 102, 0.7)',
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `Revenue: $${context.raw.toLocaleString()}`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: value => `$${value.toLocaleString()}`
                }
              }
            }
          }
        });

        const destinationsChart = new Chart(destinationsEl, {
          type: 'doughnut',
          data: {
            labels: ['Switzerland', 'Thailand', 'Italy'],
            datasets: [{
              data: [985000, 645000, 534000],
              backgroundColor: [
                'rgba(255, 51, 102, 0.8)',
                'rgba(255, 153, 51, 0.8)',
                'rgba(51, 255, 153, 0.8)'
              ],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'right',
                labels: {
                  padding: 20,
                  usePointStyle: true
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => `$${context.raw.toLocaleString()}`
                }
              }
            },
            cutout: '60%'
          }
        });

        chartRefs.current = [trafficChart, revenueChart, destinationsChart];
        setChartsInitialized(true);
        return true;
      } catch (error) {
        console.error('Error initializing charts:', error);
        return false;
      }
    };

    // Try to initialize charts after a short delay
    const timer = setTimeout(() => {
      if (!chartsInitialized) {
        initializeCharts();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      chartRefs.current.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [chartsInitialized]);

  const exportReport = (format) => {
    alert(`Exporting report in ${format} format...`);
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="date-range">
          <select id="dateRange" className="filter-select" onChange={(e) => {
            document.querySelector('.date-range-label').textContent = e.target.options[e.target.selectedIndex].text;
          }}>
            <option value="7d">Last 7 Days</option>
            <option value="30d" selected>Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <span className="date-range-label">Last 30 Days</span>
        </div>

        <div className="export-dropdown">
          <button className="btn-secondary">
            <i className="fas fa-download"></i> Export Report
          </button>
          <div className="export-menu">
            <button onClick={() => exportReport('pdf')}><i className="fas fa-file-pdf"></i> PDF Report</button>
            <button onClick={() => exportReport('csv')}><i className="fas fa-file-csv"></i> CSV Export</button>
            <button onClick={() => exportReport('excel')}><i className="fas fa-file-excel"></i> Excel Export</button>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div>
              <h3>Total Visitors</h3>
              <div className="metric-value">52,341</div>
            </div>
            <div className="metric-icon visitors">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="metric-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>12.5% vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div>
              <h3>Total Revenue</h3>
              <div className="metric-value">$124,563</div>
            </div>
            <div className="metric-icon revenue">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="metric-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>8.3% vs last period</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div>
              <h3>Conversion Rate</h3>
              <div className="metric-value">2.8%</div>
            </div>
            <div className="metric-icon conversion">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="metric-change positive">
            <i className="fas fa-arrow-up"></i>
            <span>0.5% vs last period</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Traffic Overview</h3>
            <div className="chart-filters">
              <button 
                className={activeFilter === 'pageViews' ? 'active' : ''} 
                onClick={() => setActiveFilter('pageViews')}
              >
                Page Views
              </button>
              <button 
                className={activeFilter === 'visitors' ? 'active' : ''} 
                onClick={() => setActiveFilter('visitors')}
              >
                Unique Visitors
              </button>
            </div>
          </div>
          <canvas id="trafficChart"></canvas>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Distribution</h3>
          </div>
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>Top Destinations</h3>
          <div className="chart-filters">
            <button 
              className={activeDestFilter === 'revenue' ? 'active' : ''} 
              onClick={() => setActiveDestFilter('revenue')}
            >
              By Revenue
            </button>
            <button 
              className={activeDestFilter === 'bookings' ? 'active' : ''} 
              onClick={() => setActiveDestFilter('bookings')}
            >
              By Bookings
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <canvas id="destinationsChart"></canvas>
          <div className="destinations-table-container">
            <table className="destinations-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {['Switzerland', 'Thailand', 'Italy'].map((name, i) => (
                  <tr key={i}>
                    <td>{name}</td>
                    <td>{[456, 342, 289][i]}</td>
                    <td>${[985000, 645000, 534000][i].toLocaleString()}</td>
                    <td>
                      <div className="trend positive">
                        <i className="fas fa-arrow-up"></i>
                        {Math.round(Math.random() * 30 + 10)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
