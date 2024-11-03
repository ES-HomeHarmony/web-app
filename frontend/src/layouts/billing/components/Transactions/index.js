import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// @mui material components
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

function Transactions({ selectedHouse }) {
  const [expenses, setExpenses] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  // Fetch expenses when selectedHouse is defined
  useEffect(() => {
    if (selectedHouse) {
      const fetchExpenses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/houses/expenses/${selectedHouse.id}`
          );
          setExpenses(response.data);
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };
      fetchExpenses();
    }
  }, [selectedHouse]);

  // Handle sorting
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Handle filtering
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Sort and filter the transactions
  const sortedFilteredExpenses = [...expenses]
    .filter((transaction) => filterOption === "All" || transaction.type === filterOption)
    .sort((a, b) => {
      if (sortOption === "name") return a.title.localeCompare(b.title);
      if (sortOption === "date") return new Date(b.created_at) - new Date(a.created_at);
      if (sortOption === "type") return a.type.localeCompare(b.type);
      return 0;
    });

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize" color="primary">
          Expenses
        </MDTypography>
        <MDBox display="flex" alignItems="center">
          <Select value={sortOption} onChange={handleSortChange} displayEmpty>
            <MenuItem value="">Sort By</MenuItem>
            <MenuItem value="name">File Name</MenuItem>
            <MenuItem value="date">Upload Date</MenuItem>
            <MenuItem value="type">Document Type</MenuItem>
          </Select>
          <Select value={filterOption} onChange={handleFilterChange} displayEmpty sx={{ ml: 2 }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Utility">Utility</MenuItem>
            <MenuItem value="Subscription">Subscription</MenuItem>
          </Select>
        </MDBox>
      </MDBox>
      <MDBox pt={3} pb={2} px={2}>
        <MDBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {sortedFilteredExpenses.map((expense) => (
            <Transaction
              key={expense.id}
              color="success"
              icon="picture_as_pdf"
              name={expense.title}
              description={expense.deadline_date} // Using deadline_date for description
              value={`€${expense.amount}`} // Formatting amount with €
              pdfUrl={expense.file_path || "#"} // Setting PDF URL or fallback
            />
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

Transactions.propTypes = {
  selectedHouse: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default Transactions;
