import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function Payments({ tenants = [], selectedExpense, isLoading }) {
  const [expenseTenantStatuses, setExpenseTenantStatuses] = useState([]);

  useEffect(() => {
    console.log("Selected Expense:", selectedExpense);
    console.log("Tenants:", tenants);
    if (selectedExpense && tenants.length > 0) {
      const formattedTenantStatuses = tenants.map((tenant) => ({
        name: `Tenant ${tenant.tenant_name}`, // Replace with actual tenant name if available
        status: tenant.status === "paid" ? "green" : "red",
      }));
      setExpenseTenantStatuses(formattedTenantStatuses);
    } else {
      setExpenseTenantStatuses([]);
    }
  }, [selectedExpense, tenants]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payments
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {isLoading ? ( // Show loading indicator
          <CircularProgress />
        ) : selectedExpense && expenseTenantStatuses.length > 0 ? (
          expenseTenantStatuses.map((tenantStatus, tenantIndex) => (
            <MDBox
              key={tenantIndex}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                mb: 1,
                backgroundColor: tenantStatus.status === "green" ? "#e8f5e9" : "#ffebee",
              }}
            >
              <MDTypography variant="subtitle2" fontWeight="medium" color={tenantStatus.status}>
                {tenantStatus.name}
              </MDTypography>
              <MDTypography variant="caption" color={tenantStatus.status} fontWeight="medium">
                {tenantStatus.status === "green" ? "Paid" : "Not Paid"}
              </MDTypography>
              {/* {tenantStatus.status === "red" && (
                <MDButton variant="outlined" color="error">
                  <AddAlertOutlinedIcon fontSize="small" color="error">
                    add_alert_outlined
                  </AddAlertOutlinedIcon>{" "}
                  Notify
                </MDButton>
              )} */}
            </MDBox>
          ))
        ) : (
          <MDTypography variant="caption" color="text.secondary" fontWeight="medium">
            Select an expense to view payment details.
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
  isLoading: PropTypes.bool,
};

export default Payments;
