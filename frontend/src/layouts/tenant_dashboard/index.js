import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import TenantDashboardNavbar from "examples/Navbars/TenantDashboardNavbar";
import Footer from "examples/Footer";
import Invoices from "layouts/billing/components/Invoices";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import landlordService from "../../services/landlordService";

import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

function TenantDashboard() {
  const { sales, tasks } = reportsLineChartData;
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [houses, setHouses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const colors = ["primary", "info", "success", "warning", "error"]; // Array de cores alternadas

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
    const fetchHouse = async () => {
      try {
        const response = await landlordService.fetchHousesByTenant();
        setHouses(response);
      } catch (error) {
        console.error("Erro ao buscar casas:", error);
      }
    };

    fetchHouse();
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
