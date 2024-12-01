Feature: Contract Upload for Tenants
  As a landlord, I want to be able to upload a rent contract as a file (PDF, JPEG, or PNG) for each tenant of each house I have renting, so that I can have those files organized and the tenants can have access to them.

  Background:
    Given the landlord is logged in and on the upload contracts page

  Scenario: Display tenants for a selected house
    When they select a house from the dropdown
    Then they see the tenants associated with that house

  Scenario: Display acceptable file formats and size
    And they have selected a house
    When they see the file upload section
    Then they should see the acceptable file formats "PDF, JPEG, PNG" and size "Max 5MB"

  Scenario: Successful file upload
    And they have selected a house
    And they have selected a tenant
    When they upload a valid file with format "PDF" and size less than "5MB"
    Then they see a success message "Contract uploaded successfully!"

  Scenario: Invalid file upload
    And they have selected a house
    And they have selected a tenant
    When they upload an invalid file with format "TXT" or size greater than "5MB"
    Then they see an error message "Invalid file type."
