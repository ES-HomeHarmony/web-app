// SignInButton.js
import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button"; // Or use any other button component you prefer

function SignInButton({ onClick }) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      Sign In
    </Button>
  );
}

// Add PropTypes validation
SignInButton.propTypes = {
  onClick: PropTypes.func.isRequired, // Specify that onClick is a required function
};

export default SignInButton;
