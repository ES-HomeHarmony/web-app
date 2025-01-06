import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Invoices from "layouts/billing/components/Invoices";
import OrdersOverview from "layouts/tenant_dashboard/components/OrdersOverview";
import TenantDashboardNavbar from "examples/Navbars/TenantDashboardNavbar";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";

import tenantService from "services/tenantService";
import { toast } from "react-toastify";

function TenantDashboard() {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [logged, setLogged] = useState(false);
  const [userName, setUserName] = useState("");
  const [issues, setIssues] = useState([]);

  const colors = ["primary", "info", "success", "warning", "error"]; // Array de cores alternadas

  const handleHouseClick = (house) => {
    setSelectedHouse(house); // Set the selected house
    console.log("Selected house:", house.id); // Debug line
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
        const response = await tenantService.fetchHousesByTenant();
        setHouses(response);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };

    if (selectedHouse && selectedHouse.id) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/houses/expenses/${selectedHouse.id}`
          );
          const pendingExpenses = response.data.filter((expense) => expense.status !== "paid");
          setExpenses(pendingExpenses);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };
      fetchExpenses();
      fetchIssues();
    }

    fetchUserProfile();
    fetchHouses();
  }, [selectedHouse]);

  const fetchIssues = async () => {
    try {
      const response = await tenantService.fetchIssuesbyHouse(selectedHouse.id);

      console.log("Issues:", response);

      if (!response) {
        toast.warning("No issues found for this house.");
      }
      setIssues(response);
    } catch (error) {
      toast.error("Error fetching issues.");
    }
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

  const fecthContract = async () => {
    try {
      await tenantService.fetchContract();
    } catch (error) {
      console.error("Error fetching contract:", error);
    }
  };

  return (
    <DashboardLayout>
      <TenantDashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Seções adicionais da dashboard */}
          {houses.length > 0 ? (
            houses.map((house, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <MDBox
                  mb={1.5}
                  onClick={() => handleHouseClick(house)} // Pass the actual name of the house
                  style={{ cursor: "pointer" }}
                >
                  <ComplexStatisticsCard
                    key={house.id}
                    color={colors[index % colors.length]} // Alterna entre as cores
                    icon="house"
                    title={house.name} // Nome da casa
                    percentage={{
                      amount: `${house.address},${house.city}, ${house.state}, ${house.zipcode}`,
                    }}
                  />
                </MDBox>
              </Grid>
            ))
          ) : (
            <p>No houses found.</p>
          )}
        </Grid>
        <MDBox mt={4.5}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox textAlign="center">
              <Button
                variant="text"
                color="primary"
                startIcon={<VisibilityIcon />}
                onClick={fecthContract}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  "&.MuiButton-containedPrimary": {
                    color: "white", // Ensure text is white for the primary button variant
                  },
                  float: "left",
                  mb: 1,
                }}
              >
                See Contract
              </Button>
            </MDBox>
          </Grid>
        </MDBox>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Invoices
                selectedHouse={selectedHouse}
                onDetailsClick={(expenseId) => console.log(expenseId)}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview
                selectedHouse={selectedHouse}
                isTenant={true}
                issues={issues}
                fetchIssues={fetchIssues}
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

export default TenantDashboard;
