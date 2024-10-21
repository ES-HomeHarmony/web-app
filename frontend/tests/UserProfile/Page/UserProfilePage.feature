Feature: User Profile
  As a registered user, I want to see my name and email on my profile page

  Scenario: Profile information is displayed
    Given I am a registered user
    When I access the profile page
    Then I should see my name and email
