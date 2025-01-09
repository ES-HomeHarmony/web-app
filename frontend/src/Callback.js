import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import tenantService from "services/tenantService";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract authorization code from the URL
    const searchParams = new URLSearchParams(window.location.search);
    const authorizationCode = searchParams.get("code");

    if (authorizationCode) {
      // Exchange the authorization code for tokens
      exchangeCodeForTokens(authorizationCode);
    } else {
      // Redirect to login if no code is found
      navigate("/login");
    }
  }, [navigate]);

  const exchangeCodeForTokens = async (code) => {
    const clientId = "1ks0163ckccdfje0a1h7h78ffl"; // Your Cognito App Client ID
    const redirectUri =
      "http://userservice-alb-883434472.eu-north-1.elb.amazonaws.com/userservice/auth/login"; // The same as used during login

    // Request to exchange authorization code for tokens
    const data = {
      grant_type: "authorization_code",
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
    };

    try {
      const response = await axios.post(
        "https://homeharmony.auth.eu-north-1.amazoncognito.com/oauth2/token",
        new URLSearchParams(data),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      console.log("Token response:", response.data); // Log the full response
      const { access_token, id_token, refresh_token } = response.data;

      // Store the tokens in local storage or state management solution
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("id_token", id_token);
      localStorage.setItem("refresh_token", refresh_token);

      const role = await tenantService.fetchUserRole(); // Fetch user role

      if (role === "tenant") {
        navigate("/tenant-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error exchanging code for tokens:", error);
      // Handle errors (e.g., redirect to login)
      navigate("/login");
    }
  };

  return <div>Processing callback...</div>;
};

export default Callback;
