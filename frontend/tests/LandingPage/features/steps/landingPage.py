from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

@given("I am logged in as a landlord")
def step_impl(context):
    # Visit the dashboard page
    context.browser.get("http://localhost:3000/dashboard")

    # Set a mock cookie for `access_token`
    context.browser.add_cookie({
        "name": "access_token",
        "value": "mock_access_token",  # Mock token value
        "path": "/"
    })
    context.browser.refresh()

@when("I access the landing page")
def step_impl(context):
    context.browser.get("http://localhost:3000/dashboard")

@then("I should see the list of houses I have rented")
def step_impl(context):
    # Wait for the landlord's welcome message to appear
    try:
        print("Waiting for welcome message to appear...")
        WebDriverWait(context.browser, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h3[contains(text(), 'Welcome back Test Landlord')]"))
        )
        # Assert that each expected house is displayed on the dashboard
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Aveiro')]")
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Lisbon')]")
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Porto')]")
    except Exception as e:
        raise AssertionError("Expected houses not found: " + str(e))
