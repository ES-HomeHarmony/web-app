Feature: User SignUp
  As a new user
  I want to be redirected to Cognito's Hosted UI for authentication
  So that I can register my account

  Scenario: Redirect to Cognito Hosted UI and register account
    Given a new visitor on the landing page
    When they click the "Sign Up" button
    Then they should be redirected to the Cognito Hosted UI
    When they enter a valid email, given name and password
    And they submit the sign-up form
    Then they should be able to create an account
