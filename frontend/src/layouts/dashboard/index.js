/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Invoices from "layouts/billing/components/Invoices";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import SignInButton from "../../components/SignInButton"; // Import the SignInButton
import SignUpButton from "../../components/SignUpButton";
import LogoutButton from "../../components/LogoutButton";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Logout } from "@mui/icons-material";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");

  function redirectToSignIn() {
    window.location.href = "http://localhost:8000/auth/login";
  }

  async function redirectToLogout() {
    window.location.href = "http://localhost:8000/auth/logout";
  }

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
          const response = await axios.get("http://localhost:8000/user/profile", {
            withCredentials: true, // Include cookies in the request
          });

          if (response.data?.name) {
            setUserName(response.data.name); // Set user's name
            setLogged(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLogged(false);
        }
      } else {
        setLogged(false); // No access token, so user is not logged in
      }
    };
    fetchUserProfile();
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
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => handleHouseClick("House Aveiro")}
              style={{ cursor: "pointer" }}
            >
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
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => handleHouseClick("House Lisbon")}
              style={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="info"
                icon="house"
                title="Tenants"
                count="9"
                percentage={{
                  amount: "House Lisbon",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={() => handleHouseClick("House Porto")}
              style={{ cursor: "pointer" }}
            >
              <ComplexStatisticsCard
                color="warning"
                icon="house"
                title="Tenants"
                count="4"
                percentage={{
                  amount: "House Porto",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5} onClick={handleAddHouseClick} style={{ cursor: "pointer" }}>
              <ComplexStatisticsCard
                color="light"
                icon="add"
                title="‎ "
                count="‎ "
                percentage={{
                  label: "Add House",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12}>
            <MDBox textAlign="center">
              {logged ? (
                <>
                  <h3>Welcome back {userName}!</h3>
                  <LogoutButton onClick={redirectToLogout} />
                </>
              ) : (
                <div>
                  <h3>Please log in to access the dashboard features.</h3>
                  <SignInButton onClick={redirectToSignIn} />{" "}
                  <SignUpButton onClick={redirectToSignIn} />
                </div>
              )}
            </MDBox>
          </Grid>
        </Grid>
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
