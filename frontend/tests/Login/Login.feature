Feature: User Login and Redirect
  As a registered user
  I want to be redirected to Cognito's Hosted UI for authentication
  So that I can access my dashboard upon successful login

  Scenario: Redirect to Cognito Hosted UI and return logged in
    Given a visitor on the landing page
    When they click the "Sign In" button
    Then they should be redirected to the Cognito Hosted UI
    When they enter valid credentials
    Then they should be authenticated and see their dashboard
