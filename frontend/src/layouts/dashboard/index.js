import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Invoices from "layouts/billing/components/Invoices";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import SignInButton from "../../components/SignInButton";
import SignUpButton from "../../components/SignUpButton";
import LogoutButton from "../../components/LogoutButton";
import landlordService from "../../services/landlordService";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");
  const [houses, setHouses] = useState([]);

  const colors = ["primary", "info", "success", "warning", "error"]; // Array de cores alternadas

  function redirectToSignIn() {
    window.location.href = "http://localhost:8001/auth/login";
  }

  async function redirectToLogout() {
    window.location.href = "http://localhost:8001/auth/logout";
  }

  const handleAddHouseClick = () => {
    window.location.href = "/tables"; // Replace '/add-house' with your desired route
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
        const response = await landlordService.fetchHousesByLandlord();
        setHouses(response);
      } catch (error) {
        console.error("Erro ao buscar casas:", error);
      }
    };

    fetchUserProfile();
    fetchHouses();
  }, []);

  const handleAddHouseClick = () => {
    navigate("/tables"); // Replace '/add-house' with your desired route
  };

  const handleHouseClick = (houseName) => {
    navigate("/billing", { state: { selectedHouse: houseName } }); // Pass the selected house name as state
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
        {/* Renderizar casas do landlord com cores alternadas */}
        {houses.map((house, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}> 
            <MDBox mb={1.5} onClick={() => handleHouseClick("House Aveiro")}
              style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="primary"
                icon="house"
                title="Tenants"
                count={18}
                percentage={{
                  amount: "House Aveiro",
                }}
              />
            </MDBox>
          </Grid>
          ))}
        
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="light"
                icon="add"
                title=" "
                count=" "
                percentage={{
                  label: "Add House",
                }}
              />
            </MDBox>
          </Grid>

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
        </Grid>

        {/* Seções adicionais da dashboard */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Invoices />
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

export default Dashboard;
