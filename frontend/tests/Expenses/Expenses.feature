Feature: Landlord Addition of Expenses
  As a landlord,
  I want to add monthly expenses, such as rent and utility bills,
  so that tenants know what they need to pay and when.

  Scenario: Successful file upload and notification
    Given a landlord who wants to upload a file
    When they select a PDF or image file (JPEG, PNG)
    Then the system should validate the file type and size (e.g., maximum 5MB)
    And the upload of the file is successful
    And the landlord should receive a success notification

  Scenario: File upload fails due to invalid type or size
    Given a landlord who wants to upload a file
    When they select an invalid file type or a file larger than 5MB
    Then the system should fail validation
    And the landlord should receive an error notification

  Scenario: Add new expense details
    Given that the landlord is adding a new expense
    When the landlord inputs details such as type, amount, payment deadline and file
    Then the expense is saved
    And success feedback is shown
