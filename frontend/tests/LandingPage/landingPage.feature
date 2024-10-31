Feature: Landlord Dashboard
  As a landlord, I want to see the houses I have renting on the landing page

  Scenario: List of renting houses is displayed for the logged-in landlord
    Given a logged in landlord
    When they access the landing page
    Then they should see the list of houses they have rented
