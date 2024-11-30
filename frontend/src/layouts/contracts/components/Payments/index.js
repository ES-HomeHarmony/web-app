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

  // Fetch contracts for tenants when the selectedExpense or tenants change
  useEffect(() => {
    if (selectedExpense && tenants.length > 0) {
      // Fetch contracts related to the tenants
      const fetchContracts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/expense/contracts/${selectedExpense}`,
            { withCredentials: true }
          );
          // Assuming the response returns contracts associated with tenants
          const contracts = response.data.contracts;
          setTenantContracts(contracts);
        } catch (error) {
          console.error("Error fetching contracts:", error);
        }
      };

      fetchContracts();
    } else {
      setTenantContracts([]);
    }
  }, [selectedExpense, tenants]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Contracts
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {selectedExpense && tenantContracts.length > 0 ? (
          tenantContracts.map((contract, index) => {
            // Find the tenant related to this contract
            const tenant = tenants.find((tenant) => tenant.tenant_id === contract.tenant_id);

            return (
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
                  backgroundColor: "#e8f5e9", // Green background for contract data
                }}
              >
                <MDTypography variant="subtitle2" fontWeight="medium">
                  {tenant ? tenant.name : "Unknown Tenant"}
                </MDTypography>
                <MDTypography variant="caption" color="text.secondary" fontWeight="medium">
                  Contract ID: {contract.id} {/* You can customize this */}
                </MDTypography>
                <MDButton variant="outlined" color="primary">
                  View Contract Details
                </MDButton>
              </MDBox>
            );
          })
        ) : (
          <MDTypography variant="caption" color="text.secondary" fontWeight="medium">
            Select an expense to view contract details.
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
