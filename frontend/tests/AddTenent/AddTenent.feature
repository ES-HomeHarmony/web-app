Feature: Add Tenant Functionality for Landlords

  Scenario: Landlord adds a tenant to an existing house
    Given the landlord is logged in and on the dashboard
    When the landlord selects a house from the dropdown menu
    And the landlord clicks on "Add Tenants"
    Then a modal form appears
    When the landlord fills in the tenant's name "Roberto"
    And the landlord fills in the tenant's email "teste2@teste.com"
    And the landlord fills in the monthly rent "350"
    And the landlord clicks the "Submit" button
    Then the tenant is added successfully
    And a success notification is shown
