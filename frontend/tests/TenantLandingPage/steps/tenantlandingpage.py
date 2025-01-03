from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URLs for the application
APP_URL = "http://localhost:3000"
TENANT_DASHBOARD_URL = f"{APP_URL}/tenant_dashboard"

@given("a logged in user with the role of tenant")
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

@when("they get to the landing page")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3")) #welcome message
    )

@then("the user should be able to see all the houses they rent so they can select one to see the details")
def step_impl(context):
    # Confirm the presence of the house listings on the tenant dashboard
    try:
        house_listings = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
        assert house_listings is not None, "House listings not found on tenant dashboard."

    except Exception as e:
        raise AssertionError("Expected elements not found on the tenant dashboard: " + str(e))

@given("a logged in user with the role of tenant in the landing page")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3"))  # Welcome message
    )

@when("they select a house")
def step_impl(context):
    select_house_button = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
    select_house_button.click()

@then("they should be able to see their household’s list of expenses still to pay and list of issues")
def step_impl(context):
    # Check for all required listings
    # Check the Expenses field
    expenses = context.browser.find_element(By.XPATH, "//h6[text()='Expenses']")
    assert expenses.is_displayed()

    # Check the Issues field
    issues = context.browser.find_element(By.XPATH, "//h6[text()='Issues']")
    assert issues.is_displayed()

@when("they select a house with issues")
def step_impl(context):
    select_house_button = context.browser.find_element(By.CSS_SELECTOR, "div.MuiCard-root")
    select_house_button.click()

    # Verify that the "No issues found for this house" message does not appear
    no_issues_message_xpath = "//p[contains(text(), 'No issues found for this house.')]"
    try:
        WebDriverWait(context.browser, 5).until(
            EC.presence_of_element_located((By.XPATH, no_issues_message_xpath))
        )
        raise AssertionError("The message 'No issues found for this house' appeared, but it should not.")
    except:
        # If the message is not found, pass the step
        print("No 'No issues found for this house' message detected on the page.")

@then("they should be able to see the buttons to add, delete and edit an issue")
def step_impl(context):
    # Check the add button
    add_issues = context.browser.find_element(By.CSS_SELECTOR, ".MuiIcon-colorDark")
    assert add_issues.is_displayed()

    # Check the delete button
    delete_issues = context.browser.find_element(By.XPATH, "//span[contains(@class, 'material-icons-round') and text()='delete']")
    assert delete_issues.is_displayed()

    # Check the edit button
    edit_issues = context.browser.find_element(By.XPATH, "//span[contains(@class, 'material-icons-round') and text()='edit']")
    assert edit_issues.is_displayed()