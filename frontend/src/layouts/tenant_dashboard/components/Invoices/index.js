import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

import { toast } from "react-toastify";

import tenantService from "services/tenantService";

function Invoices({ selectedHouse, onDetailsClick }) {
  const [expenses, setExpenses] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [role, setRole] = useState(null); // Store user role
  const [loggedInTenantId, setLoggedInTenantId] = useState(null);

  const openPdf = async (expenseId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/houses/expenses/${expenseId}/download`,
        { responseType: "arraybuffer" }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      window.open(url, "_blank");
    } catch (error) {
      console.error("Error fetching the PDF:", error);
      alert("Error fetching the PDF");
    }
  };

  // Fetch user role on component mount
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const UserRole = await tenantService.fetchUserRole();
        setRole(UserRole);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchRole();
  }, []);

  // Fetch tenant ID and expenses
  useEffect(() => {
    if (selectedHouse && selectedHouse.id) {
      const fetchData = async () => {
        try {
          // Fetch tenant ID if role is "tenant"
          if (role === "tenant") {
            const tenantId = await tenantService.fetchTenantId();
            console.log("tenantId AQUI", tenantId);
            setLoggedInTenantId(tenantId);
          }

          // Fetch expenses
          const response = await axios.get(
            `http://localhost:8000/houses/expenses/${selectedHouse.id}`
          );

          // Filter expenses based on tenant payment status
          const filteredExpenses = response.data.filter((expense) => {
            if (role === "tenant" && loggedInTenantId) {
              const tenantStatus = expense.tenants.find(
                (tenant) => tenant.tenant_id === loggedInTenantId
              )?.status;
              return tenantStatus !== "paid";
            }
            return expense.status !== "paid";
          });

          setExpenses(filteredExpenses);
        } catch (error) {
          console.error("Error fetching expenses or tenant ID:", error);
        }
      };
      fetchData();
    }
  }, [selectedHouse, role, loggedInTenantId]);

  const handlePayedClick = async (expense) => {
    try {
      if (!loggedInTenantId) {
        const tenantId = await tenantService.fetchTenantId();
        setLoggedInTenantId(tenantId);
      }

      await axios.put(`http://localhost:8000/houses/tenants/${loggedInTenantId}/pay`, null, {
        params: { expense_id: expense.id },
      });

      setExpenses((prevExpenses) =>
        prevExpenses.map((e) =>
          e.id === expense.id
            ? {
                ...e,
                tenants: e.tenants.map((t) =>
                  t.tenant_id === loggedInTenantId ? { ...t, status: "paid" } : t
                ),
              }
            : e
        )
      );

      toast.success("Payment marked as paid successfully!");
    } catch (error) {
      console.error("Error marking expense as paid:", error);
      toast.error("Error marking expense as paid");
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Expenses
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {expenses.map((expense) => (
            <MDBox
              key={expense.id}
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
                  {expense.title}
                </MDTypography>
                <MDTypography variant="caption" color="error" mb={1}>
                  {expense.created_at}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" gap={2}>
                <MDTypography variant="body2" fontWeight="medium" color="warning" mr={1}>
                  €{expense.amount}
                </MDTypography>
                {expense.file_path && (
                  <MDTypography
                    variant="button"
                    display="flex"
                    fontWeight="bold"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => openPdf(expense.id)}
                  >
                    <Icon fontSize="small">picture_as_pdf</Icon>
                    <MDTypography variant="button" fontWeight="bold">
                      &nbsp;PDF
                    </MDTypography>
                  </MDTypography>
                )}
                {role !== "tenant" ? (
                  <MDButton
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => onDetailsClick(expense.id)}
                  >
                    Details
                  </MDButton>
                ) : (
                  <MDButton
                    variant="outlined"
                    size="small"
                    color={
                      expense.tenants.find((t) => t.tenant_id === loggedInTenantId)?.status ===
                      "paid"
                        ? "success"
                        : "info"
                    }
                    onClick={() => {
                      if (
                        expense.tenants.find((t) => t.tenant_id === loggedInTenantId)?.status !==
                        "paid"
                      ) {
                        handlePayedClick(expense);
                      }
                    }}
                    disabled={
                      expense.tenants.find((t) => t.tenant_id === loggedInTenantId)?.status ===
                      "paid"
                    }
                  >
                    {expense.tenants.find((t) => t.tenant_id === loggedInTenantId)?.status ===
                    "paid"
                      ? "Paid"
                      : "Pay"}
                  </MDButton>
                )}
              </MDBox>
            </MDBox>
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Invoices.defaultProps = {
  pdfUrl: "",
};

Invoices.propTypes = {
  pdfUrl: PropTypes.string,
  selectedHouse: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    landlord_id: PropTypes.string,
  }).isRequired,
  onDetailsClick: PropTypes.func.isRequired,
};

export default Invoices;
