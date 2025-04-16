import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./AdminOverview.css";
import { db } from "../../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const AdminOverview = () => {
  const usersChartRef = useRef(null);
  const bookingsChartRef = useRef(null);
  const usersChartInstance = useRef(null);
  const bookingsChartInstance = useRef(null);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalBookings: 0,
    averageRating: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const generateMonthLabels = (startDate, endDate) => {
    const labels = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      labels.push(
        currentDate.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        })
      );
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return labels;
  };

  const parseFirestoreDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      if (typeof dateStr === "string") return new Date(dateStr);
      if (dateStr.toDate) return dateStr.toDate();
      if (dateStr.seconds) return new Date(dateStr.seconds * 1000);
      return null;
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return null;
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
          font: { size: 12 },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11);

        const allMonthLabels = generateMonthLabels(startDate, endDate);

        const monthlyUsers = {};
        const monthlyBookings = {};
        const monthlyCancelledBookings = {};

        allMonthLabels.forEach((label) => {
          monthlyUsers[label] = 0;
          monthlyBookings[label] = 0;
          monthlyCancelledBookings[label] = 0;
        });

        const usersSnapshot = await getDocs(collection(db, "users"));
        let totalUsers = 0;

        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          const date = parseFirestoreDate(user.createdAt);
          if (date && date >= startDate && date <= endDate) {
            const label = date.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            });
            if (monthlyUsers[label] !== undefined) {
              monthlyUsers[label]++;
              totalUsers++;
            }
          }
        });

        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        let totalBookings = 0;
        let totalRevenue = 0;

        bookingsSnapshot.forEach((doc) => {
          const booking = doc.data();
          const date = parseFirestoreDate(booking.createdAt);
          if (date && date >= startDate && date <= endDate) {
            const label = date.toLocaleString("default", {
              month: "short",
              year: "2-digit",
            });
            if (monthlyBookings[label] !== undefined) {
              monthlyBookings[label]++;
              totalBookings++;
              if (booking.status === "cancelled")
                monthlyCancelledBookings[label]++;
              if (booking.totalPrice)
                totalRevenue += parseFloat(booking.totalPrice) || 0;
            }
          }
        });

        setStats({
          totalRevenue,
          totalUsers,
          totalBookings,
          averageRating: 0,
        });

        // Prepare chart data
        let cumulativeUsers = 0;
        const userData = allMonthLabels.map((label) => {
          cumulativeUsers += monthlyUsers[label];
          return cumulativeUsers;
        });

        const totalBookingData = allMonthLabels.map(
          (label) => monthlyBookings[label]
        );
        const cancelledBookingData = allMonthLabels.map(
          (label) => monthlyCancelledBookings[label]
        );

        // Destroy old charts
        if (usersChartInstance.current) usersChartInstance.current.destroy();
        if (bookingsChartInstance.current)
          bookingsChartInstance.current.destroy();

        // Create new users chart
        usersChartInstance.current = new Chart(usersChartRef.current, {
          type: "line",
          data: {
            labels: allMonthLabels,
            datasets: [
              {
                label: "Users",
                data: userData,
                borderColor: "#ff3366",
                backgroundColor: "rgba(255, 51, 102, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: chartOptions,
        });

        // Create new bookings chart
        bookingsChartInstance.current = new Chart(bookingsChartRef.current, {
          type: "line",
          data: {
            labels: allMonthLabels,
            datasets: [
              {
                label: "Total Bookings",
                data: totalBookingData,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.1)",
                fill: true,
                tension: 0.4,
              },
              {
                label: "Cancelled Bookings",
                data: cancelledBookingData,
                borderColor: "#f44336",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: chartOptions,
        });

        // Fetch recent users
        const recentUsersQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          limit(5)
        );

        const recentUsersSnapshot = await getDocs(recentUsersQuery);
        const activities = recentUsersSnapshot.docs.map((doc) => {
          const user = doc.data();
          return {
            id: doc.id,
            email: user.email || "Unknown",
            timestamp: parseFirestoreDate(user.createdAt) || new Date(),
          };
        });

        setRecentActivity(activities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (usersChartInstance.current) usersChartInstance.current.destroy();
      if (bookingsChartInstance.current)
        bookingsChartInstance.current.destroy();
    };
  }, []);

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <section id="overview" className="admin-tab active">
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <div className="stat-value">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <div className="stat-value">
              {stats.totalUsers.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>Total Bookings</h3>
            <div className="stat-value">
              {stats.totalBookings.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>Average Rating</h3>
            <div className="stat-value">{stats.averageRating}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>User Growth</h3>
          <div className="chart-wrapper" style={{ height: "300px" }}>
            <canvas ref={usersChartRef}></canvas>
          </div>
        </div>
        <div className="chart-container">
          <h3>Bookings Overview</h3>
          <div className="chart-wrapper" style={{ height: "300px" }}>
            <canvas ref={bookingsChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent User Activity</h3>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-user"></i>
              </div>
              <div className="activity-content">
                <div className="activity-text">
                  <strong>{activity.email}</strong> registered
                </div>
                <div className="activity-time">
                  {getRelativeTime(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminOverview;
