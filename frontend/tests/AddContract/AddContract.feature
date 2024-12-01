Feature: Contract Upload for Tenants
  As a landlord, I want to be able to upload a rent contract as a file (PDF, JPEG, or PNG) for each tenant of each house I have renting, so that I can have those files organized and the tenants can have access to them.

  Background:
    Given a landlord with houses for renting and tenants associated with them

  Scenario: Display tenants for a selected house
    Given the landlord is on the contract upload page
    When they select a house from the dropdown
    Then they see the tenants associated with that house

  Scenario: Display acceptable file formats and size
    Given the landlord is on the contract upload page
    And they have selected a house
    When they see the file upload section
    Then they should see the acceptable file formats "PDF, JPEG, PNG" and size "maximum 5MB"

  Scenario: Successful file upload
    Given the landlord is on the contract upload page
    And they have selected a house
    And they have selected a tenant
    When they upload a valid file with format "PDF" and size less than "5MB"
    Then they see a success message "File uploaded successfully"

  Scenario: Invalid file upload
    Given the landlord is on the contract upload page
    And they have selected a house
    And they have selected a tenant
    When they upload an invalid file with format "TXT" or size greater than "5MB"
    Then they see an error message "Invalid file format or size"
