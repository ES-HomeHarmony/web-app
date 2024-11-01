import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // For success and error messages
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

function Overview() {
  const [profile, setProfile] = useState({
    name: "",
    mobile: "",
    email: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // State for Snackbar severity (success/error)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/profile", {
          withCredentials: true,
        });

        const { name, email, role } = response.data;
        setProfile({ name, email, role }); // Update state with user data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Use access token

      if (!accessToken) {
        console.error("No access token found for updating profile");
        return;
      }

      // Send updated data to FastAPI
      await axios.put(
        "http://localhost:8000/user/profile/update", // Update endpoint in your FastAPI app
        {
          name: profile.name, // Make sure this matches the UpdateProfileSchema in your FastAPI backend
          email: profile.email,
          role: profile.role,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the access token in the Authorization header
          },
        }
      );
      console.log("Profile updated successfully");
      setSnackbarMessage("Profile updated successfully!"); // Set success message
      setSnackbarSeverity("success"); // Set severity to success
      setSnackbarOpen(true); // Show the snackbar
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile."); // Set error message
      setSnackbarSeverity("error"); // Set severity to error
      setSnackbarOpen(true); // Show the snackbar
    }
  };

  // Handle Snackbar close event
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <div>Loading profile...</div>; // Loading state until the data is fetched
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header profileName={profile.name}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={6}>
              <MDBox component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profile.name}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  margin="normal"
                />
                <MDBox mt={2}>
                  <Button
                    variant="outlined" // Use outlined variant for the border effect
                    onClick={handleSubmit}
                    sx={{
                      marginTop: "16px",
                      color: "primary.main", // Text color as primary
                      borderColor: "primary.main", // Primary border color
                      backgroundColor: "white", // White background
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{ marginTop: "16px", color: "white" }}
                  >
                    Save Changes
                  </Button>
                </MDBox>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <PlatformSettings />
            </Grid>
          </Grid>
        </MDBox>
      </Header>

      {/* Snackbar component for success/error notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Auto close after 6 seconds
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
