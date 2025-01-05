import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BillingInformation from "layouts/contracts/components/BillingInformation";
import Payments from "layouts/contracts/components/Payments";
import { toast } from "react-toastify";

function Billing() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [houses, setHouses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [tenants, setTenants] = useState([]); // New state for tenants

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

  useEffect(() => {
    const fetchTenants = async () => {
      if (selectedHouse && selectedHouse.id) {
        try {
          const response = await axios.get(
            `http://localhost:8000/houses/landlord/house/${selectedHouse.id}`,
            { withCredentials: true }
          );
          if (response.data.tenents) {
            setTenants(response.data.tenents);
            console.log("Fetched tenants:", response.data.tenents);
          } else {
            console.warn("No tenants found in response:", response.data);
            setTenants([]);
          }
        } catch (error) {
          console.error("Error fetching tenants:", error);
          toast.error("Failed to fetch tenants. Please try again.");
        }
      } else {
        console.log("No house selected or house ID is invalid.");
        setTenants([]);
      }
    };
    fetchTenants();
  }, [selectedHouse]);

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

  return (
    <DashboardLayout>
      <DashboardNavbar isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <Grid item xs={12} xl={6} mb={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Select House</InputLabel>
                  <Select
                    value={selectedHouse?.id || ""} // Use the `id` or a unique identifier
                    onChange={(e) => {
                      const selected = houses.find((house) => house.id === e.target.value);
                      setSelectedHouse(selected || {});
                    }}
                    label="Select House"
                  >
                    {houses.map((house) => (
                      <MenuItem key={house.id} value={house.id}>
                        {house.name} {/* Ensure this is rendering a string */}
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
              <BillingInformation
                tenants={tenants}
                selectedHouse={selectedHouse}
                addInvoice={addInvoice}
              />
            </Grid>
            <Grid item xs={12} xl={3}>
              <Payments tenants={tenants} selectedExpense={selectedExpense} />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <MDTypography variant="h6" mb={2}>
                Tenants
              </MDTypography>
              <MDBox>
                {selectedHouse &&
                  tenants.map((tenant) => (
                    <MDBox key={tenant.id} mb={2}>
                      <MDTypography id="tenants_info" variant="h6">
                        {tenant.name}
                      </MDTypography>
                      <MDTypography variant="body2" color="textSecondary">
                        {tenant.email}
                      </MDTypography>
                      <MDTypography variant="body2" color="textSecondary">
                        Rent: €{tenant.rent}
                      </MDTypography>
                    </MDBox>
                  ))}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
