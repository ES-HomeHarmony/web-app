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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

// Sample static data
const transactionData = [
  {
    name: "Electricity Bill",
    description: "27 March 2020, 12:30 PM",
    value: "- $100",
    type: "Utility",
  },
  { name: "Water Bill", description: "26 March 2020, 10:00 AM", value: "- $30", type: "Utility" },
  { name: "Gas Bill", description: "25 March 2020, 9:15 AM", value: "- $50", type: "Utility" },
  {
    name: "Internet Bill",
    description: "25 March 2020, 8:45 AM",
    value: "- $45",
    type: "Subscription",
  },
];

function Transactions() {
  const [sortOption, setSortOption] = useState("");
  const [filterOption, setFilterOption] = useState("All");

  // Handle sorting
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Handle filtering
  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  // Sort and filter the transactions based on user selection
  const sortedFilteredTransactions = [...transactionData]
    .filter((transaction) => filterOption === "All" || transaction.type === filterOption)
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "date") return new Date(b.description) - new Date(a.description);
      if (sortOption === "type") return a.type.localeCompare(b.type);
      return 0;
    });

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Your Transactions
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
          {sortedFilteredTransactions.map((transaction) => (
            <Transaction
              key={transaction.name}
              color="success"
              icon="expand_less"
              name={transaction.name}
              description={transaction.description}
              value={transaction.value}
            />
          ))}
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Transactions;
