Feature: Tenant submits an issue

  As a tenant, I want to submit an issue through the platform, so that the landlord is informed of the problem and its all unified in one place.

  Background:
    Given a tenant is logged in

  Scenario: Tenant sees a button to add an issue
    When they view the tenant dashboard
    Then they should see a button to add an issue

  Scenario: Tenant opens the issue submission form
    Given the tenant is in the tenant dashboard
    When they click the button to add an issue
    Then they should see an issue submission form with the fields "Title", "Description", "Priority", and "Status"

  Scenario: Tenant submits an issue successfully
    Given the tenant has filled out the issue submission form with:
      | Field       | Value                |
      | Title       | esquentador estragado        |
      | Description | a água não aquece   |
      | Priority    | High                |
      | Status      | To Be Fixed         |
    When they press the "Submit" button
    Then the system saves the issue details and provides a confirmation message "Issue submitted successfully"

  Scenario: Tenant submits an issue without required fields
    Given the tenant has filled out the issue submission form with:
      | Field       | Value |
      | Title       |       |
      | Description |       |
      | Priority    | Low   |
      | Status      | To Be Fixed  |
    When they press the "Submit" button
    Then the system should show an error message "Title and Description are required"
