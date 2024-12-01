import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";

function Payments({ tenants = [], selectedExpense }) {
  const [tenantContracts, setTenantContracts] = useState([]);

  useEffect(() => {
    if (tenants.length > 0) {
      // Extract contract information directly from tenants
      console.log("Tenants:", tenants); // Debug line
      const formattedContracts = tenants.map((tenant) => ({
        tenantName: tenant.name,
        contractUrl: tenant.contarct, // Assuming `contract` contains the file URL
      }));
      setTenantContracts(formattedContracts);
    } else {
      setTenantContracts([]);
    }
  }, [tenants]);

  const openPdf = (url) => {
    if (url) {
      window.open(url, "_blank"); // Open the PDF in a new tab
    }
  };

  console.log(tenantContracts);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Contracts
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {tenantContracts.length > 0 ? (
          tenantContracts.map((contract, index) => (
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
                backgroundColor: "#e8f5e9",
              }}
            >
              <MDTypography variant="subtitle2" fontWeight="medium">
                {contract.tenantName}
              </MDTypography>
              <MDTypography
                variant="button"
                display="flex"
                fontWeight="bold"
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => openPdf(contract.contractUrl)}
              >
                <Icon fontSize="small">picture_as_pdf</Icon>
                <MDTypography variant="button" fontWeight="bold">
                  &nbsp;View Contract
                </MDTypography>
              </MDTypography>
            </MDBox>
          ))
        ) : (
          <MDTypography variant="caption" color="text.secondary" fontWeight="medium">
            No contracts available for the selected tenants.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

Payments.propTypes = {
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      tenant_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired, // Status should be "paid" or "pending"
    })
  ).isRequired,
  selectedExpense: PropTypes.string, // Selected expense ID or identifier
};

export default Payments;
