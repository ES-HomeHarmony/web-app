Feature: Profile Edit
  As a user, I want to see a button to edit my information on the profile page

  Scenario: Edit button is visible on the profile page
    Given I am viewing my profile
    When I look at the screen
    Then I should see a button to edit my information
