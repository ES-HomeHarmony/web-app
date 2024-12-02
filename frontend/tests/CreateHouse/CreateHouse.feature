Feature: Add and manage a new house for a landlord

As a landlord, I want to be able to add new houses so that I can manage all the houses I have for rent.

  Scenario: Landlord adds a new house to manage
    Given a landlord is on the dashboard page
    When they click on the card to create a new house
    And they fill in the form with valid house details
    And they submit the form by clicking the Create House button
    Then they should see a confirmation that the house has been created