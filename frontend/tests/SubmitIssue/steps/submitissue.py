from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URLs for the application
APP_URL = "http://localhost:3000"
TENANT_DASHBOARD_URL = f"{APP_URL}/tenant_dashboard"
DASHBOARD_URL = f"{APP_URL}/dashboard"

@given("a tenant is logged in")
def step_impl(context):
    context.browser.get(APP_URL)
    context.browser.set_window_size(1472, 774)

    try:
      # Locate and click the "Sign In" button
      sign_in_button = WebDriverWait(context.browser, 10).until(
          EC.element_to_be_clickable((By.CSS_SELECTOR, ".css-1jpt7oq-MuiButtonBase-root-MuiButton-root"))
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


    #   # Wait for the URL to match the dashboard and ensure login was successful
    #   wait = WebDriverWait(context.browser, 1)
    #   wait.until(EC.url_to_be("http://localhost:3000/dashboard"))

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

@when("they view the tenant dashboard")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3")) #welcome message
    )

@then("they should see a button to add an issue")
def step_impl(context):
    add_issue_button = WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".MuiIcon-colorDark"))
    )
    assert add_issue_button is not None

@given("the tenant is in the tenant dashboard")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h3"))  # Welcome message
    )

@when("they click the button to add an issue")
def step_impl(context):
    add_issue_button = context.browser.find_element(By.CSS_SELECTOR, ".MuiIcon-colorDark")
    add_issue_button.click()

@then("they should see an issue submission form with the fields \"Title\", \"Description\", \"Priority\", and \"Status\"")
def step_impl(context):
    issue_form = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "form.MuiBox-root"))
    )
    assert issue_form is not None

    # Check for all required fields
    # Check the Title field
    title_field = context.browser.find_element(By.CSS_SELECTOR, "input[name='title']")
    assert title_field.is_displayed()

    # Check the Description field
    description_field = context.browser.find_element(By.CSS_SELECTOR, "input[name='description']")
    assert description_field.is_displayed()

    # Check the Priority dropdown
    priority_dropdown = context.browser.find_element(By.CSS_SELECTOR, "#mui-component-select-priority")
    assert priority_dropdown.is_displayed()

    # Check the Status dropdown
    status_dropdown = context.browser.find_element(By.CSS_SELECTOR, "#mui-component-select-status")
    assert status_dropdown.is_displayed()

@given("the tenant has filled out the issue submission form with")
def step_impl(context):
    context.browser.get(TENANT_DASHBOARD_URL)
    add_issue_button = context.browser.find_element(By.CSS_SELECTOR, ".MuiIcon-colorDark")
    add_issue_button.click()
    for row in context.table:
        field, value = row["Field"], row["Value"]
        if field == "Title":
            title_field = context.browser.find_element(By.CSS_SELECTOR, "input[name='title']")
            title_field.send_keys(value)
        elif field == "Description":
            description_field = context.browser.find_element(By.CSS_SELECTOR, "input[name='description']")
            description_field.send_keys(value)
        elif field == "Priority":
            priority_dropdown = context.browser.find_element(By.CSS_SELECTOR, "#mui-component-select-priority")
            priority_dropdown.click()
            priority_option = WebDriverWait(context.browser, 5).until(
                EC.presence_of_element_located((By.XPATH, f"//li[text()='{value}']"))
            )
            priority_option.click()
        elif field == "Status":
            status_dropdown = context.browser.find_element(By.CSS_SELECTOR, "#mui-component-select-status")
            status_dropdown.click()
            status_option = WebDriverWait(context.browser, 5).until(
                EC.presence_of_element_located((By.XPATH, f"//li[text()='{value}']"))
            )
            status_option.click()

@when("they press the \"Submit\" button")
def step_impl(context):
    submit_button = context.browser.find_element(By.XPATH, "//button[text()='Submit']")
    submit_button.click()

@then("the system saves the issue details and provides a confirmation message \"Issue submitted successfully\"")
def step_impl(context):
    confirmation_message = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".Toastify__toast-body > div:nth-child(2)"))
    )
    assert "Issue added successfully" in confirmation_message.text

@then("the system should show an error message \"Title and Description are required\"")
def step_impl(context):
    error_message = WebDriverWait(context.browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".Toastify__toast-body > div:nth-child(2)"))
    )
    assert "Title is required" in error_message.text