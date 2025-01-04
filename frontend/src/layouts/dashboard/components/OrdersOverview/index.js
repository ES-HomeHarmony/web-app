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

// @mui material components
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import landlordService from "../../../../services/landlordService";

function OrdersOverview({ issues }) {
  const [houseNames, setHouseNames] = useState({});

  useEffect(() => {
    const fetchHouseNames = async () => {
      const houseNameMapping = {};
      for (const issue of issues) {
        try {
          const response = await landlordService.getHouseById(issue.house_id);
          if (response) {
            houseNameMapping[issue.house_id] = response.house.name;
          }
        } catch (error) {
          toast.error(`Error getting house name for house ID: ${issue.house_id}`);
        }
      }
      setHouseNames(houseNameMapping);
    };

    if (issues.length > 0) {
      fetchHouseNames();
    }
  }, [issues]);

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Issues
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {issues.length > 0 ? (
          issues.map((issue, index) => (
            <TimelineItem
              key={index}
              color={
                issue.priority === "high"
                  ? "error"
                  : issue.priority === "medium"
                  ? "warning"
                  : "success"
              }
              icon={
                issue.status === "to-do"
                  ? "pending"
                  : issue.status === "in_progress"
                  ? "build"
                  : "check_circle"
              }
              title={
                <MDBox display="flex" justifyContent="space-between">
                  <span>{issue.title}</span>
                  <span>{houseNames[issue.house_id] || "Loading..."}</span>
                </MDBox>
              }
              dateTime={new Date(issue.created_at).toLocaleDateString()}
              description={
                <MDBox display="flex" flexDirection="column" justifyContent="space-between">
                  <span>{issue.description}</span>
                  <MDBox display="flex" gap={1} mt={1}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<Icon>build</Icon>}
                      onClick={() => handleEditIssueStatus(issue.id, "in_progress")}
                      sx={{
                        backgroundColor: "#2196f3",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                        },
                        textTransform: "none",
                        fontWeight: "bold",
                        width: "140px", // Set a fixed width
                        height: "40px", // Set a fixed height
                      }}
                    >
                      Mark Being Fixed
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      startIcon={<Icon>check_circle</Icon>}
                      onClick={() => handleEditIssueStatus(issue.id, "done")}
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#388e3c",
                        },
                        textTransform: "none",
                        fontWeight: "bold",
                        width: "140px", // Set a fixed width
                        height: "40px", // Set a fixed height
                      }}
                    >
                      Mark Fixed
                    </Button>
                  </MDBox>
                </MDBox>
              }
            />
          ))
        ) : (
          <MDTypography>No issues found for you !</MDTypography>
        )}
      </MDBox>
      <div>
        <ToastContainer />
      </div>
    </Card>
  );
}

OrdersOverview.propTypes = {
  issues: PropTypes.array,
};

export default OrdersOverview;
