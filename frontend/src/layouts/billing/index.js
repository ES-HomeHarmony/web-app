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

  // Function to add a new invoice
  const addInvoice = (expenseType, price, deadline, file) => {
    const newInvoice = {
      date: deadline,
      expenseType: expenseType, // Generate a random ID
      price: `€${price}`,
      file: file,
    };
    setInvoices([...invoices, newInvoice]); // Update the state to include the new invoice
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Grid item xs={12} xl={6} mb={3}>
                {/* Material-UI styled dropdown */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select House</InputLabel>
                  <Select
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    label="Select House"
                    style={{ fontSize: "16px", padding: "10px" }} // Ensure custom style
                  >
                    {houses.map((house) => (
                      <MenuItem key={house} value={house}>
                        {house}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} xl={8}>
                <BillingInformation selectedHouse={selectedHouse} addInvoice={addInvoice} />{" "}
                {/* Pass selectedHouse and addInvoice as props */}
              </Grid>
            </Grid>
            <Grid item xs={12} lg={4} mt={8}>
              <Invoices invoices={invoices} />
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
