import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button"; // Or use any other button component you prefer

function LogoutButton({ onClick }) {
  return (
    <Button variant="contained" color="error" onClick={onClick}>
      Logout
    </Button>
  );
}

// Add PropTypes validation
LogoutButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Specify that onClick is a required function
};

export default LogoutButton;
