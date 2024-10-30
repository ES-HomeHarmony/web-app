from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

@given("I am logged in as a landlord")
def step_given_logged_in_landlord(context):
    context.driver = webdriver.Chrome()  # Use the appropriate driver
    context.driver.get("http://localhost:3000")  # Update to your app URL

    # Assume login function is available
    login_button = context.driver.find_element(By.ID, "signInButton")  # Adjust selector
    login_button.click()
    time.sleep(1)  # Wait for login redirection, adjust as needed

    # Check login success
    assert "Welcome back!" in context.driver.page_source

@when("I access the landing page")
def step_when_access_landing_page(context):
    context.driver.get("http://localhost:3000/dashboard")  # Landing page URL
    time.sleep(1)  # Wait for the page to load

@then("I should see the list of houses I have rented")
def step_then_list_of_rented_houses(context):
    # Locate elements representing the rented houses
    houses = context.driver.find_elements(By.CLASS_NAME, "house-card")  # Adjust selector
    assert len(houses) > 0, "No rented houses are displayed"
    context.driver.quit()
