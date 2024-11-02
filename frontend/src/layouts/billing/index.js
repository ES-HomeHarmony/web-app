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
import Payments from "layouts/billing/components/Payments";

import axios from "axios";

function Billing() {
  const location = useLocation();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null); // Add this state

  // Houses available
  const houses = ["House Aveiro", "House Lisbon", "House Porto"];
  const tenants = ["Tenant 1", "Tenant 2", "Tenant 3"];

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

  const tenants_invoices = [
    {
      date: "2024-11-01",
      expenseType: "Water Bill",
      price: "€50",
      file: null,
      house: "House Aveiro",
      paidBy: ["Tenant 1"], // Only John has paid
    },
    {
      date: "2024-11-15",
      expenseType: "Electricity Bill",
      price: "€75",
      file: null,
      house: "House Aveiro",
      paidBy: [], // No one has paid yet
    },
  ];

  const handleSelectExpense = (expenseType) => {
    setSelectedExpense(expenseType); // Set the selected expense
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
            <Grid item xs={12} xl={5}>
              <BillingInformation selectedHouse={selectedHouse} addInvoice={addInvoice} />
            </Grid>
            {/* Right side: Expenses List */}
            <Grid item xs={12} xl={4}>
              <Invoices
                invoices={invoices}
                selectedHouse={selectedHouse}
                onDetailsClick={handleSelectExpense} // Pass the function here
              />
            </Grid>
            <Grid item xs={12} xl={3}>
              <Payments
                invoices={tenants_invoices}
                tenants={tenants}
                selectedExpense={selectedExpense} // Pass the selected expense
              />
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
