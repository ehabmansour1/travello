import React from "react";
import { Navigate } from "react-router-dom";
import { useFirebase } from "../../contexts/FirebaseContext";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const { user, getUserData } = useFirebase();
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        if (user) {
          const userData = await getUserData(user.uid);
          setUserRole(userData?.role || "user");
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [user, getUserData]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "admin" && userRole !== "admin") {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
