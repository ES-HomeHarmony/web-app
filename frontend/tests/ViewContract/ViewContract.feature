Feature: Tenant Views Contract
    As a tenant, 
    I want to be able to access my contract when I need to, 
    so that I can confirm its details or use it if needed

    Scenario: Tenant sees the button to see their contract in the dashboard
        Given a logged in tenant
        When they access the dashboard and select a house 
        Then they should see a button to see their contract

    
    Scenario: Tenant clicks the button and the contract opens in a new tab
        Given the contract has been uploaded by the landlord
        When the tenant clicks the button to see their contract
        Then a tab opens with the contract

