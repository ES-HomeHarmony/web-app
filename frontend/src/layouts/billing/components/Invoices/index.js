/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import PropTypes from "prop-types";

function Invoices({ invoices, selectedHouse }) {
  // Filter invoices based on the selected house
  const filteredInvoices = (invoices || []).filter((invoice) => invoice.house === selectedHouse);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Expenses
        </MDTypography>
        <MDButton variant="outlined" color="info" size="small">
          view all
        </MDButton>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {filteredInvoices.map((invoice, index) => (
            <Invoice
              key={index}
              date={invoice.date}
              expenseType={invoice.expenseType}
              price={invoice.price}
              file={invoice.file}
              noGutter={index === filteredInvoices.length - 1}
            />
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Invoices.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      expenseType: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      file: PropTypes.object,
      house: PropTypes.string.isRequired, // Make sure to include the house property here
    })
  ).isRequired,
  selectedHouse: PropTypes.string.isRequired, // Add this to prop types
};

export default Invoices;
