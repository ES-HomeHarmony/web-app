import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Invoices from "layouts/billing/components/Invoices";
import OrdersOverview from "layouts/tenant_dashboard/components/OrdersOverview";
import TenantDashboardNavbar from "examples/Navbars/TenantDashboardNavbar";

import SignInButton from "../../components/SignInButton";
import SignUpButton from "../../components/SignUpButton";
import LogoutButton from "../../components/LogoutButton";
import landlordService from "../../services/landlordService";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

function TenantDashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [houses, setHouses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");


  function redirectToSignIn() {
    window.location.href = "http://localhost:8001/auth/login";
  }

  async function redirectToLogout() {
    window.location.href = "http://localhost:8001/auth/logout";
  }

  const handleSelectExpense = async (expenseId) => {
    setSelectedExpense(expenseId);
    try {
      const response = await axios.get(`http://localhost:8000/houses/expense/${expenseId}`);
      if (response.data && response.data.tenants) {
        setTenants(response.data.tenants); // Set tenants for the selected expense
      } else {
        console.warn("No tenant data received for the selected expense");
      }
    } catch (error) {
      console.error("Error fetching tenant payment status:", error);
    }
  };

  const handleHouseClick = (house) => {
    setSelectedHouse(house); // Set the selected house
  };

  useEffect(() => {
    const getAccessTokenFromCookies = () => {
      const cookieString = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="));
      return cookieString ? cookieString.split("=")[1] : null;
    };

    const fetchUserProfile = async () => {
      const accessToken = getAccessTokenFromCookies();

      if (accessToken) {
        try {
          const response = await axios.get("http://localhost:8001/user/profile", {
            withCredentials: true,
          });

          if (response.data?.name) {
            setUserName(response.data.name);
            setLogged(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLogged(false);
        }
      } else {
        setLogged(false);
      }
    };

    const fetchHouses = async () => {
      try {
        const response = await landlordService.fetchHousesByTenant();
        setHouses(response);
      } catch (error) {
        console.error("Erro ao buscar casas:", error);
      }
    };

    fetchUserProfile();
    fetchHouses();
  }, []);

  return (
    <DashboardLayout>
      <TenantDashboardNavbar />
      <MDBox py={3}>
        {/* Seções adicionais da dashboard */}
        {houses.length > 0 ? (
          houses.map((house, index) => (
            <div
              key={house.id} // Ensure unique key for each card
              onClick={() => handleHouseClick(house)} // Handle click event
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              <ComplexStatisticsCard
                key={house.id} // Ensure each card has a unique key
                color={colors[index % colors.length]} // Alternate colors
                icon="house"
                title={house.name} // House name
                percentage={{
                  amount: `${house.address}, ${house.city}, ${house.state}, ${house.zipcode}`,
                }}
              />
            </div>
          ))
        ) : (
          <p>No houses found.</p>
        )}
        {/* Mensagem de boas-vindas e controle de login/logout */}
        <Grid item xs={12}>
          <MDBox textAlign="center" mt={3}>
            {logged ? (
              <>
                <h3>Welcome back {userName}!</h3>
                <LogoutButton onClick={redirectToLogout} />
              </>
            ) : (
              <div>
                <h3>Please log in to access the dashboard features.</h3>
                <SignInButton onClick={redirectToSignIn} />
                <SignUpButton onClick={redirectToSignIn} />
              </div>
            )}
          </MDBox>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Invoices
                invoices={invoices}
                selectedHouse={selectedHouse}
                onDetailsClick={handleSelectExpense}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TenantDashboard;