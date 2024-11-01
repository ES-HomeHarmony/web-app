from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from unittest.mock import patch, Mock
from selenium.webdriver.common.action_chains import ActionChains
import requests

# URLs for the Cognito Hosted UI and application
COGNITO_HOSTED_UI_URL = "https://homeharmony-es.auth.eu-north-1.amazoncognito.com/login"
APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a visitor on the landing page")
def step_impl(context):
    # Open the landing page
    context.browser.get(APP_URL)
    context.browser.set_window_size(1920, 976)

@when('they click the "Sign In" button')
def step_impl(context):
    # Locate and click the "Sign In" button
    sign_in_button = WebDriverWait(context.browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-1jpt7oq-MuiButtonBase-root-MuiButton-root"))
    )
    sign_in_button.click()

@then("they should be redirected to the Cognito Hosted UI")
def step_impl(context):
    # Wait for the URL to match the Cognito Hosted UI
    WebDriverWait(context.browser, 10).until(
        EC.url_contains(COGNITO_HOSTED_UI_URL)
    )
    assert COGNITO_HOSTED_UI_URL in context.browser.current_url, "Failed to redirect to Cognito Hosted UI"

@when("they enter valid credentials")
def step_impl(context):
    # Enter email in the username field
    username_field = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf #signInFormUsername"))
    )
    username_field.click()
    username_field.send_keys("sct.saraalmeida@gmail.com")
    
    # Enter password in the password field
    password_field = context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf #signInFormPassword")
    password_field.click()
    password_field.send_keys("12345678_As")
    
    # Click the "Sign In" button on the Cognito page
    context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf > .btn").click()


@then("they should be authenticated and see their dashboard")
def step_impl(context):

    wait = WebDriverWait(context.browser, 1)
    wait.until(EC.url_to_be("http://localhost:3000/dashboard"))

    # Confirm the presence of the welcome message and house listings on the dashboard
    try:
        welcome_message = context.browser.find_element(By.CSS_SELECTOR, "h3")
        assert welcome_message is not None, "Welcome message not found on dashboard."


    except Exception as e:
        raise AssertionError("Expected elements not found on the dashboard: " + str(e))
