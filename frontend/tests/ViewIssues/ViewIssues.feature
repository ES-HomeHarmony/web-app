Feature: Vieww All Reported Issues
    As a landlord, I want to view a list of all reported issues reported by tenants, so that I can see the details of each problem
    
    Scenario: The landlord sees the list of issues reported for all the houses they have renting
        Given a landlord is logged in
        When they navigate to the dashboard 
        Then they can see a list of all reported issues for all their renting houses, including details such as the house where the issue is reported, issue title, description, priority and status and the buttons to mark an issue as being fixed or fixed