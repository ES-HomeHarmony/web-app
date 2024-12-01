import PropTypes from "prop-types";
import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import Icon from "@mui/material/Icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { CircularProgress } from "@mui/material"; // Import for loading spinner
import { useEffect } from "react";

function BillingInformation({ tenants, selectedHouse }) {
  console.log(tenants);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(""); // State for selected tenant
  const [loading, setLoading] = useState(false); // State for loading

  // Simulate fetching tenants when the selectedHouse changes
  useEffect(() => {
    if (selectedHouse) {
      setLoading(true);

      // Simulate an API call
      setTimeout(() => {
        setLoading(false);
      }, 1500); // Simulated delay (1.5 seconds)
    }
  }, [selectedHouse]);

  const handleSubmit = async () => {
    if (!selectedTenant || !selectedHouse || !selectedFile) {
      toast.error("Please select a house, tenant, and upload a valid contract file.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "contract_data",
      JSON.stringify({
        tenant_id: selectedTenant,
      })
    );
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8000/houses/uploadContract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Contract uploaded successfully!");
        // Clear form fields
        setSelectedTenant("");
        setSelectedFile(null);
      } else {
        toast.error(response.data?.error || "Failed to upload contract. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading contract:", error);
      toast.error("An error occurred while uploading the contract.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a PDF, JPEG, or PNG file."); // Show error notification
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSize) {
      alert("File size exceeds the maximum limit of 5MB."); // Show error notification
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file); // Set the file if valid
  };

  console.log(selectedTenant);

  return (
    <Card id="delete-account">
      <MDBox pt={3} px={2}>
        <MDTypography id="select" variant="h6" fontWeight="medium">
          Add Contracts to {selectedHouse.name} tenants
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2}>
        <MDBox
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
        >
          <FormControl fullWidth margin="normal">
            <InputLabel id="tenant-select-label">Select Tenant</InputLabel>
            {loading ? (
              <CircularProgress size={24} sx={{ margin: "16px auto" }} /> // Loading spinner
            ) : (
              <Select
                labelId="tenant-select-label"
                id="tenant-select"
                value={selectedTenant || ""} // Bind value to state
                onChange={(e) => {
                  console.log("Selected Tenant ID:", e.target.value); // Debug selected value
                  setSelectedTenant(e.target.value); // Update state
                }}
                label="Select Tenant"
              >
                {tenants && tenants.length > 0 ? (
                  tenants.map((tenant) => (
                    <MenuItem key={tenant.tenant_id} value={tenant.tenant_id}>
                      {tenant.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No tenants available
                  </MenuItem>
                )}
              </Select>
            )}
          </FormControl>

          <input
            type="file"
            accept=".pdf,.jpeg,.png"
            id="upload-button-file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="upload-button-file">
            <MDBox
              display="flex"
              alignItems="center"
              lineHeight={1}
              mt={2}
              sx={{ cursor: "pointer" }}
            >
              <Icon fontSize="small">picture_as_pdf</Icon>
              <MDTypography variant="button" fontWeight="bold">
                &nbsp;{selectedFile ? selectedFile.name : "Upload File (PDF, JPEG, PNG) (Max 5MB)"}
              </MDTypography>
            </MDBox>
          </label>
          <Button
            id="save"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: "16px", color: "white" }}
          >
            Save Changes
          </Button>
          <div>
            <ToastContainer />
          </div>
        </MDBox>
      </MDBox>
    </Card>
  );
}

BillingInformation.propTypes = {
  tenants: PropTypes.array, // Make this optional
  selectedHouse: PropTypes.string.isRequired,
  addInvoice: PropTypes.func.isRequired,
};

BillingInformation.defaultProps = {
  tenants: [], // Default to an empty array if tenants is undefined or not passed
};

export default BillingInformation;
