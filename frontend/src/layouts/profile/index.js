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

import React from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";


// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";


// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

function Overview() {
  // Aqui poderias usar useState para controlar os campos editáveis
  const [profile, setProfile] = React.useState({
    fullName: "Guilherme Santos",
    mobile: "912 345 678",
    email: "guilherme.santos@gmail.com",
    location: "Aveiro, Portugal",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Aqui podes adicionar a lógica para salvar os dados atualizados
    console.log("Informações atualizadas:", profile);
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={6}>
              <MDBox component="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={profile.mobile}
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
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  style={{ marginTop: "16px", color: "white" }}
                >
                  Save Changes
                </Button>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} xl={6} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <PlatformSettings />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
