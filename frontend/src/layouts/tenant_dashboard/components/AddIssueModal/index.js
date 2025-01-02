import React from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Icon } from "@mui/material";

const AddIssueModal = ({ open, onClose, issueData, handleChange, handleSubmit }) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <MDTypography variant="h5" fontWeight="bold" mb={1}>
          Add Issue
          <MDBox
            variant="button"
            color="secondary"
            onClick={onClose}
            sx={{ display: "flex", fontWeight: "bold", float: "right" }}
            style={{ cursor: "pointer" }}
          >
            <Icon fontSize="small">close</Icon>
          </MDBox>
        </MDTypography>
        <MDBox component="form" style={{ width: "100%" }}>
          <MDInput
            type="text"
            label="Title"
            name="title"
            value={issueData.title}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
          <MDInput
            type="text"
            label="Description"
            name="description"
            value={issueData.description}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={issueData.priority}
              onChange={handleChange}
              label="priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={issueData.status} onChange={handleChange} label="status">
              <MenuItem value="to-do">To Be Fixed</MenuItem>
              <MenuItem value="in_progress">Being Fixed</MenuItem>
              <MenuItem value="done">Fixed</MenuItem>
            </Select>
          </FormControl>
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleSubmit}
            fullWidth
            style={{ fontWeight: "bold", padding: "12px" }}
          >
            Submit
          </MDButton>
        </MDBox>
      </Box>
    </Modal>
  );
};

AddIssueModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  issueData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AddIssueModal;
