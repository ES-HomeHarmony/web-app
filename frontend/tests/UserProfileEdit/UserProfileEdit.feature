Feature: Profile Edit
  As a user, I want to see a button to edit my information on the profile page

  Scenario: Edit button is visible on the profile page
    Given I am at the profile page
    When I see my personal information on the page
    Then I should see a button to edit my information

  Scenario: Successfully updating profile information
    Given I am on my profile page
    When I update my profile
    Then I should see a confirmation message

  Scenario: Updating profile with invalid data
    Given I am on my profile page
    When I attempt to update my profile with invalid data
    Then I should see an error message
