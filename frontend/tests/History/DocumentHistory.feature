Feature: Landlord View Document History
    As a landlord
    I want to view the history of all uploaded documents 
    so that I can have a record of all invoices and receipts in the system

  Scenario: Landlord views document history
    Given the landlord is logged into the system
    When the landlord navigates to the dashboard
    And selects a house with payed expenses
    Then they should see an history of payed expenses
    And they should be able to access the documents
