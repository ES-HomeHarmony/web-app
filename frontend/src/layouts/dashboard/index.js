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
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import landlordService from "../../services/landlordService";

function Dashboard() {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");
  const [houses, setHouses] = useState([]);
  const [landlordId, setLandlordId] = useState("");
  const [issues, setIssues] = useState([]);

  const colors = ["primary", "info", "success", "warning", "error"]; // Array de cores alternadas

  function redirectToSignIn() {
    window.location.href = "http://localhost:8001/auth/login";
  }

  async function redirectToLogout() {
    window.location.href = "http://localhost:8001/auth/logout";
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
          const response = await axios.get("http://localhost:8001/user/profile", {
            withCredentials: true,
          });

          if (response.data) {
            setUserName(response.data.name);
            setLandlordId(response.data.cognito_id);
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
  }, []); // Runs on mount

  useEffect(() => {
    const fetchIssues = async () => {
      if (landlordId) {
        try {
          const response = await landlordService.fetchIssuesByLandlord(landlordId);

          if (response.length > 0) {
            console.log("Issues:", response);
          }

          setIssues(response);
        } catch (error) {
          console.error("Erro ao buscar issues:", error);
        }
      }
    };

    fetchIssues();
  }, [landlordId]); // Runs when landlordId changes

  const handleAddHouseClick = () => {
    navigate("/tables"); // Replace '/add-house' with your desired route
  };

  const handleHouseClick = (house) => {
    navigate("/billing", { state: { selectedHouse: house } });
  };

  const handleSubmit = async (issueData) => {
    if (!selectedHouse || !selectedHouse.id) {
      toast.error("Please select a house before creating an issue.");
      return;
    }

    console.log("New Issue Data before submission:", issueData);

    // Add the selected house ID to the issue data
    const dataToSubmit = { ...issueData, house_id: selectedHouse.id };

    if (!dataToSubmit.title) {
      toast.error("Title is required.");
      return;
    }

    if (!dataToSubmit.description) {
      toast.error("Description is required.");
      return;
    }

    try {
      if (dataToSubmit.id) {
        await tenantService.updateIssue(dataToSubmit);
        toast.success("Issue updated successfully.");
      } else {
        await tenantService.createIssue(dataToSubmit);
        toast.success("Issue created successfully.");
      }
      await fetchIssues();
    } catch (error) {
      console.error("Error saving issue:", error);
      toast.error("Error saving issue.");
    }
  };

  const handleDelete = async (issueId) => {
    // Display a confirmation alert
    if (
      !window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")
    ) {
      return; // Exit if the user cancels
    }

    try {
      // Proceed with deletion if confirmed
      await tenantService.deleteIssue(issueId);
      toast.success("Issue deleted successfully.");
      await fetchIssues(); // Refresh the issue list
    } catch (error) {
      toast.error("Error deleting issue.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Renderizar casas do landlord com cores alternadas */}
          {houses.map((house, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <MDBox
                mb={1.5}
                onClick={() => handleHouseClick(house)} // Pass the actual name of the house
                style={{ cursor: "pointer" }}
              >
                <ComplexStatisticsCard
                  color={colors[index % colors.length]} // Alterna entre as cores
                  icon="house"
                  title={house.name} // Nome da casa
                  percentage={{
                    amount: `${house.address},${house.city}, ${house.state}, ${house.zipcode}`,
                  }}
                />
              </MDBox>
            </Grid>
          ))}

          {/* Card para adicionar uma nova casa */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox
              mb={1.5}
              onClick={handleAddHouseClick}
              style={{ cursor: "pointer" }}
              id="createHouse"
            >
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
        </Grid>

        {/* Seções adicionais da dashboard */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Invoices />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview
                issues={issues}
                handleSubmit={handleSubmit}
                handleDelete={handleDelete}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
