import PropTypes from "prop-types";
import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function BillingInformation({ selectedHouse, addInvoice }) {
  const [expenseType, setExpenseType] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = () => {
    if (!expenseType || !price || !deadline) {
      toast.error("Please fill out all fields."); // Show error notification
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload a valid file."); // Show error notification
      return;
    }

    // Create FormData to send the file along with other data
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("expenseType", expenseType);
    formData.append("price", price);
    formData.append("deadline", deadline);
    formData.append("house", selectedHouse);

    // Make the POST request to the backend
    // axios
    //   .post("/api/upload", formData)
    //   .then((response) => {
    //     toast.success("File uploaded successfully!"); // Show success notification
    addInvoice(expenseType, price, deadline, selectedFile); // Optionally add the new invoice locally
    // Clear the form
    setExpenseType("");
    setPrice("");
    setDeadline("");
    setSelectedFile(null);
    // })
    // .catch((error) => {
    //   toast.error("File upload failed. Please try again."); // Show error notification
    // });
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
        <MDTypography variant="h6" fontWeight="medium">
          Add Expenses to {selectedHouse}
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
          <TextField
            fullWidth
            label="Expense Type"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Deadline"
            type="date" // Change type to "date" for date picker
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true, // Ensure the label stays above the date picker
            }}
          />
          <input
            type="file"
            accept=".pdf"
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
  selectedHouse: PropTypes.string.isRequired,
  addInvoice: PropTypes.func.isRequired,
};

export default BillingInformation;
