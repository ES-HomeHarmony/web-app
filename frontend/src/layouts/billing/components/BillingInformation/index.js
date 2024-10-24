import PropTypes from "prop-types";
import { useState } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Button, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";

function BillingInformation({ selectedHouse, addInvoice }) {
  const [expenseType, setExpenseType] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = () => {
    if (expenseType && price && deadline) {
      addInvoice(expenseType, price, deadline, selectedFile);
      setExpenseType("");
      setPrice("");
      setDeadline("");
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
                &nbsp;{selectedFile ? selectedFile.name : "Upload PDF"}
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
