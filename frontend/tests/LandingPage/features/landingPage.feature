Feature: Landlord Dashboard
  As a landlord, I want to see the houses I have renting on the landing page

  Scenario: List of renting houses is displayed for the logged-in landlord
    Given I am logged in as a landlord
    When I access the landing page
    Then I should see the list of houses I have rented
