import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import landlordService from "services/landlordService";
import MDInput from "components/MDInput";
import { ToastContainer, toast } from "react-toastify";

function Tables() {
  const [houseData, setHouseData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // If state is passed when navigating, use it to pre-populate houseData
  useEffect(() => {
    if (location.state && location.state.house) {
      setHouseData(location.state.house);
      toast.info(`Adding tenants for: ${location.state.house.name}`);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHouseData({
      ...houseData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    if (
      !houseData.name ||
      !houseData.address ||
      !houseData.city ||
      !houseData.state ||
      !houseData.zipcode
    ) {
      toast.error("Please fill in all fields to create a house!"); // Mostra uma notificação de erro
      return;
    }

    try {
      const newHouse = await landlordService.createHouse(houseData);
      console.log("Resposta da API após criação:", newHouse); // Verifica se há uma resposta

      if (newHouse) {
        // Tente redirecionar com window.location.href
        toast.success("House created successfully!"); // Mostra uma notificação de sucesso
        setTimeout(() => {}, 2000);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to create house. Please try again."); // Mostra uma notificação de erro
      console.error("Erro ao criar a casa:", error);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Seção do Formulário de Criação de Casa */}
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  New House
                </MDTypography>
              </MDBox>
              <MDBox component="form" onSubmit={handleSubmit} p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      type="text"
                      label="Name"
                      name="name"
                      value={houseData.name}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      type="text"
                      label="Address"
                      name="address"
                      value={houseData.address}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      type="text"
                      label="City"
                      name="city"
                      value={houseData.city}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      type="text"
                      label="State"
                      name="state"
                      value={houseData.state}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MDInput
                      type="text"
                      label="Zipcode"
                      name="zipcode"
                      value={houseData.zipcode}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Botões de Ação */}
        <MDBox display="flex" justifyContent="flex-end" mt={4} pr={2}>
          <MDButton variant="outlined" color="secondary" onClick={handleCancel} sx={{ mr: 2 }}>
            Cancel
          </MDButton>
          <MDButton variant="gradient" color="info" onClick={handleSubmit}>
            Create House
          </MDButton>
        </MDBox>
      </MDBox>
      <div>
        {/* Your existing code */}
        <ToastContainer />
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
