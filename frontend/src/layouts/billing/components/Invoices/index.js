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
  const [role, setRole] = useState(null); // Add state to store user role
  const [loggedInTenantId, setLoggedInTenantId] = useState(null);

  const openPdf = async (expenseId) => {
    try {
      // Faz a requisição para o backend
      const response = await axios.get(
        `http://localhost:8000/houses/expenses/${expenseId}/download`,
        { responseType: "arraybuffer" } // Recebe o arquivo como arraybuffer
      );

      // Cria uma URL temporária para o arquivo PDF
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      // Abre a URL em uma nova aba
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
        setRole(UserRole); // Store user role in state
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchRole();
  }, []);

  // Fetch expenses based on the selected house
  useEffect(() => {
    if (selectedHouse && selectedHouse.id) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/houses/expenses/${selectedHouse.id}`
          );
          const pendingExpenses = response.data.filter((expense) => expense.status !== "paid");
          setExpenses(pendingExpenses);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };
      fetchExpenses();
    }
  }, [selectedHouse]);

  // useEffect(() => {
  //   const fetchTenant = async () => {
  //     try {
  //       const tenantId = await tenantService.fetchTenantId();
  //       console.log("Fetched Tenant ID:", tenantId); // Debug line
  //       setLoggedInTenantId(tenantId);
  //     } catch (error) {
  //       console.error("Failed to fetch tenant ID:", error);
  //     }
  //   };
  //   fetchTenant();
  // }, []);

  const handleDetailsClick = async (expenseId) => {
    try {
      // Fetch tenant payment statuses for the selected expense
      const response = await axios.get(`http://localhost:8000/houses/expense/${expenseId}`);

      console.log("Tenant data for expense:", response.data); // Debug line

      if (response.data && response.data.tenants) {
        console.log("Tenants:", response.data.tenants); // Debug line
        setTenants(response.data.tenants); // Display tenant payment statuses
        const allPaid = response.data.tenants.every((tenant) => tenant.status === "paid");

        if (allPaid) {
          // Update the status of the expense to 'paid'
          await axios.put(`http://localhost:8000/houses/expenses/${expenseId}/mark-paid`);
        }
      } else {
        console.warn("No tenant data received for the selected expense");
      }

      // Refresh invoices to reflect any changes
      const updatedInvoicesResponse = await axios.get(
        `http://localhost:8000/houses/expenses/${selectedHouse.id}`
      );
      const pendingExpenses = updatedInvoicesResponse.data.filter(
        (expense) => expense.status !== "paid"
      );
      setExpenses(pendingExpenses);

      onDetailsClick(expenseId); // Pass expenseId for tracking
    } catch (error) {
      console.error("Error fetching tenant payment status or updating expense:", error);
    }
  };

  // const handlePayedClick = async (expenseId) => {
  //   try {
  //     await axios.put(`http://localhost:8000/houses/expenses/${expenseId}/mark-paid`);
  //     setPaidExpenses((prev) => new Set([...prev, expenseId])); // Mark expense as paid
  //   } catch (error) {
  //     console.error("Error marking expense as paid:", error);
  //   }
  // };
  const handlePayedClick = async (expense) => {
    try {
      let tenantId = loggedInTenantId;

      // Fetch tenant ID if not already available
      if (!tenantId) {
        try {
          tenantId = await tenantService.fetchTenantId();
          console.log("Fetched Tenant ID:", tenantId); // Debug line
          setLoggedInTenantId(tenantId);
        } catch (error) {
          console.error("Failed to fetch tenant ID:", error);
          toast.error("Unable to fetch tenant ID");
          return; // Exit early if tenant ID fetch fails
        }
      }

      // Proceed with marking the expense as paid
      await axios.put(
        `http://localhost:8000/houses/tenants/${tenantId}/pay`,
        null, // No request body is sent
        {
          params: { expense_id: expense.id }, // Pass expense_id as a query parameter
        }
      );

      // Update the local state to reflect the change
      setExpenses((prevExpenses) =>
        prevExpenses.map((e) =>
          e.id === expense.id
            ? {
                ...e,
                tenants: e.tenants.map((t) =>
                  t.tenant_id === tenantId ? { ...t, status: "paid" } : t
                ),
              }
            : e
        )
      );

      console.log("Payment marked as paid successfully!");
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
          {expenses.map((expense, index) => (
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
                {role !== "tenant" ? ( // Conditionally render the Details button
                  <MDButton
                    variant="outlined"
                    color="info"
                    size="small"
                    // onClick={() => handleDetailsClick(expense.id)}
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
                        handlePayedClick(expense); // Only call if not already paid
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
