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

import SignInButton from "../../SignInButton"; // Import the SignInButton
import SignUpButton from "../../SignUnButton";

import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;

  const [logged, setLogged] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);

  function redirectToSignIn() {
    console.log("Redirecting to sign in...");
    const cognitoDomain = "homeharmony.auth.eu-north-1.amazoncognito.com";
    const clientId = "1ks0163ckccdfje0a1h7h78ffl";
    const redirectSignIn = "http://localhost:3000/dashboard"; // Your frontend callback URL
    const signInUrl = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectSignIn}`;
    alert(signInUrl);
    window.location.href = signInUrl; // Redirect to Cognito hosted sign-in page
  }

  function redirectToSignUp() {
    console.log("Redirecting to sign up...");
    const cognitoDomain = "homeharmony.auth.eu-north-1.amazoncognito.com";
    const clientId = "1ks0163ckccdfje0a1h7h78ffl";
    const redirectSignUp = "http://localhost:3000/dashboard"; // Your frontend callback URL
    const signUpUrl = `https://${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid+email+profile&redirect_uri=${redirectSignUp}`;
    window.location.href = signUpUrl; // Redirect to Cognito hosted sign-up page
  }

  useEffect(() => {
    const getCodeFromURL = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get("code"); // Get the authorization code from the URL
    };

    const loggedIn = () => {
      const jwt = localStorage.getItem("JWTToken");
      const accessToken = localStorage.getItem("access_token");

      if (jwt && accessToken) {
        setLogged(true);
      }
    };

    const exchangeCodeForToken = async (code) => {
      const cognitoDomain = "homeharmony.auth.eu-north-1.amazoncognito.com";
      const clientId = "1ks0163ckccdfje0a1h7h78ffl";
      const redirectSignIn = "http://localhost:3000/dashboard";

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("client_id", clientId);
      params.append("redirect_uri", redirectSignIn);
      params.append("code", code);

      try {
        const response = await axios.post(`https://${cognitoDomain}/oauth2/token`, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        const idToken = response.data.id_token;
        const accessToken = response.data.access_token;
        return { idToken, accessToken };
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        if (error.response) {
          console.error("Error details:", error.response.data);
        }
      }
    };

    const userExistsInDatabase = async (cognitoId) => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${cognitoId}`);
        return response.status === 200; // User exists if the response status is 200
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // User not found
          return false;
        }
        console.error("Error checking user existence:", error);
        return false;
      }
    };

    const saveUserInDatabase = async (userData) => {
      try {
        // Check if the user already exists in the database
        const userExists = await userExistsInDatabase(userData.cognito_id);
        console.log("AQUI1");
        if (userExists) {
          console.log("User already exists in the database.");
          return; // Exit the function if the user already exists
        }

        // If the user does not exist, save them to the database
        await axios.post("http://localhost:8000/users/", userData);
        console.log("User saved successfully!");
      } catch (error) {
        console.error("Error saving user to the database:", error);
      }
    };

    const handleSignIn = async () => {
      const code = getCodeFromURL();
      if (!code) {
        return;
      }

      const tokens = await exchangeCodeForToken(code);
      if (tokens) {
        const { idToken, accessToken } = tokens;
        setJwtToken(idToken);
        localStorage.setItem("JWTToken", idToken);
        localStorage.setItem("access_token", accessToken);
        setLogged(true);

        const base64Url = idToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = JSON.parse(atob(base64));

        const userData = {
          cognito_id: jsonPayload.sub,
          name: "NAME",
          email: jsonPayload.email,
        };

        await saveUserInDatabase(userData);
      }
    };

    if (!localStorage.getItem("JWTToken") && getCodeFromURL()) {
      handleSignIn();
    } else {
      loggedIn();
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
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
            <MDBox mb={1.5}>
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
            <MDBox mb={1.5}>
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
            <MDBox mb={1.5}>
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
                <h3>Welcome back! You are logged in.</h3>
              ) : (
                <div>
                  <h3>Please log in to access the dashboard features.</h3>
                  <SignInButton onClick={redirectToSignIn} />{" "}
                  <SignUpButton onClick={redirectToSignUp} />
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
