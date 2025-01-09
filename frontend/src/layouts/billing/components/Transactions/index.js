import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import { useEffect, useState } from "react";
import axios from "axios";

function PaidExpenses({ selectedHouse }) {
  const [paidExpenses, setPaidExpenses] = useState([]);

  // Fetch paid expenses based on the selected house
  useEffect(() => {
    if (selectedHouse && selectedHouse.id) {
      const fetchPaidExpenses = async () => {
        try {
          const response = await axios.get(
            `http://housemanagement-alb-2122003581.eu-north-1.elb.amazonaws.com/houses/expenses/${selectedHouse.id}`
          );

          const filteredExpenses = response.data.filter((expense) => expense.status === "paid");
          setPaidExpenses(filteredExpenses);
        } catch (error) {
          console.error("Error fetching paid expenses:", error);
        }
      };
      fetchPaidExpenses();
    }
  }, [selectedHouse]);

  const openPdf = (url) => {
    if (url) {
      window.open(url, "_blank"); // Open the PDF in a new tab
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Paid Expenses
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular">
            Latest Transactions
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        {paidExpenses.length > 0 ? (
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            {paidExpenses.map((expense, index) => (
              <MDBox key={index} component="li" py={1} pr={2} mb={1}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDBox display="flex" alignItems="center">
                    <MDBox mr={2}>
                      <Icon color="success">check_circle</Icon>
                    </MDBox>
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography variant="button" fontWeight="medium" gutterBottom>
                        {expense.title}
                      </MDTypography>
                      <MDTypography variant="caption" color="text" fontWeight="regular">
                        {new Date(expense.created_at).toLocaleDateString()} at{" "}
                        {new Date(expense.created_at).toLocaleTimeString()}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                  {expense.file_path && (
                    <MDTypography
                      variant="button"
                      display="flex"
                      fontWeight="bold"
                      alignItems="center"
                      sx={{ cursor: "pointer" }}
                      onClick={() => openPdf(expense.file_path)}
                    >
                      <Icon fontSize="small">picture_as_pdf</Icon>
                      <MDTypography variant="button" fontWeight="bold">
                        &nbsp;PDF
                      </MDTypography>
                    </MDTypography>
                  )}
                  <MDTypography variant="button" color="success" fontWeight="medium" textGradient>
                    €{expense.amount}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
          </MDBox>
        ) : (
          <MDTypography variant="caption" color="text.secondary" fontWeight="medium">
            No paid expenses found.
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

PaidExpenses.propTypes = {
  selectedHouse: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default PaidExpenses;
