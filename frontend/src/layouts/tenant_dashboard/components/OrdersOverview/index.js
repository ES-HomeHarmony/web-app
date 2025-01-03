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

// Custom AddIssueModal component
import AddIssueModal from "layouts/tenant_dashboard/components/AddIssueModal";

import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrdersOverview({
  selectedHouse,
  isTenant,
  issues,
  fetchIssues,
  handleSubmit,
  handleDelete,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({});

  const handleOpenModal = (issue = {}) => {
    setIssueData(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssueData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({ ...issueData, [name]: value });
  };

  const submitIssue = async () => {
    try {
      await handleSubmit(issueData);
      handleCloseModal();
    } catch (error) {
      toast.error("Error saving issue.");
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Issues
          {isTenant && (
            <MDBox
              variant="gradient"
              bgColor="warning"
              sx={{
                float: "right",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenModal()}
            >
              <Icon fontSize="medium" color="dark">
                add
              </Icon>
            </MDBox>
          )}
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
              title={issue.title}
              dateTime={new Date(issue.created_at).toLocaleString()}
              description={
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <span>{issue.description}</span>
                  <MDBox display="flex" gap={1}>
                    {isTenant && (
                      <>
                        <Icon
                          style={{ cursor: "pointer", color: "blue" }}
                          onClick={() => handleOpenModal(issue)}
                        >
                          edit
                        </Icon>
                        <Icon
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDelete(issue.id)}
                        >
                          delete
                        </Icon>
                      </>
                    )}
                    {!isTenant && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditIssueStatus(issue.id, "being_fixed")}
                        >
                          Mark Being Fixed
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEditIssueStatus(issue.id, "fixed")}
                        >
                          Mark Fixed
                        </Button>
                      </>
                    )}
                  </MDBox>
                </MDBox>
              }
            />
          ))
        ) : (
          <MDTypography>No issues found for this house.</MDTypography>
        )}
      </MDBox>
      <AddIssueModal
        open={isModalOpen}
        onClose={handleCloseModal}
        issueData={issueData}
        handleChange={handleChange}
        handleSubmit={submitIssue}
      />
      <div>
        {/* Your existing code */}
        <ToastContainer />
      </div>
    </Card>
  );
}

OrdersOverview.propTypes = {
  selectedHouse: PropTypes.object,
  isTenant: PropTypes.bool.isRequired,
  issues: PropTypes.array,
  fetchIssues: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleEditIssueStatus: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default OrdersOverview;
