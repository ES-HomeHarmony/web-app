import React from "react";
import MDBox from "components/MDBox";
import Icon from "@mui/material/Icon";

// AWS Cognito Hosted UI information
const cognitoDomain = "https://homeharmony.auth.eu-north-1.amazoncognito.com";
const clientId = "1ks0163ckccdfje0a1h7h78ffl";
const redirectUri = "http://localhost:3000"; // Your frontend callback URL
const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}`;

const handleSignIn = () => {
  window.location.href = loginUrl;
};

const SignInButton = () => (
  <MDBox
    display="flex"
    justifyContent="center"
    alignItems="center"
    width="3.25rem"
    height="3.25rem"
    bgColor="primary"
    shadow="sm"
    borderRadius="50%"
    position="fixed"
    right="2rem"
    top="2rem"
    zIndex={9999} // Increased z-index
    color="white"
    sx={{ cursor: "pointer" }}
    onClick={handleSignIn}
  >
    <Icon fontSize="small" color="inherit">
      login
    </Icon>
  </MDBox>
);

export default SignInButton;
