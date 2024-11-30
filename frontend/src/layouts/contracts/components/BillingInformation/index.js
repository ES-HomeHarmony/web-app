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

function BillingInformation({ tenants, selectedHouse, addInvoice }) {
  const [expenseType, setExpenseType] = useState("");
  // const [price, setPrice] = useState("");
  // const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(""); // State for selected tenant

  const handleSubmit = () => {
    if (!selectedHouse) {
      toast.error("Please select a house.");
      return;
    }

    if (!expenseType || !selectedTenant) {
      toast.error("Please fill out all fields.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a valid file.");
      return;
    }

    // Create FormData to send the file along with other data
    const formData = new FormData();
    const expenseData = JSON.stringify({
      house_id: 1, // Use the actual selectedHouse ID if needed
      amount: price,
      title: expenseType,
      deadline_date: deadline,
    });

    // Append JSON data and file to formData
    formData.append("expense_data", expenseData);
    formData.append("file", selectedFile);

    // Make the POST request
    axios
      .post("http://localhost:8000/houses/addExpense", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Expense added successfully!");
        addInvoice(expenseType, price, deadline, selectedFile);
        // Clear the form
        setExpenseType("");
        // setPrice("");
        // setDeadline("");
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error uploading expense:", error);
        toast.error("Failed to add expense. Please try again.");
      });
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
            <Select
              labelId="tenant-select-label"
              id="tenant-select"
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              label="Select Tenant"
            >
              {tenants && tenants.length > 0 ? (
                tenants.map((tenant) => (
                  <MenuItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No tenants available</MenuItem> // Fallback if no tenants
              )}
            </Select>
          </FormControl>

          {/* <TextField
            id="type"
            fullWidth
            label="Expense Type"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            margin="normal"
          /> */}
          {/* <TextField
            id="price"
            fullWidth
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
          />
          <TextField
            id="deadline"
            fullWidth
            label="Deadline"
            type="date" // Change type to "date" for date picker
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true, // Ensure the label stays above the date picker
            }}
          /> */}
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
                &nbsp;{selectedFile ? selectedFile.name : "Upload File (PDF, JPEG, PNG)"}
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
            {/* Your existing code */}
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
