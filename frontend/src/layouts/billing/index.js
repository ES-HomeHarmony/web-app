import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Payments from "layouts/billing/components/Payments";

import axios from "axios";

function Billing() {
  const location = useLocation();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [houses, setHouses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Fetch the list of houses when the component mounts
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/houses/landlord", {
          withCredentials: true,
        });
        console.log("Fetched houses:", response.data); // Debug line
        setHouses(response.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      }
    };

    fetchHouses();
  }, []);

  useEffect(() => {
    if (location.state && location.state.selectedHouse) {
      setSelectedHouse(location.state.selectedHouse);
    }
  }, [location.state]);

  const addInvoice = (expenseType, price, deadline, file) => {
    const newInvoice = {
      date: deadline,
      expenseType: expenseType,
      price: `€${price}`,
      file: file,
      house: selectedHouse,
    };
    setInvoices([...invoices, newInvoice]);
  };

  const handleSelectExpense = (expenseType) => {
    setSelectedExpense(expenseType);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Grid item xs={12} xl={6} mb={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select House</InputLabel>
                  <Select
                    value={selectedHouse.id || ""}
                    onChange={(e) => {
                      const selected = houses.find((house) => house.id === e.target.value);
                      setSelectedHouse(selected || {});
                    }}
                    label="Select House"
                  >
                    {houses.map((house) => (
                      <MenuItem key={house.id} value={house.id}>
                        {house.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} xl={5}>
              <BillingInformation selectedHouse={selectedHouse.name} addInvoice={addInvoice} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <Transactions selectedHouse={selectedHouse} />
            </Grid>
            <Grid item xs={12} xl={3}>
              <Payments invoices={invoices} tenants={[]} selectedExpense={selectedExpense} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} xl={4}>
              <Invoices
                invoices={invoices}
                selectedHouse={selectedHouse}
                onDetailsClick={handleSelectExpense}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
