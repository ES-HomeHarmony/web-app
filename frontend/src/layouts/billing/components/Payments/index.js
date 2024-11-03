import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";

function Payments({ invoices, tenants = [], selectedExpense }) {
  const [expenseTenantStatuses, setExpenseTenantStatuses] = useState([]);

  // Initialize tenant statuses per expense only when an expense is created or selected
  useEffect(() => {
    if (selectedExpense) {
      const selectedExpenseDetails = invoices.find(
        (invoice) => invoice.expenseType === selectedExpense
      );

      if (selectedExpenseDetails) {
        const statusesForSelectedExpense = {
          expenseType: selectedExpenseDetails.expenseType,
          tenants: tenants.map((tenant) => ({
            name: tenant,
            status:
              selectedExpenseDetails.paidBy && selectedExpenseDetails.paidBy.includes(tenant)
                ? "green"
                : "red",
          })),
        };
        setExpenseTenantStatuses([statusesForSelectedExpense]);
      } else {
        setExpenseTenantStatuses([]);
      }
    } else {
      setExpenseTenantStatuses([]);
    }
  }, [selectedExpense, invoices, tenants]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Payments
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {selectedExpense && expenseTenantStatuses.length > 0 ? (
          expenseTenantStatuses.map((expense, index) => (
            <MDBox key={index} mb={3}>
              <MDTypography variant="subtitle1" fontWeight="medium">
                {expense.expenseType}
              </MDTypography>
              <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                {expense.tenants.map((tenantStatus, tenantIndex) => (
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
                    <MDTypography
                      variant="subtitle2"
                      fontWeight="medium"
                      color={tenantStatus.status}
                    >
                      {tenantStatus.name}
                    </MDTypography>
                    <MDTypography variant="caption" color={tenantStatus.status} fontWeight="medium">
                      {tenantStatus.status === "green" ? "Paid" : "Not Paid"}
                    </MDTypography>
                    {tenantStatus.status === "red" && (
                      <MDButton variant="outlined" color="error">
                        <AddAlertOutlinedIcon fontSize="small" color="error">
                          add_alert_outlined
                        </AddAlertOutlinedIcon>{" "}
                        Notify
                      </MDButton>
                    )}
                  </MDBox>
                ))}
              </MDBox>
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
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      expenseType: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      file: PropTypes.object,
      house: PropTypes.string.isRequired,
      paidBy: PropTypes.arrayOf(PropTypes.string), // Array of tenant names who paid
    })
  ).isRequired,
  tenants: PropTypes.arrayOf(PropTypes.string), // List of tenants
  selectedExpense: PropTypes.string, // Selected expense prop
};

export default Payments;
