import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Tables() {
  const [houseData, setHouseData] = useState({
    name: "",
    landlord_id: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const navigate = useNavigate();

  const tenantColumns = [
    { Header: "Nome", accessor: "name", align: "left" },
    { Header: "Email", accessor: "email", align: "left" },
    { Header: "Telefone", accessor: "phone", align: "center" },
    { Header: "Endereço", accessor: "address", align: "center" },
    { Header: "Ações", accessor: "action", align: "center" },
  ];

  const tenantsData = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: "456 Maple Ave",
    },
  ];

  const tenantRows = tenantsData.map((tenant) => ({
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    address: tenant.address,
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Ver Perfil
      </MDTypography>
    ),
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHouseData({
      ...houseData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      const newHouse = await landlordService.createHouse(houseData);
      console.log("Resposta da API após criação:", newHouse); // Verifica se há uma resposta

      if (newHouse) {
        // Tente redirecionar com window.location.href
        navigate("/dashboard");
      }
    } catch (error) {
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
                      label="Landlord"
                      name="landlord_id"
                      value={houseData.landlord_id}
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

          {/* Tabela de Tenants */}
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
                  Tabela de Inquilinos
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: tenantColumns, rows: tenantRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
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
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
