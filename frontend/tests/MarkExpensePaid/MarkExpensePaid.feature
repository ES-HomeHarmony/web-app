Feature: Tenant marks expense as paid
    As a tenant, 
    I want to be able to mark my expenses as paid, 
    so that I can keep track of the expenses I still need to pay and my landlord knows I paid it.

    Scenario: Tenant sees button to mark expense as paid when it is still pending payment
        Given a logged in tenant in the dashboard
        When they have expenses pending payment
        Then they can see a button to mark the expense as paid
    
    Scenario: Tenant marks expense as paid
        Given a logged in tenant in the dashboard with expenses pending payment
        When they click the button mark as paid
        Then the expense is marked as paid