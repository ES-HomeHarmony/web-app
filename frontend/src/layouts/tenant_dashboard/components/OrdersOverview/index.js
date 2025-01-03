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

function OrdersOverview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueData, setIssueData] = useState({
    title: null,
    description: null,
    priority: "",
    status: "to-do",
    house_id: 1,
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIssueData({ title: null, description: null, priority: "", status: "to-do", house_id: 1 }); // Reset the issue data when closing the modal
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssueData({ ...issueData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("New Issue Data:", issueData);

    if (issueData.title === null) {
      toast.error("Title is required");
      return;
    }

    if (issueData.description === null) {
      toast.error("Description is required");
      return;
    }

    axios
      .post("http://localhost:8000/tenants/createIssue", issueData, { withCredentials: true })
      .then(() => {
        console.log("Issue added successfully");
        toast.success("Issue added successfully");
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error adding issue:", error);
        toast.error("Error adding issue");
      });
    handleCloseModal(); // Close modal after submission
  };
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Issues
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
              borderRadius: "50%", // Optional for a circular button
            }}
            style={{ cursor: "pointer" }}
            onClick={handleOpenModal}
          >
            <Icon fontSize="medium" color="dark">
              add
            </Icon>
          </MDBox>
          {/* <MDBox
            variant="gradient"
            bgColor="error"
            color="light"
            borderRadius="xl"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="4rem"s
            height="4rem"
            mt={-3}
            style={{ float: "right" }}
          >
            <Icon fontSize="medium" color="inherit">
              add
            </Icon>
          </MDBox> */}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, Design changes"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="success"
          icon="notifications"
          title="$2400, Design changes"
          dateTime="22 DEC 7:20 PM"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="New order #1832412"
          dateTime="21 DEC 11 PM"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="Server payments for April"
          dateTime="21 DEC 9:34 PM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="New card added for order #4395133"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="New card added for order #4395133"
          dateTime="20 DEC 2:20 AM"
        />
        <TimelineItem
          color="primary"
          icon="vpn_key"
          title="I need the key to the house"
          dateTime="18 DEC 4:54 AM"
          lastItem
        />
      </MDBox>
      <AddIssueModal
        open={isModalOpen}
        onClose={handleCloseModal}
        issueData={issueData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <div>
        {/* Your existing code */}
        <ToastContainer />
      </div>
    </Card>
  );
}

export default OrdersOverview;
