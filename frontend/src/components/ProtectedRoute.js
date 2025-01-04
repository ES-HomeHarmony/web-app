import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchUserRole } from "../services/tenantService";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await fetchUserRole();
        setUserRole(role);
      } catch {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner
  }

  if (userRole !== "tenant") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
