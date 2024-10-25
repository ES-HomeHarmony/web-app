from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from behave import given, when, then
import time

def set_local_storage(driver, key, value):
    driver.execute_script("window.localStorage.setItem(arguments[0], arguments[1]);", key, value)

def get_local_storage(driver, key):
    return driver.execute_script(f"return window.localStorage.getItem('{key}');")

@given('I am logged in as a landlord')
def step_impl(context):
    context.browser = webdriver.Chrome()
    context.browser.get("http://localhost:3000/dashboard")
    
    # Mocking user authentication by setting local storage
    set_local_storage(context.browser, 'JWTToken', 'mock-jwt-token-for-testing')
    set_local_storage(context.browser, 'user', '{"name": "John Landlord", "email": "landlord@example.com", "role": "landlord"}')
    
    context.browser.refresh()  # Refresh to apply local storage settings
    time.sleep(3)  # Allow some time for the page to process the local storage and update the state

    # Check for JWT token in local storage to confirm login
    jwt_token = get_local_storage(context.browser, 'JWTToken')
    if jwt_token:
        print("JWT Token found in local storage. Login confirmed.")
    else:
        print("JWT Token not found in local storage. Login not confirmed.")
        context.browser.quit()
        raise Exception("Login not confirmed by JWT token presence.")

@when('I access the landing page')
def step_impl(context):
    # Explicitly navigating to the landing page to ensure context
    context.browser.get("http://localhost:3000/dashboard")

@then('I should see the list of houses I have rented')
def step_impl(context):
    try:
        # Use a more general CSS selector to find all relevant house elements
        houses = WebDriverWait(context.browser, 10).until(
            EC.visibility_of_all_elements_located((By.CSS_SELECTOR, ".MuiGrid-root > .MuiBox-root > .MuiPaper-root"))
        )
        assert len(houses) > 0, "No houses displayed for the logged-in landlord"
        print(f"Displayed houses count: {len(houses)}")
    except TimeoutException:
        print("Failed to find the houses on the dashboard.")
        context.browser.save_screenshot("debug_no_houses_found.png")
        context.browser.quit()
        raise
    finally:
        context.browser.quit()


