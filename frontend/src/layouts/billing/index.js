import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";

import axios from "axios";

function Billing() {
  const location = useLocation();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [invoices, setInvoices] = useState([]);

  // Houses available
  const houses = ["House Aveiro", "House Lisbon", "House Porto"];

  // Set the selected house from location state
  useEffect(() => {
    if (location.state && location.state.selectedHouse) {
      setSelectedHouse(location.state.selectedHouse);
    }
  }, [location.state]);

  // Fetch expenses when the selected house changes **for the backend to work**
  // useEffect(() => {
  //   if (selectedHouse) {
  //     axios
  //       .get(`/api/expenses?house=${selectedHouse}`)
  //       .then((response) => {
  //         setInvoices(response.data); // Update the state with the filtered expenses
  //       })
  //       .catch((error) => {
  //         console.error("There was an error fetching the expenses!", error);
  //       });
  //   }
  // }, [selectedHouse]);

  // Function to add a new invoice
  // Add the selected house when creating a new invoice
  const addInvoice = (expenseType, price, deadline, file) => {
    const newInvoice = {
      date: deadline,
      expenseType: expenseType,
      price: `€${price}`,
      file: file,
      house: selectedHouse, // Track which house the invoice belongs to
    };
    setInvoices([...invoices, newInvoice]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              {/* Select House Dropdown */}
              <Grid item xs={12} xl={6} mb={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select House</InputLabel>
                  <Select
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    label="Select House"
                    style={{ fontSize: "16px", padding: "10px" }}
                  >
                    {houses.map((house) => (
                      <MenuItem key={house} value={house}>
                        {house}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Add Expenses Form and Expenses Section */}
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            {/* Left side: Add Expenses Form */}
            <Grid item xs={12} xl={6}>
              <BillingInformation selectedHouse={selectedHouse} addInvoice={addInvoice} />
            </Grid>
            {/* Right side: Expenses List */}
            <Grid item xs={12} xl={6}>
              <Invoices invoices={invoices} selectedHouse={selectedHouse} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
