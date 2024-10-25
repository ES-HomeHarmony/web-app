from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException
from behave import given, when, then
import time

def login_simulation(driver):
    driver.get('http://localhost:3000/dashboard')  # Open the base URL to interact with local storage
    # Set mock data for authentication and user details
    mock_user_data = '{"name": "Mock User", "email": "mockuser@example.com", "role": "user"}'
    driver.execute_script("window.localStorage.setItem('user', arguments[0]);", mock_user_data)
    driver.execute_script("window.localStorage.setItem('access_token', 'mock-access-token');")
    time.sleep(2)  # Wait for local storage to set
    driver.refresh()  # Refresh the page to apply authentication

@given('I am at the profile page')
def step_impl(context):
    login_simulation(context.driver)
    context.driver.get('http://localhost:3000/profile')
    try:
        WebDriverWait(context.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "fullName"))
        )
        # Simulate the profile data being loaded into form fields
        context.driver.execute_script("""
            document.getElementById('fullName').value = 'Mock User';
            document.getElementById('email').value = 'mockuser@example.com';
        """)
    except TimeoutException:
        context.driver.save_screenshot("debug_profile_page_timeout.png")
        raise TimeoutException("Profile page did not load as expected.")

@when('I see my personal information on the page')
def step_impl(context):
    context.user_name = context.driver.find_element(By.ID, "user_name").text
    context.user_email = context.driver.find_element(By.ID, "user_email").text
    assert context.user_name and context.user_email, "User name or email not found on the profile page"

@then('I should see a button to edit my information')
def step_impl(context):
    edit_button = context.driver.find_element(By.ID, "edit_button")
    assert edit_button and edit_button.is_displayed(), "Edit button is not visible on the profile page"

# Other steps would follow the same pattern...

@given('I am on my profile page')
def step_impl(context):
    context.execute_steps('''
        Given I am at the profile page
    ''')

@when('I update my profile')
def step_impl(context):
    context.driver.find_element(By.ID, "edit_button").click()
    name_input = context.driver.find_element(By.ID, "fullName")
    name_input.clear()
    name_input.send_keys("New Mock Name")
    email_input = context.driver.find_element(By.ID, "email")
    email_input.clear()
    email_input.send_keys("newmockuser@example.com")
    context.driver.find_element(By.ID, "save_button").click()

@then('I should see a confirmation message')
def step_impl(context):
    WebDriverWait(context.driver, 5).until(
        EC.visibility_of_element_located((By.ID, "confirmation_message"))
    )
    message = context.driver.find_element(By.ID, "confirmation_message").text
    assert "Profile updated successfully" in message, "The confirmation message was not as expected"

@when('I attempt to update my profile with invalid data')
def step_impl(context):
    context.driver.find_element(By.ID, "edit_button").click()
    email_input = context.driver.find_element(By.ID, "email_input")
    email_input.clear()
    email_input.send_keys("invalid-email")  # Provide invalid email
    context.driver.find_element(By.ID, "save_button").click()

@then('I should see an error message')
def step_impl(context):
    WebDriverWait(context.driver, 5).until(
        EC.visibility_of_element_located((By.ID, "error_message"))
    )
    message = context.driver.find_element(By.ID, "error_message").text
    assert "Invalid data provided" in message, "The error message was not as expected"
