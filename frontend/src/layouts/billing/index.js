import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress"; // Import for spinner

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import Payments from "layouts/billing/components/Payments";
import { ToastContainer, toast } from "react-toastify";

function Billing() {
  const location = useLocation();
  const [selectedHouse, setSelectedHouse] = useState("");
  const [houses, setHouses] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [tenants, setTenants] = useState([]); // New state for tenants
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tenantData, setTenantData] = useState({ name: "", email: "", rent: "" });
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [isLoadingtenantsExpense, setIsLoadingtenantsExpense] = useState(false); // New state for loading
  const [tenantsExpense, setTenantsExpense] = useState([]); // New state for tenants

  // Modal styles
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    boxShadow: 24,
    p: 4,
  };

  const modalStyle2 = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  };
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
      // sleep of 10s
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(true); // Start loading
      if (selectedHouse && selectedHouse.id) {
        try {
          const response = await axios.get(
            `http://localhost:8000/houses/landlord/house/${selectedHouse.id}`,
            {
              withCredentials: true,
            }
          );
          const tenant_data = response.data?.tenents || []; // Default to empty array if undefined
          console.log("Fetched tenants:", response.data.tenents); // Debug line
          setTenants(tenant_data);
        } catch (error) {
          console.error("Error fetching tenants:", error);
          toast.error("Failed to fetch tenants. Please try again.");
          setTenants([]);
        } finally {
          setIsLoading(false); // End loading
        }
      } else {
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

  const handleSelectExpense = async (expenseId) => {
    setSelectedExpense(expenseId);
    setIsLoadingtenantsExpense(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:8000/houses/expense/${expenseId}`);
      if (response.data && response.data.tenants) {
        setTenantsExpense(response.data.tenants); // Set tenants for the selected expense
      } else {
        console.warn("No tenant data received for the selected expense");
      }
    } catch (error) {
      console.error("Error fetching tenant payment status:", error);
    } finally {
      setIsLoadingtenantsExpense(false); // End loading
    }
  };

  const handleAddTenants = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTenantChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
  };

  const handleTenantSubmit = async () => {
    const new_tenant = {
      house_id: selectedHouse.id,
      rent: parseInt(tenantData.rent, 10), // Ensure rent is an integer
      name: tenantData.name,
      email: tenantData.email,
    };

    console.log(new_tenant);

    try {
      const response = await axios.post("http://localhost:8000/houses/tenents", new_tenant, {
        withCredentials: true,
      });
      console.log("Tenant created response:", response);
      toast.success("Tenant added successfully!");
      setTenantData({ name: "", email: "", rent: "" }); // Reset form
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error("Failed to add tenant:", error.response?.data || error.message);
      toast.error("Failed to create tenant. Please try again.");
    }
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
            <Grid item xs={12} md={6} lg={4} style={{ flex: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                style={{
                  borderRadius: "10px",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
                onClick={handleAddTenants}
              >
                Add Tenants
              </Button>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} xl={5}>
              <BillingInformation selectedHouse={selectedHouse} addInvoice={addInvoice} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <Invoices
                invoices={invoices}
                selectedHouse={selectedHouse}
                onDetailsClick={handleSelectExpense}
              />
            </Grid>
            <Grid item xs={12} xl={3}>
              <Payments
                tenants={tenantsExpense}
                selectedExpense={selectedExpense}
                isLoading={isLoadingtenantsExpense}
              />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <Transactions selectedHouse={selectedHouse} />
            </Grid>
            <Grid item xs={12} md={5}>
              <MDTypography variant="h6" mb={2}>
                Tenants
              </MDTypography>
              <MDBox>
                {selectedHouse && (
                  <MDBox>
                    {isLoading ? (
                      <CircularProgress />
                    ) : tenants.length > 0 ? (
                      tenants.map((tenant) => (
                        <MDBox key={tenant.id} mb={2}>
                          <MDTypography variant="h6">{tenant.name}</MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            {tenant.email}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            Rent: €{tenant.rent}
                          </MDTypography>
                        </MDBox>
                      ))
                    ) : (
                      <MDTypography variant="body2" color="textSecondary">
                        No tenants found.
                      </MDTypography>
                    )}
                  </MDBox>
                )}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      {/* Modal for Adding Tenants */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <MDTypography variant="h6" mb={2}>
            Add Tenant
          </MDTypography>
          <MDBox component="form" sx={modalStyle2}>
            <MDInput
              type="text"
              label="Name"
              name="name"
              value={tenantData.name}
              onChange={handleTenantChange}
              fullWidth
              mb={2}
            />
            <MDInput
              type="email"
              label="Email"
              name="email"
              value={tenantData.email}
              onChange={handleTenantChange}
              fullWidth
              mb={2}
            />
            <MDInput
              type="number"
              label="Rent"
              name="rent"
              value={tenantData.rent}
              onChange={handleTenantChange}
              fullWidth
              mb={2}
            />
            <MDButton variant="gradient" color="info" onClick={handleTenantSubmit} fullWidth>
              Submit
            </MDButton>
          </MDBox>
        </Box>
      </Modal>
      <ToastContainer />
      <Footer />
    </DashboardLayout>
  );
}

export default Billing;
