// SignUpButton.js
import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";

function SignUpButton({ onClick }) {
  return (
    <Button variant="contained" color="secondary" onClick={onClick}>
      Sign Up
    </Button>
  );
}

SignUpButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SignUpButton;