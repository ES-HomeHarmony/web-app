from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from unittest.mock import patch, Mock

# Replace these URLs with your actual Cognito Hosted UI and app URLs
COGNITO_HOSTED_UI_URL = "https://homeharmony-es.auth.eu-north-1.amazoncognito.com/login"
APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a visitor on the landing page")
def step_impl(context):
    # Navigate to the landing page
    context.browser.get(APP_URL)

@when('they click the "Sign In" button')
def step_impl(context):
    # Locate and click the "Sign In" button
    sign_in_button = context.browser.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
    sign_in_button.click()


@then("they should be redirected to the Cognito Hosted UI")
def step_impl(context):
    # Wait and check that the current URL matches the Cognito Hosted UI
    WebDriverWait(context.browser, 10).until(
        EC.url_contains(COGNITO_HOSTED_UI_URL)
    )
    assert COGNITO_HOSTED_UI_URL in context.browser.current_url, "Failed to redirect to Cognito Hosted UI"

@when("they return with a valid access token")
def step_impl(context):
    # Simulate returning to the app after login by setting the access token in cookies
    context.browser.get(APP_URL)  # Navigate back to the app's main URL
    context.browser.add_cookie({
        "name": "access_token",
        "value": "mock_access_token",  # Substitute with a suitable mock token
        "path": "/"
    })
    context.browser.refresh()  # Refresh to apply the cookie

    # Mock the `/auth/profile` API call to return user data as if authenticated
    context.mocked_user_profile = {
        "name": "Test Landlord",
        "houses": [
            {"location": "House Aveiro", "tenants": 18},
            {"location": "House Lisbon", "tenants": 9},
            {"location": "House Porto", "tenants": 4},
        ]
    }

    # Patch axios.get to intercept calls to `/auth/profile` endpoint
    with patch("axios.get") as mock_get:
        # Mock the response for /auth/profile
        mock_response = Mock()
        mock_response.json.return_value = context.mocked_user_profile
        mock_get.return_value = mock_response
        context.mocked_get = mock_get

@then("they should be authenticated and see their dashboard")
def step_impl(context):
    # Verify redirection to the dashboard and presence of user information
    context.browser.get(DASHBOARD_URL)

    # Wait for a welcome message or dashboard content
    try:
        WebDriverWait(context.browser, 10).until(
            EC.presence_of_element_located((By.XPATH, "//h3[contains(text(), 'Welcome back Test Landlord')]"))
        )
        # Verify the list of houses on the dashboard
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Aveiro')]")
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Lisbon')]")
        assert context.browser.find_element(By.XPATH, "//*[contains(text(), 'House Porto')]")
    except Exception as e:
        raise AssertionError("Expected elements not found on the dashboard: " + str(e))
