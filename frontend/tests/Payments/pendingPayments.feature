Feature: View Pending Payments
  As a landlord,
  I want to see a list of pending payments from tenants
  So that I can keep track of who has not yet paid their expenses.

  Scenario: Landlord views pending payments
    Given the landlord is logged into the system
    When the landlord navigates to the dashboard
    And selects a house with pending expenses
    Then they should see a list of pending expenses

  Scenario: Landlord verifies details of a specific pending expense
    Given the landlord is viewing the list of pending payments
    When the landlord clicks on details of a pending expense
    Then the system should display the tenants name and payment status