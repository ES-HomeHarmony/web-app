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
import Icon from "@mui/material/Icon";

// Billing page components
import Invoice from "layouts/billing/components/Invoice";
import PropTypes from "prop-types";

function Invoices({ invoices, selectedHouse, pdfUrl, onDetailsClick }) {
  const openPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open the PDF in a new tab
    }
  };

  // Filter invoices based on the selected house
  const filteredInvoices = (invoices || []).filter((invoice) => invoice.house === selectedHouse);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Expenses
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {filteredInvoices.map((invoice, index) => (
            <MDBox
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                mb: 1,
              }}
            >
              <MDBox display="flex" flexDirection="column">
                <MDTypography variant="subtitle2" fontWeight="medium" color="text.primary">
                  {invoice.expenseType}
                </MDTypography>
                <MDTypography variant="caption" color="error" mb={1}>
                  {invoice.date}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDTypography variant="body2" fontWeight="medium" color="warning" mr={1}>
                  {invoice.price}
                </MDTypography>
                {invoice.file && (
                  <MDTypography
                    variant="button"
                    display="flex"
                    fontWeight="bold"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={openPdf}
                  >
                    <Icon fontSize="small">picture_as_pdf</Icon> &nbsp;PDF
                  </MDTypography>
                )}
                <MDButton
                  variant="outlined"
                  color="info"
                  size="small"
                  onClick={() => onDetailsClick(invoice.expenseType)}
                >
                  Details
                </MDButton>
              </MDBox>
            </MDBox>
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Invoices.propTypes = {
  pdfUrl: PropTypes.string,
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      expenseType: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      file: PropTypes.object,
      house: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedHouse: PropTypes.string.isRequired,
  onDetailsClick: PropTypes.func.isRequired, // Ensure this is defined
};

export default Invoices;
