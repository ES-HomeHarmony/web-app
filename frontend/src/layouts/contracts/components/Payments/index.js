import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";

function Payments({ tenants = [] }) {
  const [tenantContracts, setTenantContracts] = useState([]);

  useEffect(() => {
    if (tenants.length > 0) {
      console.log("Tenants received in Payments component:", tenants); // Debug tenants data
      const formattedContracts = tenants
        .filter((tenant) => tenant.contract) // Only include tenants with contracts
        .map((tenant) => ({
          tenantName: tenant.name,
          contractUrl: tenant.contract, // Ensure this matches your backend response
        }));
      console.log("Formatted contracts:", formattedContracts); // Debug formatted contracts
      setTenantContracts(formattedContracts);
    } else {
      console.log("No tenants provided to Payments component.");
      setTenantContracts([]);
    }
  }, [tenants]);

  const openPdf = (url) => {
    if (url) {
      window.open(url, "_blank"); // Open the PDF in a new tab
    }
  };

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
                &nbsp;View Contract
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
      name: PropTypes.string.isRequired,
      contract: PropTypes.string,
    })
  ).isRequired,
};

export default Payments;
