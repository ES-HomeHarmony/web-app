from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URLs for the application
APP_URL = "http://localhost:3000"
TENANT_DASHBOARD_URL = f"{APP_URL}/tenant_dashboard"

@given("a logged in tenant")
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
      username_field.send_keys("sarafalmeida@ua.pt")
      
      # Enter password in the password field
      password_field = context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf #signInFormPassword")
      password_field.click()
      password_field.send_keys("12345678_As")
      
      # Click the "Sign In" button on the Cognito page
      context.browser.find_element(By.CSS_SELECTOR, "div:nth-child(2) > div > div > .cognito-asf > .btn").click()


    #   # Wait for the URL to match the dashboard and ensure login was successful with the role of tenant
      wait = WebDriverWait(context.browser, 1)
      wait.until(EC.url_to_be("http://localhost:3000/tenant_dashboard"))

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

@when("they access the dashboard and select a house")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.MuiCard-root"))  # Welcome message
    )

    select_house_button = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
    select_house_button.click()

@then("they should see a button to see their contract")
def step_impl(context):

    see_contract = context.browser.find_element(By.XPATH, "//button[text()='See Contract']")
    assert see_contract.is_displayed()

@given("the contract has been uploaded by the landlord")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3"))  # Welcome message
    )

    select_house_button = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
    select_house_button.click()

    see_contract = context.browser.find_element(By.XPATH, "//button[text()='See Contract']")
    assert see_contract.is_displayed()

@when("the tenant clicks the button to see their contract")
def step_impl(context):

    see_contract = context.browser.find_element(By.CSS_SELECTOR, ".css-rndp25-MuiButtonBase-root-MuiButton-root")
    see_contract.click()

@then("a tab opens with the contract")
def step_impl(context):
    # Save the current window handles before the contract tab opens
    initial_window_handles = context.browser.window_handles

    see_contract = context.browser.find_element(By.CSS_SELECTOR, ".css-rndp25-MuiButtonBase-root-MuiButton-root")
    see_contract.click()

    # Wait for the new tab to open
    WebDriverWait(context.browser, 40).until(
        lambda driver: len(driver.window_handles) > len(initial_window_handles)
    )

    # Identify the new tab handle
    new_tab_handle = list(set(context.browser.window_handles) - set(initial_window_handles))[0]

    # Switch to the new tab
    context.browser.switch_to.window(new_tab_handle)

    # Perform assertions to ensure the PDF is displayed
    try:
        # Verify the URL contains '.pdf' or matches an expected pattern
        assert "blob" in context.browser.current_url, "The new tab does not display a PDF as expected."

        # Optionally log the URL for debugging
        print(f"PDF URL: {context.browser.current_url}")

    except Exception as e:
        raise AssertionError(f"Error verifying the PDF tab: {str(e)}")

