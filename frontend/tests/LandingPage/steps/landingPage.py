from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from unittest.mock import patch, Mock
from selenium.webdriver.common.action_chains import ActionChains
import requests

APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a logged in landlord")
def step_impl(context):
    # Open the landing page
    context.browser.get(APP_URL)
    context.browser.set_window_size(1920, 976)

@when("they access the landing page")
def step_impl(context):

    wait = WebDriverWait(context.browser, 1)
    wait.until(EC.url_to_be("http://localhost:3000/dashboard"))

    # Confirm the presence of the welcome message and house listings on the dashboard
    try:
        welcome_message = context.browser.find_element(By.CSS_SELECTOR, "h3")
        assert welcome_message is not None, "Welcome message not found on dashboard."


    except Exception as e:
        raise AssertionError("Not logged in" + str(e))
    
@then("they should see the list of houses they have rented")
def step_impl(context):
    # Confirm the presence of the house listings on the dashboard
    try:
        house_listings = context.browser.find_element(By.CSS_SELECTOR, ".MuiGrid-root:nth-child(3) .MuiPaper-root > .MuiBox-root:nth-child(1)")
        assert house_listings is not None, "House listings not found on dashboard."

    except Exception as e:
        raise AssertionError("Expected elements not found on the dashboard: " + str(e))
