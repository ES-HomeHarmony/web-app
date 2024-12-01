import os
import tempfile
from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import UnexpectedAlertPresentException
from selenium.common.exceptions import NoAlertPresentException

# URLs for the application
APP_URL = "http://localhost:3000"
CONTRACTS_URL = f"{APP_URL}/contracts"

# Helper function to create a temporary file
def create_temp_file(file_name, content):
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, file_name)
    with open(file_path, "w") as temp_file:
        temp_file.write(content)
    return file_path


@given("the landlord is logged in and on the upload contracts page")
def step_impl(context):
    # Open the landing page
    context.browser.get(APP_URL)
    context.browser.set_window_size(1920, 976)

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

      # Wait for the URL to match the dashboard and ensure login was successful
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

    # Navigate to the contracts page (upload page)
    context.browser.find_element(By.CSS_SELECTOR, "a:nth-child(4) .MuiBox-root").click()

    # Ensure we're on the contract upload page
    WebDriverWait(context.browser, 10).until(
        EC.url_to_be(CONTRACTS_URL)
    )

@when("they select a house from the dropdown")
def step_select_house(context):
    # Select house from the dropdown
    select_element = context.browser.find_element(By.XPATH, "//label[text()='Select House']/following-sibling::div")
    select_element.click()

    context.browser.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(1)").click()

    # Wait for tenants to load after selecting the house
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.ID, "tenants_info"))
    )

@then("they see the tenants associated with that house")
def step_verify_tenants(context):
    # Wait for the tenant dropdown to be clickable
    tenants_dropdown = WebDriverWait(context.browser, 30).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#tenant-select .notranslate"))
    )
    
    # Click the tenant dropdown to reveal tenant options
    tenants_dropdown.click()

    # Wait for tenant items to be visible (wait for at least one tenant option to appear)
    tenant_items = WebDriverWait(context.browser, 30).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".MuiMenuItem-root"))
    )
    
    # Ensure tenant items are present and visible
    assert len(tenant_items) > 0, "No tenant items found in the dropdown"

    # # Print how many tenants were found for debugging purposes
    # print(f"Tenant items found: {len(tenant_items)}")

    # # Click the second tenant (or change logic to select based on specific criteria)
    # tenant_items[1].click()  # You can change the index based on available tenants

@then("they have selected a house")
def step_select_house(context):
    # Select house from the dropdown
    select_element = context.browser.find_element(By.XPATH, "//label[text()='Select House']/following-sibling::div")
    select_element.click()

    context.browser.find_element(By.CSS_SELECTOR, ".MuiMenuItem-root:nth-child(1)").click()

    # Wait for tenants to load after selecting the house
    WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.ID, "tenants_info"))
    )

@when("they see the file upload section")
def step_verify_file_upload_section(context):
    upload_section = WebDriverWait(context.browser, 10).until(
        EC.presence_of_element_located((By.ID, "upload-button-file"))
    )
    assert upload_section, "File upload section is not visible"

@then('they should see the acceptable file formats "{formats}" and size "{size}"')
def step_verify_file_formats_and_size(context, formats, size):
    label_text = context.browser.find_element(By.CSS_SELECTOR, "label[for='upload-button-file']").text

    assert formats in label_text, f"Expected formats '{formats}' not found in: {label_text}"
    assert size in label_text, f"Expected size '{size}' not found in: {label_text}"

@then("they have selected a tenant")
def step_verify_tenants(context):
    # Wait for the tenant dropdown to be clickable
    tenants_dropdown = WebDriverWait(context.browser, 30).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#tenant-select .notranslate"))
    )
    
    # Click the tenant dropdown to reveal tenant options
    tenants_dropdown.click()

    # Wait for tenant items to be visible (wait for at least one tenant option to appear)
    tenant_items = WebDriverWait(context.browser, 30).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".MuiMenuItem-root"))
    )
    
    # Ensure tenant items are present and visible
    assert len(tenant_items) > 0, "No tenant items found in the dropdown"

    # # Print how many tenants were found for debugging purposes
    # print(f"Tenant items found: {len(tenant_items)}")

    # # Click the second tenant (or change logic to select based on specific criteria)
    tenant_items[1].click()  # You can change the index based on available tenants


@when('they upload a valid file with format "{format}" and size less than "{size}"')
def step_upload_valid_file(context, format, size):
    # Create a temporary valid file
    valid_file_path = create_temp_file("valid_file.pdf", "This is a valid test file.")

    # Upload the file
    file_input = context.browser.find_element(By.ID, "upload-button-file")
    file_input.send_keys(valid_file_path)
    context.browser.find_element(By.ID, "save").click()

@then('they see a success message "{message}"')
def step_verify_success_message(context, message):
    success_message_element = WebDriverWait(context.browser, 20).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, ".Toastify__toast--success"))
    )
    success_message = success_message_element.text
    assert message in success_message, f"Expected success message '{message}' not displayed"

# @when('they upload an invalid file with format "{format}" or size greater than "{size}"')
# def step_upload_invalid_file(context, format, size):
#     # Upload the invalid file
#     invalid_file_path = create_temp_file("invalid_file.txt", "This is an invalid test file.")
#     file_input = context.browser.find_element(By.ID, "upload-button-file")
#     file_input.send_keys(invalid_file_path)
#     # Click the save button
#     context.browser.find_element(By.ID, "save")

#     # Handle the alert for invalid file type or size
#     try:
#         # Wait for the alert to appear
#         alert = WebDriverWait(context.browser, 10).until(EC.alert_is_present())
#         alert_text = alert.text
#         print(f"Alert text: {alert_text}")  # Debugging log
#         assert "Invalid file type" in alert_text, f"Unexpected alert text: {alert_text}"
#         alert.accept()  # Accept the alert
#     except Exception as e:
#         raise AssertionError(f"Unexpected error occurred: {str(e)}")


@when('they upload an invalid file with format "{format}" or size greater than "{size}"')
def step_upload_invalid_file(context, format, size):
    # Create a temporary invalid file based on the format
    if format == "TXT":
        invalid_file_path = create_temp_file("invalid_file.txt", "This is an invalid test file.")
    else:
        # If other format tests are needed (like large files), handle here.
        invalid_file_path = create_temp_file("invalid_file.txt", "This is a test file.")  # Adjust based on the file type needed

    try:
        # Upload the file by selecting it
        file_input = context.browser.find_element(By.ID, "upload-button-file")
        file_input.send_keys(invalid_file_path)        

    except NoAlertPresentException:
        # If no alert appears, report failure (this shouldn't happen)
        assert False, "Expected alert did not appear"

@then('they see an error message "{message}"')
def step_verify_error_message(context, message):
      
      # Wait for and check the alert
      WebDriverWait(context.browser, 10).until(
          EC.alert_is_present()
      )
      alert = context.browser.switch_to.alert
      alert_message = alert.text
      assert "Invalid file type" in alert_message, f"Unexpected alert message: {alert_message}"
      alert.accept()  # Close the alert after reading it

def after_scenario(context, scenario):
    context.browser.quit()
