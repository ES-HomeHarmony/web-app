Feature: Tenant Landing page
    As a logged in tenant, I want the landing page to have my houses list of expenses still to pay and the issues list so I have a concise overview of what is important and urgent to do.

    Scenario: List of rented houses is displayed for the logged-in tenant
        Given a logged in user with the role of tenant
        When they get to the landing page 
        Then the user should be able to see all the houses they rent so they can select one to see the details
    
    Scenario: Expenses still to pay and list of issues is displayed for the house selected by the tenant
        Given a logged in user with the role of tenant in the landing page
        When they select a house 
        Then they should be able to see their household’s list of expenses still to pay and list of issues

    Scenario: The list of issues is displayed as well the buttons to add, delete and edit an issue
        Given a logged in user with the role of tenant in the landing page
        When they select a house with issues 
        Then they should be able to see the buttons to add, delete and edit an issue

