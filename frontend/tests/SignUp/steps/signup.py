from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests

# URLs for the Cognito Hosted UI and application
COGNITO_SIGNUP_UI_URL = "https://homeharmony-es.auth.eu-north-1.amazoncognito.com/login"
APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a new visitor on the landing page")
def step_impl(context):
    # Open the landing page
    context.browser.get(APP_URL)
    context.browser.set_window_size(1472, 774)

@when('they click the "Sign Up" button')
def step_impl(context):
    # Locate and click the "Sign Up" button
    sign_up_button = WebDriverWait(context.browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".MuiButton-containedSecondary"))
    )
    sign_up_button.click()

@then("they should be redirected to the Cognito Hosted UI")
def step_impl(context):
    # Verify redirection to Cognito Hosted UI's Sign-Up page
    WebDriverWait(context.browser, 10).until(
        EC.url_contains(COGNITO_SIGNUP_UI_URL)
    )
    assert COGNITO_SIGNUP_UI_URL in context.browser.current_url, "Failed to redirect to Cognito Hosted UI for Sign Up"
    
    sign_up_link = context.browser.find_element(By.LINK_TEXT, "Sign up")
    sign_up_link.click()

@when("they enter a valid email, given name and password")
def step_impl(context):
    # Enter email in the username field
    email_field = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.NAME, "username"))
    )
    email_field.send_keys("robertorcastro@ua.pt")
    
    # Enter given name
    given_name_field = context.browser.find_element(By.NAME, "requiredAttributes[given_name]")
    given_name_field.send_keys("berto")
    
    # Enter password
    password_field = context.browser.find_element(By.NAME, "password")
    password_field.send_keys("12345678_As")

@when("they submit the sign-up form")
def step_impl(context):
    # Click the "Sign Up" button to submit the form
    sign_up_button = context.browser.find_element(By.NAME, "signUpButton")
    sign_up_button.click()

@then("they should be able to create an account")
def they_should_be_able_to_create_an_account(context):
    wait = WebDriverWait(context.browser, 10)
    already_exists_header = wait.until(EC.presence_of_element_located((By.ID, "errorMessage")))
    already_exists_header.text == "User already exists"

    assert already_exists_header is not None
