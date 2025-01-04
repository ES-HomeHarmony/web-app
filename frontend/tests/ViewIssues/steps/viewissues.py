from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URLs for the application
APP_URL = "http://localhost:3000"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a landlord is logged in")
def step_impl(context):
    context.browser.get(APP_URL)
    context.browser.set_window_size(1472, 774)

    try:
      # Locate and click the "Sign In" button
      sign_in_button = WebDriverWait(context.browser, 10).until(
          EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-bctnwj-MuiButtonBase-root-MuiButton-root"))
      )
      sign_in_button.click()

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


    #   # Wait for the URL to match the dashboard and ensure login was successful with the role of tenant
      wait = WebDriverWait(context.browser, 1)
      wait.until(EC.url_to_be("http://localhost:3000/dashboard"))

      # Confirm the presence of the welcome message and house listings on the dashboard
      try:
          welcome_message = context.browser.find_element(By.CSS_SELECTOR, "h3")
          assert welcome_message is not None, "Welcome message not found on dashboard."


      except Exception as e:
          raise AssertionError("Expected elements not found on the dashboard: " + str(e))
    
    except Exception as e:
        print("Sign In button not found, user is already logged in.")
    # WebDriverWait(context.browser, 10).until(
    #     EC.presence_of_element_located((By.XPATH, "//button[contains(text(), 'Logout')]"))
    # )

@when("they navigate to the dashboard")
def step_impl(context):
    context.browser.get(DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3")) #welcome message
    )

@then("they can see a list of all reported issues for all their renting houses, including details such as the house where the issue is reported, issue title, description, priority and status and the buttons to mark an issue as being fixed or fixed")
def step_impl(context):
    # Confirm the presence of the house listings on the dashboard
    try:
        house_listings = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
        assert house_listings is not None, "House listings not found on dashboard."

    except Exception as e:
        raise AssertionError("Expected elements not found on the dashboard: " + str(e))
    
    # Check the Issues field
    issues = context.browser.find_element(By.XPATH, "//h6[text()='Issues']")
    assert issues.is_displayed()

    # Check if buttons to mark an issue as being fixed or fixed are displayed
    mark_as_being_fixed_button = context.browser.find_element(By.XPATH, "//button[text()='Mark Being Fixed']")
    assert mark_as_being_fixed_button.is_displayed()

    mark_as_fixed_button = context.browser.find_element(By.XPATH, "//button[text()='Mark Fixed']")
    assert mark_as_fixed_button.is_displayed()

